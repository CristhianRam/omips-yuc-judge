"""
@file backend/judge/app/models/scoreboard.py
@description Modelo de datos ORM del backend Judge.
@symbols ScoreboardEntry
"""

import uuid

from sqlmodel import Field, SQLModel


class ScoreboardEntry(SQLModel, table=True):
    user_id: uuid.UUID = Field(
        primary_key=True, foreign_key="user.id", ondelete="CASCADE"
    )
    contest_id: int = Field(
        primary_key=True, foreign_key="contest.id", ondelete="CASCADE"
    )
    problem_id: int = Field(
        primary_key=True, foreign_key="problem.id", ondelete="CASCADE"
    )
    score: int = Field(default=0)
    bad_submissions: int = Field(default=0)
    solved: bool = Field(default=False)
