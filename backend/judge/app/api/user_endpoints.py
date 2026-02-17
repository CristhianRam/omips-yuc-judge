import uuid

from app.api.deps import CurrentAdminDep, CurrentUserDep
from app.db import SessionDep
from app.models import User, UserRole
from app.schemas.user_schemas import UserPublic
from app.services.user_services import handle_user_change_rol
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserPublic)
def get_current_user(current_user: CurrentUserDep):
    """
    Obtiene la información del usuario actualmente autenticado.
    """
    return UserPublic(
        id=current_user.id,
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
        id=user.id,
        email=user.email,
        username=user.username,
        role=user.role,
    )


@router.patch("/{user_id}/role")
def change_user_role(
    user_id: uuid.UUID,
    new_role: UserRole,
    session: SessionDep,
    current_admin: CurrentAdminDep,
):
    """
    Cambia el rol de un usuario. Solo un admin puede hacer esto.
    """
    handle_user_change_rol(session, user_id, new_role, current_admin)
