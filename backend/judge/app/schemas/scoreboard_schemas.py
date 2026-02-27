from pydantic import BaseModel


class ScoreProblem(BaseModel):
    score: int
    order: str
    bad_submissions: int
    solved: bool


class ScoreboardUser(BaseModel):
    username: str
    problems: list[ScoreProblem]
    total_score: int = 0


class Scoreboard(BaseModel):
    users: list[ScoreboardUser]
