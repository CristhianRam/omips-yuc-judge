from app.models.contest_user import ContestUser
from sqlmodel import Field, Relationship, SQLModel

from .contest_problem import ContestProblem
from .user import User


class Contest(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str
    is_active: bool = Field(default=False)
    # RELACIÓN UNIDIRECCIONAL: Un contest tiene una lista de problemas a través de la tabla intermedia ContestProblem
    problems: list[ContestProblem] = Relationship(back_populates="contest")
    participants: list["User"] = Relationship(link_model=ContestUser)
