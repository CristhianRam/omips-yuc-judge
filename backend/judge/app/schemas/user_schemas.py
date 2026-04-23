"""
@file backend/judge/app/schemas/user_schemas.py
@description Esquemas de validacion y serializacion del backend Judge.
@symbols UserCreate, UserPublic, Token, RegistrationResponse, EmailVerificationRequest, ResendVerificationRequest, ForgotPasswordRequest, ResetPasswordRequest, MessageResponse, UserListResponse
"""

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


class RegistrationResponse(BaseModel):
    message: str
    email: EmailStr


class EmailVerificationRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")
    new_password: str = Field(min_length=6)


class MessageResponse(BaseModel):
    message: str


class UserListResponse(BaseModel):
    users: list[UserPublic]
    current_page: int
    total_pages: int
