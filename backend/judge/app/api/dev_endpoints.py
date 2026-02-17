import uuid

from app.db import SessionDep
from app.models import User, UserRole
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/dev", tags=["Dev"])


@router.patch("/{user_id}/role")
def change_user_role(
    user_id: uuid.UUID,
    new_role: UserRole,
    session: SessionDep,
):
    """
    Cambia el rol de un usuario (NO REQUIERE PERMISO - DEV ONLY).
    """
    user_to_edit = session.get(User, user_id)
    if not user_to_edit:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user_to_edit.role = new_role
    session.add(user_to_edit)
    try:
        session.commit()
        session.refresh(user_to_edit)
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error al actualizar el rol")
