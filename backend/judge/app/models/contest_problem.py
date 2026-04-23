"""
@file backend/judge/app/models/contest_problem.py
@description Modelo de datos ORM del backend Judge.
@symbols ContestProblem
"""

from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models import Contest, Problem


class ContestProblem(SQLModel, table=True):
    contest_id: int | None = Field(
        default=None, foreign_key="contest.id", primary_key=True, ondelete="CASCADE"
    )
    problem_id: int | None = Field(
        default=None, foreign_key="problem.id", primary_key=True, ondelete="CASCADE"
    )
    order: str
    points: int = 100

    contest: "Contest" = Relationship(back_populates="problems")
    problem: "Problem" = Relationship()
