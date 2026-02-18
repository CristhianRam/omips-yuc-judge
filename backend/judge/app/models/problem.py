from enum import Enum
from typing import Optional

from sqlalchemy import Text
from sqlmodel import Column, Field, SQLModel


class ProblemDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Problem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    title: str
    description: str = Field(sa_column=Column(Text))
    time_limit_ms: int = Field(default=1000, gt=0)
    memory_limit_mb: int = Field(default=256, gt=0)
    difficulty: ProblemDifficulty = Field(default=ProblemDifficulty.EASY)
