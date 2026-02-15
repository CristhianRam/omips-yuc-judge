from typing import Optional

from sqlmodel import Field, SQLModel


class Problem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    title: str
    description: str
    time_limit_ms: int
    memory_limit_mb: int
