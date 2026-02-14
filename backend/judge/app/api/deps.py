from typing import Annotated

from app.core.security import ALGORITHM, SECRET_KEY
from app.db import SessionDep

# Importaciones de tu proyecto
from app.models.User import User, UserRole
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# --------------------------------------------------------------------------
# 1. Configuración del esquema de seguridad
# "tokenUrl" le dice a Swagger UI dónde enviar el usuario/contraseña para obtener el token.
# Debe coincidir con la ruta de tu login (en auth.py pusimos /token).
# --------------------------------------------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


# --------------------------------------------------------------------------
# 2. La Dependencia Principal: get_current_user
# Esta función se ejecutará antes de tu endpoint.
# --------------------------------------------------------------------------
def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: SessionDep,
) -> User:

    # Preparamos la excepción por si algo sale mal (para no repetir código)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # A. INTENTAMOS DECODIFICAR EL TOKEN
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # B. EXTRAEMOS EL ID DEL USUARIO ('sub')
        user_id: str | None = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        # Si el token es falso, expirado o corrupto
        raise credentials_exception

    # C. BUSCAMOS AL USUARIO EN LA BASE DE DATOS
    user = session.get(User, int(user_id))

    if user is None:
        # El token es válido, pero el usuario fue borrado de la BD
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Usuario inactivo"
        )

    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:

    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren privilegios de Administrador",
        )
    return current_user
