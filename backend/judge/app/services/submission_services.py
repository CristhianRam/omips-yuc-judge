import json
from datetime import datetime
from uuid import UUID

from app.core.redis import redis_conn
from app.models import Contest, Problem, Submission, TestCase, User, UserRole
from app.schemas.submission_schemas import (
    SubmissionCreateResponse,
    SubmissionListRequest,
    SubmissionListResponse,
    SubmissionPreview,
    SubmissionRequest,
    SubmissionResponse,
)
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, desc, select


def handle_submission_create(
    session, current_user, request: SubmissionRequest
) -> SubmissionCreateResponse:
    """
    Crea un nuevo envío y lo encola para su evaluación.

    Args:
        session: Sesión de base de datos.
        current_user: Usuario actual (para asociar el envío).
        request: Datos del envío (código fuente, ID del problema, etc.)

    Returns:
        SubmissionCreateResponse: (ID del envío creado, estado inicial "QUEUED")
    """

    statement = select(Problem.time_limit_ms, Problem.memory_limit_mb).where(
        Problem.id == request.problem_id
    )
    results = session.exec(statement).first()
    if not results:
        raise HTTPException(status_code=404, detail="Problema no encontrado")

    problem_time_limit, problem_memory_limit = results

    statement = select(TestCase).where(TestCase.problem_id == request.problem_id)
    has_testcases = session.exec(statement).first() is not None
    if not has_testcases:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontraron testcases para este problema",
        )

    if request.contest_id is not None:
        contest = session.get(Contest, request.contest_id)
        if contest is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Concurso no encontrado"
            )
        if not contest.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El concurso no está activo",
            )
        if current_user not in contest.participants:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No estás inscrito a este concurso",
            )

    submission = Submission(
        user_id=current_user.id,
        problem_id=request.problem_id,
        code=request.source_code,
        contest_id=request.contest_id,
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
        "sourceCode": submission.code,
        "timeLimitMs": problem_time_limit,
        "memoryLimitMb": problem_memory_limit,
    }

    serializable_payload = {
        k: str(v) if isinstance(v, (UUID, datetime)) else v for k, v in payload.items()
    }

    redis_conn.lpush("submission_queue", json.dumps(serializable_payload))

    return SubmissionCreateResponse(submissionId=str(submission.id), status="QUEUED")


def handle_submission_get(
    submission_id: UUID, current_user, session
) -> SubmissionResponse:
    """
    Lee un envío específico, verificando permisos de acceso.

    Args:
        submission_id (UUID): ID del envío a consultar.
        current_user: Usuario actual (para verificar permisos).
        session: Sesión de base de datos.

    Returns:
        SubmissionResponse: Detalles del envío solicitado.
    """
    submission = session.get(Submission, submission_id)
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Envío no encontrado"
        )
    if submission.user_id != current_user.id and current_user.role not in (
        UserRole.COACH,
        UserRole.ADMIN,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado para ver este envío",
        )

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


def handle_my_submissions(
    problem_id: int, current_user, session
) -> list[SubmissionPreview]:
    """
    Lista los envíos del usuario actual para un problema específico.
    Args:
        problem_id (int): ID del problema para filtrar los envíos.
        current_user: Usuario actual (para filtrar por usuario).
        session: Sesión de base de datos.

    Returns:
        list[SubmissionPreview]: Lista de envíos del usuario para el problema dado.
    """
    query = select(Submission).where(Submission.user_id == current_user.id)
    query = query.where(Submission.problem_id == problem_id)
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


def handle_submissions_list(
    request: SubmissionListRequest, session: Session
) -> SubmissionListResponse:
    """
    Lista envíos con filtros opcionales.

    Args:
        request: Objeto con los parámetros de filtrado (user_id, problem_id, etc.)
        session: Sesión de base de datos.

    Returns:
        list[SubmissionPreview]: Lista de envíos que cumplen los criterios de filtrado.
    """
    query = select(Submission, User.username).join(User, isouter=True)
    count_statement = select(func.count()).select_from(Submission)

    if request.user_id is not None:
        query = query.where(Submission.user_id == request.user_id)
        count_statement = count_statement.where(Submission.user_id == request.user_id)
    if request.problem_id is not None:
        query = query.where(Submission.problem_id == request.problem_id)
        count_statement = count_statement.where(
            Submission.problem_id == request.problem_id
        )
    if request.contest_id is not None:
        query = query.where(Submission.contest_id == request.contest_id)
        count_statement = count_statement.where(
            Submission.contest_id == request.contest_id
        )
    if request.status is not None:
        query = query.where(Submission.status == request.status)
        count_statement = count_statement.where(Submission.status == request.status)
    if request.verdict is not None:
        query = query.where(Submission.verdict == request.verdict)
        count_statement = count_statement.where(Submission.verdict == request.verdict)

    total = session.exec(count_statement).one()
    offset = (request.page_number - 1) * request.page_size

    query = (
        query.order_by(desc(Submission.created_at))
        .offset(offset)
        .limit(request.page_size)
    )
    submissions = session.exec(query).all()

    result = []
    for sub, user_name in submissions:
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

    return SubmissionListResponse(
        submissions=result,
        current_page=request.page_number,
        total_pages=(total + request.page_size - 1) // request.page_size,
    )
