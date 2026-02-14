from sqlmodel import Field, SQLModel


class Submission(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    problem_id: int | None = Field(default=None, foreign_key="problem.id")
    user_id: int | None = Field(default=None, foreign_key="user.id")
    contest_id: int | None = None
    code: str
