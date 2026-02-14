import os
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, create_engine

# Configuración de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Motor de la base de datos
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Cambia a False en producción
)


# Dependencia para obtener sesión
def get_session():
    with Session(engine) as session:
        yield session


# Tipo anotado para usar en endpoints
SessionDep = Annotated[Session, Depends(get_session)]
