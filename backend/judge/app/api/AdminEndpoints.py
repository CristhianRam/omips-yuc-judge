import uuid

from app.api.deps import CurrentAdminDep
from app.db import SessionDep
from app.models.User import User, UserRole
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/admin", tags=["Admin"])


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
    user_to_edit = session.get(User, user_id)
    if not user_to_edit:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if user_to_edit.id == current_admin.id and new_role != UserRole.ADMIN:
        raise HTTPException(
            status_code=400, detail="No puedes quitarte el admin a ti mismo"
        )

    print(
        f"ADMIN {current_admin.username} cambió a {user_to_edit.username} al rol {new_role}"
    )

    user_to_edit.role = new_role
    session.add(user_to_edit)
    try:
        session.commit()
        session.refresh(user_to_edit)
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error al actualizar el rol")

    return None
