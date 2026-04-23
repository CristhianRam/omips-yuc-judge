"""
@file backend/judge/app/schemas/testcase_schemas.py
@description Esquemas de validacion y serializacion del backend Judge.
@symbols TestCaseCreate, TestCasePublic, Config, TestCaseWithContent
"""

import uuid

from pydantic import BaseModel, Field


class TestCaseCreate(BaseModel):
    """Schema para crear testcase (los archivos se suben por separado)."""

    name: str = Field(max_length=50)


class TestCasePublic(BaseModel):
    """Schema público del testcase."""

    id: uuid.UUID
    name: str
    problem_id: int

    class Config:
        from_attributes = True


class TestCaseWithContent(TestCasePublic):
    """Schema con contenido de archivos (solo para admins/coaches)."""

    input_content: str
    output_content: str
