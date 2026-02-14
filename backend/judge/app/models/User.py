import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Enum, Field, SQLModel


class UserRole(str, Enum):
    STUDENT = "student"
    COACH = "coach"
    ADMIN = "admin"


class User(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default=datetime.now(timezone.utc))
    role: UserRole = Field(default=UserRole.STUDENT)
