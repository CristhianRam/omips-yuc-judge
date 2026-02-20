from app.api.deps import CurrentUserDep
from app.db import SessionDep
from app.schemas.contest_schemas import (
    ContestCreate,
    ContestListResponse,
    ContestProblemCreate,
    ContestPublic,
    ContestUpdate,
)
from app.services.contest_services import (
    handle_add_problem,
    handle_contest_create,
    handle_contest_delete,
    handle_contest_get,
    handle_contest_list,
    handle_contest_problem_list,
    handle_contest_update,
    handle_get_contest_participants,
    handle_join_contest,
    handle_leave_contest,
    handle_remove_problem,
)
from fastapi import APIRouter, status

from judge.app.schemas.user_schemas import UserPublic

router = APIRouter(prefix="/contests", tags=["Contest"])


@router.post("/", status_code=status.HTTP_200_OK, response_model=ContestPublic)
def create_contest(
    session: SessionDep, request: ContestCreate, current_user: CurrentUserDep
):
    return handle_contest_create(session, request, current_user)


@router.get("/list", response_model=ContestListResponse)
def list_contests(
    session: SessionDep,
    page_size: int = 10,
    page_number: int = 1,
):
    return handle_contest_list(session, page_size, page_number)


@router.get(
    "/{contest_id}", status_code=status.HTTP_200_OK, response_model=ContestPublic
)
def get_contest(
    contest_id: int,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    return handle_contest_get(contest_id, session, current_user)


@router.put(
    "/{contest_id}/", status_code=status.HTTP_200_OK, response_model=ContestPublic
)
def update_contest(
    session: SessionDep,
    contest_id: int,
    request: ContestUpdate,
    current_user: CurrentUserDep,
):
    return handle_contest_update(session, contest_id, request, current_user)


@router.delete("/{contest_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_contest(session: SessionDep, contest_id: int, current_user: CurrentUserDep):
    return handle_contest_delete(session, contest_id, current_user)


@router.post("/{contest_id}/addproblem/", status_code=status.HTTP_200_OK)
def add_problem_to_contest(
    session: SessionDep,
    contest_id: int,
    request: ContestProblemCreate,
    current_user: CurrentUserDep,
):
    return handle_add_problem(session, contest_id, current_user, request)


@router.delete(
    "/{contest_id}/removeproblem/{problem_id}/", status_code=status.HTTP_204_NO_CONTENT
)
def remove_problem_from_contest(
    session: SessionDep,
    current_user: CurrentUserDep,
    contest_id: int,
    problem_id: int,
):
    return handle_remove_problem(session, contest_id, problem_id, current_user)


@router.get("/{contest_id}/problems", status_code=status.HTTP_200_OK)
def get_contest_problems(
    session: SessionDep,
    current_user: CurrentUserDep,
    contest_id: int,
):
    return handle_contest_problem_list(session, contest_id)


@router.post("/{contest_id}/join", status_code=status.HTTP_200_OK)
def join_contest(
    session: SessionDep,
    current_user: CurrentUserDep,
    contest_id: int,
):
    return handle_join_contest(session, contest_id, current_user)


@router.delete("/{contest_id}/leave", status_code=status.HTTP_204_NO_CONTENT)
def leave_contest(
    session: SessionDep,
    current_user: CurrentUserDep,
    contest_id: int,
):
    return handle_leave_contest(session, contest_id, current_user)


@router.get(
    "/{contest_id}/participants",
    status_code=status.HTTP_200_OK,
    response_model=list[UserPublic],
)
def get_contest_participants(
    session: SessionDep,
    current_user: CurrentUserDep,
    contest_id: int,
):
    return handle_get_contest_participants(session, contest_id)
