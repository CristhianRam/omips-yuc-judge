from pydantic import BaseModel, Field


class SubmissionRequest(BaseModel):
    problem_id: int = Field(..., alias="problemId")
    contest_id: int | None = Field(default=None, alias="contestId")
    source_code: str = Field(..., alias="sourceCode")
