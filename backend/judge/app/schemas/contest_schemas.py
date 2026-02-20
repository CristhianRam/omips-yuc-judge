from typing import Optional

from pydantic import BaseModel, Field


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


class ContestCreate(BaseModel):
    """Schema para crear concurso."""

    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)


class ContestPublic(BaseModel):
    """Schema público del concurso."""

    id: int
    title: str
    description: str
    is_active: bool

    class Config:
        from_attributes = True


class ContestUpdate(BaseModel):
    """Schema para actualizar concurso."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)


class ContestListResponse(BaseModel):
    """Schema para la respuesta de listar concursos."""

    contests: list[ContestPublic]
    current_page: int
    total_pages: int
