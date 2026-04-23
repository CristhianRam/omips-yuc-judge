"""
@file backend/judge/app/api/submission_endpoints.py
@description Endpoints REST del backend Judge y dependencias de API.
@symbols create_submission, get_submission, list_my_submissions, list_submissions
"""

import uuid
from typing import Annotated

from app.api.deps import CurrentUserDep
from app.db import SessionDep
from app.schemas.submission_schemas import (
    SubmissionListRequest,
    SubmissionListResponse,
    SubmissionPreview,
    SubmissionRequest,
    SubmissionResponse,
)
from app.services.submission_services import (
    handle_my_submissions,
    handle_submission_create,
    handle_submission_get,
    handle_submissions_list,
)
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/submissions", tags=["Submissions"])


@router.post("/")
def create_submission(
    request: SubmissionRequest,
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """Crear un nuevo envío."""
    return handle_submission_create(session, current_user, request)


@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: uuid.UUID, current_user: CurrentUserDep, session: SessionDep
):
    """Obtener detalles de un envío específico."""
    return handle_submission_get(submission_id, current_user, session)


@router.get("/my/{problem_id}", response_model=list[SubmissionPreview])
def list_my_submissions(
    problem_id: int, current_user: CurrentUserDep, session: SessionDep
):
    """Listar los envíos del usuario actual para un problema específico."""
    return handle_my_submissions(problem_id, current_user, session)


@router.get("/", response_model=SubmissionListResponse)
def list_submissions(
    request: Annotated[SubmissionListRequest, Depends()],
    session: SessionDep,
):
    """Listar envíos con filtros opcionales."""
    return handle_submissions_list(request, session)
