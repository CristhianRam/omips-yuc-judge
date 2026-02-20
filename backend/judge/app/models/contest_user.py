import uuid

from sqlmodel import Field, SQLModel


class ContestUser(SQLModel, table=True):
    contest_id: int = Field(
        foreign_key="contest.id", primary_key=True, ondelete="CASCADE"
    )
    user_id: uuid.UUID = Field(
        foreign_key="user.id", primary_key=True, ondelete="CASCADE"
    )

    order: str | None = None
    points: int = 100
