from datetime import datetime
from typing import TYPE_CHECKING, List

from sqlmodel import Field, Relationship, SQLModel

from .ContestProblem import ContestProblem

if TYPE_CHECKING:
    from .Problem import Problem


class Contest(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str
    start_time: datetime
    end_time: datetime

    # RELACIÓN UNIDIRECCIONAL: Un contest tiene una lista de problemas a través de la tabla intermedia ContestProblem
    problems: List["Problem"] = Relationship(link_model=ContestProblem)
