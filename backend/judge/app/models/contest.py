"""
@file backend/judge/app/models/contest.py
@description Modelo de datos ORM del backend Judge.
@symbols Contest
"""

from datetime import datetime
from typing import Optional

from app.models.contest_user import ContestUser
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel

from .contest_problem import ContestProblem
from .user import User


class Contest(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str
    start_date: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    end_date: Optional[datetime] = Field(
        default=None, sa_column=Column(DateTime(timezone=True))
    )
    open: bool = Field(default=False)
    # RELACIÓN UNIDIRECCIONAL: Un contest tiene una lista de problemas a través de la tabla intermedia ContestProblem
    problems: list[ContestProblem] = Relationship(back_populates="contest")
    participants: list["User"] = Relationship(link_model=ContestUser)
