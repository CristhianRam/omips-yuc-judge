import uuid

from app.api.deps import CurrentCoachDep, SessionDep
from app.schemas.testcase_schemas import (
    TestCasePublic,
    TestCaseWithContent,
)
from app.services.testcase_services import (
    handle_testcase_create,
    handle_testcase_delete,
    handle_testcase_get,
    handle_testcase_list,
)
from fastapi import APIRouter, File, Form, UploadFile

router = APIRouter(prefix="/testcases", tags=["TestCases"])


@router.post("/{problem_id}", response_model=TestCasePublic)
def create_testcase(
    problem_id: int,
    current_coach: CurrentCoachDep,
    session: SessionDep,
    name: str = Form(...),
    input_file: UploadFile = File(..., description="Archivo .in (mundo inicial)"),
    output_file: UploadFile = File(..., description="Archivo .out (mundo esperado)"),
):
    """Crear un nuevo testcase para un problema."""

    return handle_testcase_create(session, problem_id, name, input_file, output_file)


@router.delete("/{problem_id}/{testcase_id}")
def delete_testcase(
    problem_id: int,
    testcase_id: uuid.UUID,
    current_coach: CurrentCoachDep,
    session: SessionDep,
):
    """Eliminar un testcase de un problema."""

    handle_testcase_delete(problem_id, testcase_id, session)


@router.get("/{problem_id}", response_model=list[TestCasePublic])
def list_testcases(
    problem_id: int, session: SessionDep, current_coach: CurrentCoachDep
):
    """Listar todos los testcases de un problema."""

    return handle_testcase_list(problem_id, session)


@router.get("/{problem_id}/{testcase_id}", response_model=TestCaseWithContent)
def get_testcase(
    problem_id: int,
    testcase_id: uuid.UUID,
    session: SessionDep,
    current_coach: CurrentCoachDep,
):
    """Obtener un testcase específico con su contenido."""

    return handle_testcase_get(problem_id, testcase_id, session)
