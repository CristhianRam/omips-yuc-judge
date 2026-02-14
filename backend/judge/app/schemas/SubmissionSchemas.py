from pydantic import BaseModel, Field


class SubmissionRequest(BaseModel):
    problem_id: int = Field(..., alias="problemId")
    contest_id: int | None = Field(default=None, alias="contestId")
    source_code: str = Field(..., alias="sourceCode")


class SubmissionResponse(BaseModel):
    id: str
    username: str = Field(..., alias="userName")
    problem_id: int = Field(..., alias="problemId")
    contest_id: int | None = Field(default=None, alias="contestId")
    code: str
    status: str
    verdict: str | None
    created_at: str = Field(..., alias="createdAt")
    runtime_ms: int | None = Field(default=None, alias="runtimeMs")
    failed_testcase: str | None = Field(default=None, alias="failedTestcase")
    error_message: str | None = Field(default=None, alias="errorMessage")


class SubmissionListRequest(BaseModel):
    problem_id: int | None = Field(default=None, alias="problemId")
    contest_id: int | None = Field(default=None, alias="contestId")
    user_id: str | None = Field(default=None, alias="userId")
    status: str | None = Field(default=None, alias="status")
    verdict: str | None = Field(default=None, alias="verdict")
    skip: int = 0
    limit: int = 20


class SubmissionPreview(BaseModel):
    id: str
    username: str = Field(..., alias="userName")
    problem_id: int = Field(..., alias="problemId")
    contest_id: int | None = Field(default=None, alias="contestId")
    status: str
    verdict: str | None
    created_at: str = Field(..., alias="createdAt")
