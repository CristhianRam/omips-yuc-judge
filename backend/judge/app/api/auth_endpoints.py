"""
@file backend/judge/app/api/auth_endpoints.py
@description Endpoints REST del backend Judge y dependencias de API.
@symbols _verification_ttl_minutes, _normalize_email, _normalize_username, _generate_verification_code, _hash_verification_code, _is_code_expired, _get_pending_registration_for_update, _upsert_pending_registration, _refresh_pending_code, register, ...
"""

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
from app.models import PendingRegistration, User
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
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

router = APIRouter(prefix="/auth", tags=["Authentication"])

VERIFICATION_CODE_DIGITS = 6


def _verification_ttl_minutes() -> int:
    try:
        value = int(os.getenv("EMAIL_VERIFICATION_TTL_MINUTES", "10"))
    except ValueError:
        value = 10
    return max(value, 1)


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _normalize_username(username: str) -> str:
    return username.strip()


def _generate_verification_code() -> str:
    return f"{secrets.randbelow(10**VERIFICATION_CODE_DIGITS):0{VERIFICATION_CODE_DIGITS}d}"


def _hash_verification_code(code: str) -> str:
    return sha256(code.encode("utf-8")).hexdigest()


def _is_code_expired(expires_at: datetime) -> bool:
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    return expires_at < datetime.now(timezone.utc)


def _get_pending_registration_for_update(
    session: SessionDep, *, email: str
) -> PendingRegistration | None:
    query = select(PendingRegistration).where(PendingRegistration.email == email)
    query = query.with_for_update()
    return session.exec(query).first()


def _upsert_pending_registration(
    session: SessionDep, *, email: str, username: str, password_hash: str
) -> str:
    now_utc = datetime.now(timezone.utc)
    code = _generate_verification_code()
    code_hash = _hash_verification_code(code)
    expires_at = now_utc + timedelta(minutes=_verification_ttl_minutes())

    pending = _get_pending_registration_for_update(session, email=email)

    if pending:
        pending.username = username
        pending.password_hash = password_hash
        pending.code_hash = code_hash
        pending.expires_at = expires_at
        pending.updated_at = now_utc
        session.add(pending)
    else:
        session.add(
            PendingRegistration(
                email=email,
                username=username,
                password_hash=password_hash,
                code_hash=code_hash,
                expires_at=expires_at,
                created_at=now_utc,
                updated_at=now_utc,
            )
        )

    session.flush()
    return code


def _refresh_pending_code(session: SessionDep, pending: PendingRegistration) -> str:
    now_utc = datetime.now(timezone.utc)
    code = _generate_verification_code()
    pending.code_hash = _hash_verification_code(code)
    pending.expires_at = now_utc + timedelta(minutes=_verification_ttl_minutes())
    pending.updated_at = now_utc
    session.add(pending)
    session.flush()
    return code


@router.post("/register", response_model=RegistrationResponse)
def register(user_in: UserCreate, session: SessionDep):
    """
    Inicia registro pendiente y envia codigo de verificacion por correo.
    El usuario se crea en la tabla final solo despues de verificar el codigo.
    """
    normalized_email = _normalize_email(str(user_in.email))
    normalized_username = _normalize_username(user_in.username)

    if not normalized_username:
        raise HTTPException(status_code=400, detail="El nombre de usuario es obligatorio")

    existing_active_email = session.exec(
        select(User).where(User.email == normalized_email, User.is_active == True)
    ).first()
    if existing_active_email:
        raise HTTPException(status_code=400, detail="El email ya esta registrado")

    existing_active_username = session.exec(
        select(User).where(User.username == normalized_username, User.is_active == True)
    ).first()
    if existing_active_username:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya esta en uso")

    password_hash = get_password_hash(user_in.password)

    try:
        code = _upsert_pending_registration(
            session,
            email=normalized_email,
            username=normalized_username,
            password_hash=password_hash,
        )
        session.commit()
    except IntegrityError:
        # Si hubo carrera al crear el pending por email, reintenta y la ultima
        # escritura gana para evitar codigos cruzados.
        session.rollback()
        try:
            code = _upsert_pending_registration(
                session,
                email=normalized_email,
                username=normalized_username,
                password_hash=password_hash,
            )
            session.commit()
        except Exception:
            session.rollback()
            raise HTTPException(status_code=500, detail="Error al iniciar el registro")
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error al iniciar el registro")

    try:
        send_verification_email(
            to_email=normalized_email,
            username=normalized_username,
            code=code,
            expires_minutes=_verification_ttl_minutes(),
        )
    except EmailDeliveryError:
        raise HTTPException(
            status_code=503,
            detail="No se pudo enviar el codigo. Intenta reenviar el codigo.",
        )
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="No se pudo enviar el codigo. Intenta reenviar el codigo.",
        )

    return RegistrationResponse(
        message="Te enviamos un codigo de verificacion a tu correo",
        email=normalized_email,
    )


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(payload: EmailVerificationRequest, session: SessionDep):
    normalized_email = _normalize_email(str(payload.email))

    pending = _get_pending_registration_for_update(session, email=normalized_email)
    if not pending:
        raise HTTPException(status_code=400, detail="No hay un codigo activo para este correo")

    if _is_code_expired(pending.expires_at):
        session.delete(pending)
        session.commit()
        raise HTTPException(status_code=400, detail="El codigo expiro. Solicita uno nuevo")

    if _hash_verification_code(payload.code) != pending.code_hash:
        raise HTTPException(status_code=400, detail="El codigo es incorrecto")

    existing_user_by_email = session.exec(
        select(User).where(User.email == normalized_email)
    ).first()

    username_owner = session.exec(
        select(User).where(User.username == pending.username)
    ).first()

    if username_owner and (
        not existing_user_by_email or username_owner.id != existing_user_by_email.id
    ):
        if username_owner.is_active:
            raise HTTPException(
                status_code=400,
                detail="El nombre de usuario ya esta en uso. Registra de nuevo con otro.",
            )
        session.delete(username_owner)
        session.flush()

    user = existing_user_by_email or User(
        email=normalized_email,
        username=pending.username,
        hashed_password=pending.password_hash,
        is_active=True,
    )

    if existing_user_by_email:
        user.username = pending.username
        user.hashed_password = pending.password_hash
        user.is_active = True

    try:
        session.add(user)
        session.delete(pending)
        session.commit()
    except Exception:
        session.rollback()

        conflict_email = session.exec(
            select(User).where(User.email == normalized_email, User.is_active == True)
        ).first()
        if conflict_email:
            raise HTTPException(
                status_code=400,
                detail="El correo ya fue verificado. Inicia sesion.",
            )

        conflict_username = session.exec(
            select(User).where(User.username == pending.username, User.is_active == True)
        ).first()
        if conflict_username:
            raise HTTPException(
                status_code=400,
                detail="El nombre de usuario ya esta en uso. Registra de nuevo con otro.",
            )

        raise HTTPException(status_code=500, detail="No se pudo verificar el correo")

    return MessageResponse(message="Correo verificado correctamente. Ya puedes iniciar sesion")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(payload: ResendVerificationRequest, session: SessionDep):
    normalized_email = _normalize_email(str(payload.email))

    active_user = session.exec(
        select(User).where(User.email == normalized_email, User.is_active == True)
    ).first()
    if active_user:
        return MessageResponse(message="El correo ya esta verificado")

    pending = _get_pending_registration_for_update(session, email=normalized_email)
    if not pending:
        return MessageResponse(
            message="Si el correo existe, se envio un nuevo codigo de verificacion"
        )

    try:
        code = _refresh_pending_code(session, pending)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="No se pudo reenviar el codigo")

    try:
        send_verification_email(
            to_email=pending.email,
            username=pending.username,
            code=code,
            expires_minutes=_verification_ttl_minutes(),
        )
    except EmailDeliveryError:
        raise HTTPException(
            status_code=503,
            detail="No se pudo enviar el codigo. Intenta reenviar el codigo.",
        )
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="No se pudo enviar el codigo. Intenta reenviar el codigo.",
        )

    return MessageResponse(message="Te enviamos un nuevo codigo de verificacion")


@router.post("/token", response_model=Token)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep,
):
    """
    Endpoint para obtener el Token JWT (Login).
    """
    login_id = _normalize_username(form_data.username)
    login_email = login_id.lower()
    query = select(User).where(or_(User.username == login_id, User.email == login_email))
    user = session.exec(query).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contrasena incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Debes verificar tu correo antes de iniciar sesion",
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
