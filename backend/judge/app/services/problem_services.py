from typing import List, Optional

from app.core.testcase_storage import delete_problem_testcases
from app.models import Problem
from app.schemas.problem_schemas import ProblemCreate, ProblemUpdate
from fastapi import HTTPException, status
from sqlmodel import select


def check_coach_permission(current_user):
    """Validar que el usuario sea admin o coach."""
    if current_user.role not in ["admin", "coach"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permisos insuficientes",
        )


def get_problem_or_404(problem_id: int, session):
    """Obtener problema o lanzar 404."""
    problem = session.get(Problem, problem_id)
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Problema no encontrado"
        )
    return problem


def handle_problem_create(session, problem_in: ProblemCreate, current_user):
    """
    Crear un nuevo problema.

    Args:
        session: Sesión de base de datos.
        problem_in: Datos del nuevo problema.
        current_user: Usuario actual para validar permisos.

    Returns:
        Problem:El problema creado.

    """
    check_coach_permission(current_user)

    problem = Problem(
        title=problem_in.title,
        description=problem_in.description,
        time_limit_ms=problem_in.time_limit_ms,
        memory_limit_mb=problem_in.memory_limit_mb,
        difficulty=problem_in.difficulty,
    )

    try:
        session.add(problem)
        session.commit()
        session.refresh(problem)
        return problem
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear problema",
        )


def handle_problem_list(
    session, skip: int = 0, limit: int = 50, difficulty: Optional[str] = None
) -> List[Problem]:
    """
    Listar problemas con filtros.
    Args:
        session: Sesión de base de datos.
        skip: Cantidad de registros a omitir (paginación).
        limit: Cantidad máxima de registros a retornar.
        difficulty: Filtrar por dificultad (easy, medium, hard).

    Returns:
    List[Problem]: Lista de problemas que cumplen los criterios.
    """
    query = select(Problem)

    if difficulty:
        query = query.where(Problem.difficulty == difficulty)

    query = query.order_by(Problem.id).offset(skip).limit(limit)  # type: ignore

    return session.exec(query).all()


def handle_problem_update(
    session, problem_id: int, problem_in: ProblemUpdate, current_user
):
    """
    Actualizar un problema.

    Args:
        session: Sesión de base de datos.
        problem_id: ID del problema a actualizar.
        problem_in: Datos para actualizar el problema.
        current_user: Usuario actual para validar permisos.

    Returns:
        Problem: El problema actualizado.
    """
    check_coach_permission(current_user)

    problem = get_problem_or_404(problem_id, session)

    update_data = problem_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(problem, key, value)

    try:
        session.add(problem)
        session.commit()
        session.refresh(problem)
        return problem
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar problema",
        )


def handle_problem_delete(session, problem_id: int, current_user):
    """
    Eliminar un problema.

    Args:
        session: Sesión de base de datos.
        problem_id: ID del problema a eliminar.
        current_user: Usuario actual para validar permisos.
    """
    check_coach_permission(current_user)

    problem = get_problem_or_404(problem_id, session)

    try:
        delete_problem_testcases(problem_id)
        session.delete(problem)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar problema",
        )
