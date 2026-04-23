"""
@file backend/judge/app/db.py
@description Modulo Python del backend Judge.
@symbols get_db_url, get_session
"""

import os
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, create_engine


# Configuración de la base de datos
def get_db_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        raise ValueError("DATABASE_URL no configurada")
    return url


DATABASE_URL = get_db_url()

# Motor de la base de datos
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Cambia a False en producción
)


# Dependencia para obtener sesión
def get_session():
    with Session(engine) as session:
        yield session


# Tipo anotado para usar en endpoints
SessionDep = Annotated[Session, Depends(get_session)]
