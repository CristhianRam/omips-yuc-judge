from sqlmodel import SQLModel, Field

class ContestProblem(SQLModel, table=True):
    contest_id: int | None = Field(default=None, foreign_key="contest.id", primary_key=True)
    problem_id: int | None = Field(default=None, foreign_key="problem.id", primary_key=True)
    
    order: str | None = None 
    points: int = 100