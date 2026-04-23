"""
@file backend/judge/app/models/password_reset.py
@description Modelo de datos ORM del backend Judge.
@symbols PendingPasswordReset
"""

import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class PendingPasswordReset(SQLModel, table=True):
    __tablename__ = "pending_password_reset"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    email: str = Field(unique=True, index=True, nullable=False)
    code_hash: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
