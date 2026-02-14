from typing import Optional
from sqlmodel import SQLModel, Field

class Problem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str