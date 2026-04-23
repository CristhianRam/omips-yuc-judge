"""
@file backend/judge/app/schemas/contest_schemas.py
@description Esquemas de validacion y serializacion del backend Judge.
@symbols ContestProblemCreate, ContestProblemPublic, Config, ContestProblemPayload, ContestCreate, ContestPublic, ContestUpdate, ContestListResponse, ensure_utc
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class ContestProblemCreate(BaseModel):
    """Schema para asociar un problema a un concurso."""

    problem_id: int
    points: int = 100
    order: str


class ContestProblemPublic(BaseModel):
    """Schema para mostrar un problema dentro de un concurso."""

    problem_id: int
    problem_name: str
    points: int
    order: str

    class Config:
        from_attributes = True


class ContestProblemPayload(BaseModel):
    """Schema para mostrar un problema dentro de un concurso."""

    contest_id: int
    user_id: uuid.UUID
    points: int
    solved: bool
    bad_submissions: int


class ContestCreate(BaseModel):
    """Schema para crear concurso."""

    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    start_date: datetime
    end_date: Optional[datetime] = Field(default=None)

    @field_validator("start_date", "end_date", mode="after")
    @classmethod
    def ensure_utc(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v is not None and v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v


class ContestPublic(BaseModel):
    """Schema público del concurso."""

    id: int
    title: str
    description: str
    start_date: datetime
    end_date: Optional[datetime] = Field(default=None)
    open: bool

    class Config:
        from_attributes = True


class ContestUpdate(BaseModel):
    """Schema para actualizar concurso."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    open: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ContestListResponse(BaseModel):
    """Schema para la respuesta de listar concursos."""

    contests: list[ContestPublic]
    current_page: int
    total_pages: int
