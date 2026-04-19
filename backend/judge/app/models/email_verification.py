import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class EmailVerification(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    user_id: uuid.UUID = Field(
        foreign_key="user.id",
        unique=True,
        index=True,
        nullable=False,
        ondelete="CASCADE",
    )
    email: str = Field(unique=True, index=True, nullable=False)
    code_hash: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
