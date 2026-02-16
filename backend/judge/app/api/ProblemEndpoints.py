from typing import List, Optional

from app.api.deps import CurrentUserDep
from app.db import SessionDep
from app.models.Problem import Problem
from app.schemas.ProblemSchemas import (
    ProblemCreate,
    ProblemPublic,
    ProblemUpdate,
)
from fastapi import APIRouter, HTTPException, Query, status
from sqlmodel import select

router = APIRouter(prefix="/problems", tags=["Problems"])


@router.post("/", response_model=ProblemPublic, status_code=status.HTTP_201_CREATED)
def create_problem(
    problem_in: ProblemCreate,
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """Crear un nuevo problema."""

    if current_user.role == "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores y entrenadores pueden crear problemas",
        )

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


@router.get("/", response_model=List[ProblemPublic])
def list_problems(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    difficulty: Optional[str] = Query(None, pattern="^(easy|medium|hard)$"),
):
    """Listar problemas."""

    query = select(Problem)

    if difficulty:
        query = query.where(Problem.difficulty == difficulty)

    query = query.order_by(Problem.id).offset(skip).limit(limit)  # type: ignore

    problems = session.exec(query).all()
    return problems


@router.get("/{problem_id}", response_model=ProblemPublic)
def get_problem(
    problem_id: int,
    session: SessionDep,
):
    """Obtener un problema por ID."""

    problem = session.get(Problem, problem_id)

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Problema no encontrado"
        )

    return problem


@router.put("/{problem_id}", response_model=ProblemPublic)
def update_problem(
    problem_id: int,
    problem_in: ProblemUpdate,
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """Actualizar un problema (solo admins y entrenadores)."""

    if current_user.role == "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores y entrenadores pueden actualizar problemas",
        )

    problem = session.get(Problem, problem_id)

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Problema no encontrado"
        )

    # Actualizar solo campos proporcionados
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


@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_problem(
    problem_id: int,
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """Eliminar un problema (solo admins y entrenadores)."""

    if current_user.role == "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores y entrenadores pueden eliminar problemas",
        )

    problem = session.get(Problem, problem_id)

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Problema no encontrado"
        )

    try:
        session.delete(problem)
        session.commit()
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar problema",
        )
