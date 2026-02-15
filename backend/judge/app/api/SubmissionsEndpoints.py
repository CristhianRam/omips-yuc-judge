import json
import uuid
from typing import Annotated

from app.api.deps import CurrentUserDep
from app.core.redis import redis_conn
from app.db import SessionDep
from app.models.Submission import Submission
from app.models.User import User, UserRole
from app.schemas.SubmissionSchemas import (
    SubmissionListRequest,
    SubmissionPreview,
    SubmissionRequest,
    SubmissionResponse,
)
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import desc, select

router = APIRouter(prefix="/submissions", tags=["Submissions"])


@router.post("/")
def submit(
    request: SubmissionRequest,
    current_user: CurrentUserDep,
    session: SessionDep,
):

    if current_user.id is None:
        raise HTTPException(status_code=400, detail="Usuario no válido")

    submission = Submission(
        user_id=current_user.id,
        problem_id=request.problem_id,
        code=request.source_code,
    )

    session.add(submission)
    try:
        session.commit()
        session.refresh(submission)
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error al crear el envío")

    payload = {
        "submissionId": submission.id,
        "problemId": submission.problem_id,
        "code": submission.code,
    }

    redis_conn.lpush("submission_queue", json.dumps(payload))

    return {"status": "queued", "submissionId": submission.id}


@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: uuid.UUID, current_user: CurrentUserDep, session: SessionDep
):
    submission = session.get(Submission, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Envío no encontrado")
    if submission.user_id != current_user.id and current_user.role == UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="No autorizado para ver este envío")

    user = session.get(User, submission.user_id)
    user_name = user.username if user else "Unknown"

    return SubmissionResponse(
        id=str(submission.id),
        userName=user_name,
        problemId=submission.problem_id,
        contestId=submission.contest_id,
        code=submission.code,
        status=submission.status,
        verdict=submission.verdict,
        createdAt=str(submission.created_at),
        runtimeMs=submission.runtime_ms,
        failedTestcase=submission.failed_testcase,
        errorMessage=submission.error_message,
    )


@router.get("/my/{problemId}", response_model=list[SubmissionPreview])
def list_my_submissions(
    problemId: uuid.UUID, current_user: CurrentUserDep, session: SessionDep
):
    query = select(Submission).where(Submission.user_id == current_user.id)
    query = query.where(Submission.problem_id == problemId)
    query = query.order_by(desc(Submission.created_at))
    submissions = session.exec(query).all()

    result = []
    for sub in submissions:
        user_name = current_user.username
        result.append(
            SubmissionPreview(
                id=str(sub.id),
                userName=user_name,
                problemId=sub.problem_id,
                contestId=sub.contest_id,
                status=sub.status,
                verdict=sub.verdict,
                createdAt=str(sub.created_at),
            )
        )

    return result


@router.get("/", response_model=list[SubmissionPreview])
def list_submissions(
    request: Annotated[SubmissionListRequest, Depends()],
    current_user: CurrentUserDep,
    session: SessionDep,
):
    query = select(Submission)
    if request.user_id is not None:
        query = query.where(Submission.user_id == request.user_id)
    if request.problem_id is not None:
        query = query.where(Submission.problem_id == request.problem_id)
    if request.contest_id is not None:
        query = query.where(Submission.contest_id == request.contest_id)
    if request.status is not None:
        query = query.where(Submission.status == request.status)
    if request.verdict is not None:
        query = query.where(Submission.verdict == request.verdict)

    query = (
        query.order_by(desc(Submission.created_at))
        .offset(request.skip)
        .limit(request.limit)
    )
    submissions = session.exec(query).all()

    result = []
    for sub in submissions:
        user = session.get(User, sub.user_id)
        user_name = user.username if user else "Unknown"
        result.append(
            SubmissionPreview(
                id=str(sub.id),
                userName=user_name,
                problemId=sub.problem_id,
                contestId=sub.contest_id,
                status=sub.status,
                verdict=sub.verdict,
                createdAt=str(sub.created_at),
            )
        )

    return result
