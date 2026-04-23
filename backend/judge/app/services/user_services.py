"""
@file backend/judge/app/services/user_services.py
@description Servicios de negocio del backend Judge.
@symbols handle_user_change_rol, handle_user_list
"""

import uuid

from app.models import User, UserRole
from app.schemas.user_schemas import UserListResponse, UserPublic
from fastapi import HTTPException
from sqlmodel import Session, func, select


def handle_user_change_rol(
    session, user_id: uuid.UUID, new_role: UserRole, current_admin
):
    """
    Cambia el rol de un usuario. Solo un admin puede hacer esto.

    Args:
        session: Sesión de base de datos.
        user_id: ID del usuario a modificar.
        new_role: Nuevo rol a asignar al usuario.
        current_admin: Usuario actual para validar permisos.
    """

    user_to_edit = session.get(User, user_id)
    if not user_to_edit:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if user_to_edit.id == current_admin.id and new_role != UserRole.ADMIN:
        raise HTTPException(
            status_code=400, detail="No puedes quitarte el admin a ti mismo"
        )

    user_to_edit.role = new_role
    session.add(user_to_edit)
    try:
        session.commit()
        session.refresh(user_to_edit)
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error al actualizar el rol")


def handle_user_list(
    session: Session,
    page_size: int = 10,
    page_number: int = 1,
    role: UserRole | None = None,
):
    """
    Obtiene la lista de usuarios filtrados por rol.

    Args:
        session: Sesión de base de datos.
        page_size: Tamaño de página para paginación.
        page_number: Número de página actual.
        role: Rol opcional para filtrar usuarios.

    Returns:
        List[UserPublic]
    """
    query = select(User)
    count_statement = select(func.count()).select_from(User)

    if role is not None:
        query = query.where(User.role == role)
        count_statement = count_statement.where(User.role == role)

    total = session.exec(count_statement).one()

    offset = (page_number - 1) * page_size
    query = query.offset(offset).limit(page_size)
    users = session.exec(query).all()
    users = [UserPublic.model_validate(user, from_attributes=True) for user in users]

    return UserListResponse(
        users=users,
        current_page=page_number,
        total_pages=(total + page_size - 1) // page_size,
    )
