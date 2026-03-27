from typing import Optional

from app.models.problem import ProblemDifficulty
from pydantic import BaseModel, Field, field_validator


class ProblemCreate(BaseModel):
    """Schema para crear problema."""

    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    time_limit_ms: int = Field(default=1000, gt=0)
    memory_limit_mb: int = Field(default=256, gt=0)
    difficulty: ProblemDifficulty = Field(default=ProblemDifficulty.EASY)

    @field_validator("description")
    @classmethod
    def validate_markdown(cls, v: str) -> str:
        """Validar que el Markdown no sea demasiado largo."""
        max_length = 30000
        if len(v) > max_length:
            raise ValueError(f"La descripción no puede exceder {max_length} caracteres")
        return v


class ProblemPublic(BaseModel):
    """Schema público del problema."""

    id: int
    title: str
    description: str  # Markdown con URLs externas
    time_limit_ms: int
    memory_limit_mb: int
    difficulty: ProblemDifficulty

    class Config:
        from_attributes = True


class ProblemUpdate(BaseModel):
    """Schema para actualizar problema."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    time_limit_ms: Optional[int] = Field(None, gt=0)
    memory_limit_mb: Optional[int] = Field(None, gt=0)
    difficulty: Optional[ProblemDifficulty] = Field(None)


class ProblemListResponse(BaseModel):
    """Schema para la respuesta de listar problemas."""

    problems: list[ProblemPublic]
    current_page: int
    total_pages: int
