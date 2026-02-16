import uuid

from app.models import UserRole
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: uuid.UUID
    username: str
    email: str
    role: UserRole


class Token(BaseModel):
    access_token: str
    token_type: str
