from datetime import timedelta
from typing import Annotated

from app.core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.db import SessionDep
from app.models.User import User
from app.schemas.UserSchemas import Token, UserCreate, UserPublic
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select

router = APIRouter(tags=["Authentication"])


@router.post("/register", response_model=UserPublic)
def register(user_in: UserCreate, session: SessionDep):
    """
    Registra un nuevo usuario.
    """
    query = select(User).where(User.email == user_in.email)

    if session.exec(query).first():
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    query_user = select(User).where(User.username == user_in.username)
    if session.exec(query_user).first():
        raise HTTPException(
            status_code=400, detail="El nombre de usuario ya está en uso"
        )

    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
    )

    try:
        session.add(user)
        session.commit()
        session.refresh(user)
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error al crear el usuario")

    return user


@router.post("/token", response_model=Token)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep,
):
    """
    Endpoint para obtener el Token JWT (Login).
    """
    # 1. Buscar usuario por username
    query = select(User).where(User.username == form_data.username)
    user = session.exec(query).first()

    # 2. Verificar usuario y contraseña
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generar el Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
