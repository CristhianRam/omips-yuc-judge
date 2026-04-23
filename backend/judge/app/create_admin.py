"""
@file backend/judge/app/create_admin.py
@description Modulo Python del backend Judge.
@symbols create_admin
"""

import os

from app.core.security import get_password_hash  # Tu función de hashing
from app.db import engine
from app.models import User  # Ajusta a tu ruta de modelos
from app.models.user import UserRole
from sqlmodel import Session, select


def create_admin():
    with Session(engine) as session:
        # 1. Verificar si ya existe el admin para no duplicar
        admin_user = os.getenv("ADMIN_USER")
        if not admin_user:
            raise ValueError("ADMIN_USER no configurada")
        admin_email = os.getenv("ADMIN_EMAIL")
        if not admin_email:
            raise ValueError("ADMIN_EMAIL no configurada")
        admin_password = os.getenv("ADMIN_PASSWORD")
        if not admin_password:
            raise ValueError("ADMIN_PASSWORD no configurada")
        statement = select(User).where(User.username == admin_user)
        existing_admin = session.exec(statement).first()

        if existing_admin:
            print("ERROR: El usuario administrador ya existe.")
            return

        # 2. Crear el nuevo admin
        admin_user = User(
            email=admin_email,
            username=admin_user,
            hashed_password=get_password_hash(admin_password),
            role=UserRole.ADMIN,
            is_active=True,
        )

        session.add(admin_user)
        session.commit()
        print("RESULTADO: Usuario Administrador creado con éxito.")


if __name__ == "__main__":
    create_admin()
