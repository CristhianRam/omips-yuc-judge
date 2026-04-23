"""
@file backend/judge/app/models/testcase.py
@description Modelo de datos ORM del backend Judge.
@symbols TestCase
"""

import uuid

from sqlmodel import Field, SQLModel


class TestCase(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True)
    name: str = Field(max_length=50)
    problem_id: int = Field(foreign_key="problem.id", index=True, ondelete="CASCADE")
    input_file: str = Field(max_length=3500)  # /data/problems/1/testcases/01.in
    output_file: str = Field(max_length=3500)  # /data/problems/1/testcases/01.out
