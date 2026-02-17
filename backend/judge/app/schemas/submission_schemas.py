import uuid

from fastapi import Query
from pydantic import BaseModel, Field


class SubmissionRequest(BaseModel):
    problem_id: int = Field(..., alias="problemId")
    contest_id: int | None = Field(default=None, alias="contestId")
    source_code: str = Field(..., alias="sourceCode")


class SubmissionCreateResponse(BaseModel):
    submission_id: str = Field(..., alias="submissionId")
    status: str


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
    # Usamos Query(...) para que FastAPI sepa que vienen de la URL
    problem_id: int | None = Query(default=None, alias="problemId")
    contest_id: int | None = Query(default=None, alias="contestId")
    user_id: uuid.UUID | None = Query(
        default=None, alias="userId"
    )  # Ya puede ser UUID directamente
    status: str | None = Query(default=None)
    verdict: str | None = Query(default=None)
    skip: int = Query(default=0, ge=0)
    limit: int = Query(default=20, le=100)


class SubmissionPreview(BaseModel):
    id: str
    username: str = Field(..., alias="userName")
    problem_id: int = Field(..., alias="problemId")
    contest_id: int | None = Field(default=None, alias="contestId")
    status: str
    verdict: str | None
    created_at: str = Field(..., alias="createdAt")
