import uuid
from typing import Optional

from sqlmodel import Field, SQLModel


class Submission(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    problem_id: int | None = Field(default=None, foreign_key="problem.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")
    contest_id: int | None = Field(default=None, foreign_key="contest.id")
    code: str
