import uuid

from sqlmodel import Field, SQLModel


class ScoreboardEntry(SQLModel, table=True):
    user_id: uuid.UUID = Field(primary_key=True, foreign_key="user.id")
    contest_id: int = Field(primary_key=True, foreign_key="contest.id")
    problem_id: int = Field(primary_key=True, foreign_key="problem.id")
    score: int = Field(default=0)
    bad_submissions: int = Field(default=0)
    solved: bool = Field(default=False)
