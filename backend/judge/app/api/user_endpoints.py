import uuid

from app.api.deps import CurrentUserDep
from app.db import SessionDep
from app.models import User
from app.schemas.user_schemas import UserPublic
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserPublic)
def get_current_user(current_user: CurrentUserDep):
    """
    Obtiene la información del usuario actualmente autenticado.
    """
    if current_user.id is None:
        raise HTTPException(status_code=400, detail="Usuario no válido")

    return UserPublic(
        id=current_user.id,  # type: ignore
        email=current_user.email,
        username=current_user.username,
        role=current_user.role,
    )


@router.get("/{user_id}", response_model=UserPublic)
def get_user(user_id: uuid.UUID, session: SessionDep):
    """
    Obtiene la información de un usuario por su ID.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return UserPublic(
        id=user.id,  # type: ignore
        email=user.email,
        username=user.username,
        role=user.role,
    )
