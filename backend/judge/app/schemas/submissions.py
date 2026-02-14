from pydantic import BaseModel, Field

class SubmissionRequest(BaseModel):
    user_id: int = Field(..., alias="userId")
    problem_id: int = Field(..., alias="problemId")
    source_code: str = Field(..., alias="sourceCode")