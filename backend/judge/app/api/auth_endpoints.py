import os
import secrets
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from operator import or_
from typing import Annotated

from app.core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.db import SessionDep
from app.models import EmailVerification, User
from app.schemas.user_schemas import (
    EmailVerificationRequest,
    MessageResponse,
    RegistrationResponse,
    ResendVerificationRequest,
    Token,
    UserCreate,
)
from app.services.email_services import EmailDeliveryError, send_verification_email
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select

router = APIRouter(prefix="/auth", tags=["Authentication"])

VERIFICATION_CODE_DIGITS = 6


def _verification_ttl_minutes() -> int:
    value = int(os.getenv("EMAIL_VERIFICATION_TTL_MINUTES", "10"))
    return max(value, 1)


def _generate_verification_code() -> str:
    return f"{secrets.randbelow(10**VERIFICATION_CODE_DIGITS):0{VERIFICATION_CODE_DIGITS}d}"


def _hash_verification_code(code: str) -> str:
    return sha256(code.encode("utf-8")).hexdigest()


def _is_code_expired(expires_at: datetime) -> bool:
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    return expires_at < datetime.now(timezone.utc)


def _set_verification_code(session: SessionDep, user: User) -> str:
    code = _generate_verification_code()
    code_hash = _hash_verification_code(code)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=_verification_ttl_minutes())

    verification = session.exec(
        select(EmailVerification).where(EmailVerification.user_id == user.id)
    ).first()

    if verification:
        verification.code_hash = code_hash
        verification.expires_at = expires_at
        verification.email = user.email
        session.add(verification)
    else:
        session.add(
            EmailVerification(
                user_id=user.id,
                email=user.email,
                code_hash=code_hash,
                expires_at=expires_at,
            )
        )

    return code


@router.post("/register", response_model=RegistrationResponse)
def register(user_in: UserCreate, session: SessionDep):
    """
    Registra un usuario inactivo y envía código de verificación por correo.
    """
    normalized_email = user_in.email.strip().lower()
    existing_by_email = session.exec(
        select(User).where(User.email == normalized_email)
    ).first()

    if existing_by_email and existing_by_email.is_active:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    existing_by_username = session.exec(
        select(User).where(User.username == user_in.username)
    ).first()

    if existing_by_username and (
        not existing_by_email or existing_by_username.id != existing_by_email.id
    ):
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")

    user = existing_by_email or User(
        username=user_in.username,
        email=normalized_email,
        hashed_password=get_password_hash(user_in.password),
        is_active=False,
    )

    if existing_by_email:
        user.username = user_in.username
        user.email = normalized_email
        user.hashed_password = get_password_hash(user_in.password)
        user.is_active = False

    try:
        session.add(user)
        session.flush()

        code = _set_verification_code(session, user)
        send_verification_email(
            to_email=user.email,
            username=user.username,
            code=code,
            expires_minutes=_verification_ttl_minutes(),
        )
        session.commit()
    except EmailDeliveryError as exc:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error al crear el usuario")

    return RegistrationResponse(
        message="Te enviamos un código de verificación a tu correo",
        email=user.email,
    )


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(payload: EmailVerificationRequest, session: SessionDep):
    normalized_email = payload.email.strip().lower()
    user = session.exec(select(User).where(User.email == normalized_email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if user.is_active:
        return MessageResponse(message="El correo ya está verificado")

    verification = session.exec(
        select(EmailVerification).where(EmailVerification.user_id == user.id)
    ).first()
    if not verification:
        raise HTTPException(status_code=400, detail="No hay un código activo para este correo")

    if _is_code_expired(verification.expires_at):
        session.delete(verification)
        session.commit()
        raise HTTPException(status_code=400, detail="El código expiró. Solicita uno nuevo")

    if _hash_verification_code(payload.code) != verification.code_hash:
        raise HTTPException(status_code=400, detail="El código es incorrecto")

    user.is_active = True

    try:
        session.add(user)
        session.delete(verification)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="No se pudo verificar el correo")

    return MessageResponse(message="Correo verificado correctamente. Ya puedes iniciar sesión")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(payload: ResendVerificationRequest, session: SessionDep):
    normalized_email = payload.email.strip().lower()
    user = session.exec(select(User).where(User.email == normalized_email)).first()

    if not user:
        return MessageResponse(
            message="Si el correo existe, se envió un nuevo código de verificación"
        )

    if user.is_active:
        return MessageResponse(message="El correo ya está verificado")

    try:
        code = _set_verification_code(session, user)
        send_verification_email(
            to_email=user.email,
            username=user.username,
            code=code,
            expires_minutes=_verification_ttl_minutes(),
        )
        session.commit()
    except EmailDeliveryError as exc:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="No se pudo reenviar el código")

    return MessageResponse(message="Te enviamos un nuevo código de verificación")


@router.post("/token", response_model=Token)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep,
):
    """
    Endpoint para obtener el Token JWT (Login).
    """
    login_id = form_data.username.strip()
    login_email = login_id.lower()
    query = select(User).where(or_(User.username == login_id, User.email == login_email))
    user = session.exec(query).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Debes verificar tu correo antes de iniciar sesión",
        )

    verification = session.exec(
        select(EmailVerification).where(EmailVerification.user_id == user.id)
    ).first()
    if verification:
        if user.is_active:
            user.is_active = False
            session.add(user)
        if _is_code_expired(verification.expires_at):
            session.delete(verification)
            try:
                session.commit()
            except Exception:
                session.rollback()
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El código de verificación expiró. Solicita uno nuevo",
            )
        try:
            session.commit()
        except Exception:
            session.rollback()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Debes verificar tu correo antes de iniciar sesión",
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
