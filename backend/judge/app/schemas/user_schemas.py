import uuid

from app.models import UserRole
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(min_length=6)


class UserPublic(BaseModel):
    id: uuid.UUID
    username: str
    email: str
    role: UserRole


class Token(BaseModel):
    access_token: str
    token_type: str


class UserListResponse(BaseModel):
    users: list[UserPublic]
    current_page: int
    total_pages: int
