"""
@file backend/judge/app/services/contest_services.py
@description Servicios de negocio del backend Judge.
@symbols check_coach_permission, get_contest_or_404, handle_contest_create, handle_contest_get, handle_contest_list, handle_contest_update, handle_contest_delete, handle_add_problem, handle_remove_problem, handle_contest_problem_list, ...
"""

from datetime import datetime, timezone

from app.models import Contest
from app.models.contest_problem import ContestProblem
from app.models.scoreboard import ScoreboardEntry
from app.models.user import User, UserRole
from app.schemas.contest_schemas import (
    ContestCreate,
    ContestListResponse,
    ContestProblemCreate,
    ContestProblemPublic,
    ContestPublic,
    ContestUpdate,
)
from app.schemas.scoreboard_schemas import Scoreboard, ScoreboardUser, ScoreProblem
from app.schemas.user_schemas import UserPublic
from app.services.problem_services import get_problem_or_404
from fastapi import HTTPException, status
from sqlalchemy.orm import selectinload
from sqlmodel import Session, col, desc, func, select


def check_coach_permission(current_user):
    """Validar que el usuario sea admin o coach."""
    if current_user.role not in ["admin", "coach"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permisos insuficientes",
        )


def get_contest_or_404(contest_id: int, session: Session) -> Contest:
    """Obtener problema o lanzar 404."""
    contest = session.get(Contest, contest_id)
    if not contest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contest no encontrado",
        )
    return contest


def handle_contest_create(
    session: Session, request: ContestCreate, current_user: User
) -> Contest:
    """
    Crear un nuevo concurso.

    Args:
        session: Sesión de base de datos.
        request: Datos del nuevo concurso.
        current_user: Usuario actual para validar permisos.

    Returns:
        Contest: El contest creado.

    """
    check_coach_permission(current_user)

    contest = Contest(
        title=request.title,
        description=request.description,
        start_date=request.start_date,
        end_date=request.end_date,
    )

    try:
        session.add(contest)
        session.commit()
        session.refresh(contest)
        return contest
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear el concurso",
        )


def handle_contest_get(
    contest_id: int, session: Session, current_user: User
) -> Contest:
    """
    Obtener un concurso.

    Args:
        contest_id: ID del concurso a obtener.
        session: Sesión de base de datos
        current_user: Usuario actual.

    Returns:
        Contest: El concurso encontrado.
    """
    contest = get_contest_or_404(contest_id, session)
    has_permission = current_user.role in ["admin", "coach"]
    if current_user not in contest.participants and not has_permission:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permitido ver este concurso",
        )
    return contest


def handle_contest_list(
    session: Session,
    page_size: int = 10,
    page_number: int = 1,
) -> ContestListResponse:
    """
    Listar concursos.
    Args:
        session: Sesión de base de datos.
        page_size: Tamaño de página para paginación.
        page_number: Número de página actual.

    Returns:
    List[ContestListResponse]: Lista de concursos.
    """
    query = select(Contest)
    count_statement = select(func.count()).select_from(Contest)

    total = session.exec(count_statement).one()
    offset = (page_number - 1) * page_size

    query = query.order_by(desc(Contest.id)).offset(offset).limit(page_size)  # type: ignore

    contests = session.exec(query).all()
    contests = [
        ContestPublic.model_validate(contest, from_attributes=True)
        for contest in contests
    ]

    return ContestListResponse(
        contests=contests,
        current_page=page_number,
        total_pages=(total + page_size - 1) // page_size,
    )


def handle_contest_update(
    session: Session, contest_id: int, request: ContestUpdate, current_user
) -> Contest:
    """
    Actualizar un concurso.

    Args:
        session: Sesión de base de datos.
        contest_id: ID del problema a actualizar.
        request: Datos para actualizar el problema.
        current_user: Usuario actual para validar permisos.

    Returns:
        Problem: El problema actualizado.
    """
    check_coach_permission(current_user)

    contest = get_contest_or_404(contest_id, session)

    if contest.open is True and request.open is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes cerrar un concurso ya abierto para registro",
        )

    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(contest, key, value)

    try:
        session.add(contest)
        session.commit()
        session.refresh(contest)
        return contest
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar contest",
        )


def handle_contest_delete(session, contest_id: int, current_user) -> None:
    """
    Eliminar un concurso.

    Args:
        session: Sesión de base de datos.
        contest_id: ID del problema a eliminar.
        current_user: Usuario actual para validar permisos.
    """
    check_coach_permission(current_user)

    contest = get_contest_or_404(contest_id, session)

    try:
        session.delete(contest)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar concurso",
        )


def handle_add_problem(
    session: Session, contest_id: int, current_user: User, request: ContestProblemCreate
) -> None:
    """
    Añadir problema a un concurso.

    Args:
        session: Sesión de base de datos.
        contest_id: ID del concurso.
        problem_id: ID del problema.
        current_user: Usuario actual para validar permisos.
    """
    check_coach_permission(current_user)

    contest = get_contest_or_404(contest_id, session)
    problem = get_problem_or_404(request.problem_id, session)

    if contest.open:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes añadir problemas a un concurso abierto para registro",
        )

    try:
        contest.problems.append(
            ContestProblem(
                contest_id=contest.id,
                problem_id=problem.id,
                points=request.points,
                order=request.order,
            )
        )
        session.add(contest)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al añadir problema al concurso",
        )


def handle_remove_problem(
    session: Session, contest_id: int, problem_id: int, current_user: User
) -> None:
    """
    Eliminar problema de un concurso.

    Args:
        session: Sesión de base de datos
        contest_id: ID del concurso
        problem_id: ID del problema
        current_user: Usuario actual para validar permisos
    """
    check_coach_permission(current_user)

    statement = select(ContestProblem).where(
        ContestProblem.contest_id == contest_id, ContestProblem.problem_id == problem_id
    )
    relation = session.exec(statement).first()

    if not relation:
        raise HTTPException(status_code=404, detail="Relación no encontrada")

    if relation.contest.open:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes eliminar problemas de un concurso abierto para registro",
        )

    try:
        session.delete(relation)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=500, detail="Error al eliminar la relación del concurso"
        )

    return None


def handle_contest_problem_list(
    current_user: User, session: Session, contest_id: int
) -> list[ContestProblemPublic]:
    """
    Listar problemas de un concurso.

    Args:
        current_user: Usuario actual.
        session: Sesión de base de datos.
        contest_id: ID del concurso.

    Returns:
        List[ContestProblemPublic]: Lista de problemas del concurso.
    """
    contest = get_contest_or_404(contest_id, session)

    datetime_now = datetime.now(timezone.utc)
    start_date = contest.start_date
    if start_date.tzinfo is None:
        start_date = start_date.replace(tzinfo=timezone.utc)

    contest_has_started = start_date <= datetime_now

    if not contest_has_started and current_user.role == UserRole.STUDENT:
        return []

    problems = []
    for problem in contest.problems:
        problems.append(
            ContestProblemPublic(
                problem_id=problem.problem_id,  # type: ignore
                problem_name=problem.problem.title,
                points=problem.points,
                order=problem.order,
            )
        )
    return problems


def handle_join_contest(session, contest_id: int, current_user) -> None:
    """
    Inscribirse a un concurso.

    Args:
        session: Sesión de base de datos.
        contest_id: ID del concurso.
        current_user: Usuario actual.
    """

    contest = get_contest_or_404(contest_id, session)
    if contest.open is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes unirte a un concurso cerrado para registro",
        )

    if current_user in contest.participants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya estás inscrito a este concurso",
        )
    datetime_now = datetime.now(timezone.utc)
    if contest.end_date is not None and contest.end_date < datetime_now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El concurso ya ha terminado",
        )

    contest.participants.append(current_user)

    try:
        session.add(contest)
        for problem in contest.problems:
            session.add(
                ScoreboardEntry(
                    user_id=current_user.id,
                    contest_id=contest_id,
                    problem_id=problem.problem_id,  # type: ignore
                )
            )
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al unirse al concurso",
        )


def handle_leave_contest(session, contest_id: int, current_user) -> None:
    """
    Desregistrarse a un concurso.

    Args:
        session: Sesion de base de datos.
        contest_id: ID del concurso.
        current_user: Usuario actual.
    """
    contest = get_contest_or_404(contest_id, session)

    for user in contest.participants:
        if user.id == current_user.id:
            contest.participants.remove(user)

    try:
        session.add(contest)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al salirse del concurso",
        )


def handle_get_contest_participants(session, contest_id: int) -> list[UserPublic]:
    """
    Obtener participantes de un concurso.

    Args:
        session: Sesión de base de datos
        contest_id: ID del concurso

    Returns:
        List[User]: Lista de participantes del concurso
    """
    contest = get_contest_or_404(contest_id, session)
    participants = [
        UserPublic.model_validate(user, from_attributes=True)
        for user in contest.participants
    ]
    return participants


def handle_get_contest_scoreboard(current_user, session, contest_id: int):
    # 1. Cargamos el concurso y sus participantes en un solo paso
    # Usamos selectinload para que la relación 'participants' se cargue eficientemente
    statement = (
        select(Contest)
        .where(Contest.id == contest_id)
        .options(selectinload(getattr(Contest, "participants")))
    )
    contest = session.exec(statement).first()

    if not contest:
        raise HTTPException(status_code=404, detail="Concurso no encontrado")

    # 2. Validación de permisos (Coach/Admin o Participante)
    is_participant = any(p.id == current_user.id for p in contest.participants)
    if current_user.role not in ["admin", "coach"] and not is_participant:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permitido ver este scoreboard",
        )

    # 3. Traemos TODAS las entradas del marcador y el 'order' del problema
    # Unimos ScoreboardEntry con ContestProblem para tener la letra del problema (A, B, C...)
    entries_statement = (
        select(ScoreboardEntry, ContestProblem.order)
        .join(
            ContestProblem,
            col(ScoreboardEntry.problem_id) == col(ContestProblem.problem_id),
        )
        .where(ScoreboardEntry.contest_id == contest_id)
    )
    all_results = session.exec(entries_statement).all()

    # 4. Agrupamos en un diccionario: { user_id: [ScoreProblem, ...] }
    # Esto evita hacer SELECTs dentro de un bucle for
    user_results_map = {}
    for entry, p_order in all_results:
        if entry.user_id not in user_results_map:
            user_results_map[entry.user_id] = []

        user_results_map[entry.user_id].append(
            ScoreProblem(
                score=entry.score,
                order=p_order,
                bad_submissions=entry.bad_submissions,
                solved=entry.solved,
            )
        )

    # 5. Construimos la lista final de usuarios
    final_users = []
    for participant in contest.participants:
        problems_scored = user_results_map.get(participant.id, [])
        total_score = sum(p.score for p in problems_scored)

        final_users.append(
            ScoreboardUser(
                username=participant.username,
                problems=problems_scored,
                total_score=total_score,
            )
        )

    # 6. Ranking: Ordenamos por puntaje total (Descendente)
    final_users.sort(key=lambda u: u.total_score, reverse=True)

    return Scoreboard(users=final_users)
