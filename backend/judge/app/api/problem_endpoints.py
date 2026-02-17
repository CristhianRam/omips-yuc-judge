from typing import List, Optional

from app.api.deps import CurrentUserDep
from app.db import SessionDep
from app.models import Problem
from app.schemas.problem_schemas import (
    ProblemCreate,
    ProblemPublic,
    ProblemUpdate,
)
from app.services.problem_services import (
    handle_problem_create,
    handle_problem_delete,
    handle_problem_list,
    handle_problem_update,
)
from fastapi import APIRouter, HTTPException, Query, status

router = APIRouter(prefix="/problems", tags=["Problems"])


@router.post("/", response_model=ProblemPublic, status_code=status.HTTP_201_CREATED)
def create_problem(
    problem_in: ProblemCreate,
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """Crear un nuevo problema."""

    return handle_problem_create(session, problem_in, current_user)


@router.get("/", response_model=List[ProblemPublic])
def list_problems(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    difficulty: Optional[str] = Query(None, pattern="^(easy|medium|hard)$"),
):
    """Listar problemas."""

    return handle_problem_list(session, skip, limit, difficulty)


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

    return handle_problem_update(session, problem_id, problem_in, current_user)


@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_problem(
    problem_id: int,
    current_user: CurrentUserDep,
    session: SessionDep,
):
    """Eliminar un problema (solo admins y entrenadores)."""

    handle_problem_delete(session, problem_id, current_user)
