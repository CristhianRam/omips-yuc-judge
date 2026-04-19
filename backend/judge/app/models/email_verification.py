import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class PendingRegistration(SQLModel, table=True):
    __tablename__ = "pending_registration"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    email: str = Field(unique=True, index=True, nullable=False)
    username: str = Field(nullable=False)
    password_hash: str = Field(nullable=False)
    code_hash: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
