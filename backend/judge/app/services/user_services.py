import uuid

from app.models import User, UserRole
from fastapi import HTTPException


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
