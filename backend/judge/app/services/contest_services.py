from app.models import Contest
from app.models.contest_problem import ContestProblem
from app.models.user import User
from app.schemas.contest_schemas import (
    ContestCreate,
    ContestListResponse,
    ContestProblemCreate,
    ContestProblemPublic,
    ContestPublic,
    ContestUpdate,
)
from app.services.problem_services import get_problem_or_404
from fastapi import HTTPException, status
from sqlmodel import Session, desc, func, select

from judge.app.schemas.user_schemas import UserPublic


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
    try:
        session.delete(relation)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=500, detail="Error al eliminar la relación del concurso"
        )

    return None


def handle_contest_problem_list(session, contest_id: int) -> list[ContestProblemPublic]:
    """
    Listar problemas de un concurso.

    Args:
        session: Sesión de base de datos.
        contest_id: ID del concurso.

    Returns:
        List[ContestProblemPublic]: Lista de problemas del concurso.
    """
    contest = get_contest_or_404(contest_id, session)
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

    if current_user in contest.participants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya estás inscrito a este concurso",
        )

    contest.participants.append(current_user)
    try:
        session.add(contest)
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
