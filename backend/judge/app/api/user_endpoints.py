import uuid
from typing import Optional

from app.api.deps import CurrentAdminDep, CurrentUserDep
from app.db import SessionDep
from app.models import User, UserRole
from app.schemas.user_schemas import UserListResponse, UserPublic
from app.services.user_services import handle_user_change_rol, handle_user_list
from fastapi import APIRouter, HTTPException, Query

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


@router.get("/", response_model=UserListResponse)
def get_users(
    current_admin: CurrentAdminDep,
    session: SessionDep,
    page_size: int = Query(default=50, ge=1, le=100),
    page_number: int = Query(default=1, ge=1),
    role: Optional[UserRole] = Query(default=None),
):
    """
    Obtiene la lista de usuarios con paginación y filtrado por rol.
    """
    return handle_user_list(session, page_size, page_number, role)
