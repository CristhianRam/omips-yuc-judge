import uuid

from app.api.deps import CurrentCoachDep, SessionDep
from app.core.testcase_storage import (
    delete_testcase_files,
    read_testcase_file,
    save_testcase_files,
)
from app.models import TestCase
from app.schemas.TestCaseSchemas import (
    TestCasePublic,
    TestCaseWithContent,
)
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from sqlmodel import select

router = APIRouter(prefix="/testcases", tags=["TestCases"])


@router.post("/{problem_id}", response_model=TestCasePublic)
async def create_testcase(
    problem_id: int,
    current_coach: CurrentCoachDep,
    session: SessionDep,
    name: str = Form(...),
    input_file: UploadFile = File(..., description="Archivo .in (mundo inicial)"),
    output_file: UploadFile = File(..., description="Archivo .out (mundo esperado)"),
):
    """Crear un nuevo testcase para un problema."""

    id = uuid.uuid4()

    try:
        input_path, output_path = await save_testcase_files(
            str(id), problem_id, input_file, output_file
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except IOError as ioe:
        raise HTTPException(status_code=500, detail=str(ioe))

    testcase = TestCase(
        id=id,
        name=name,
        problem_id=problem_id,
        input_file=input_path,
        output_file=output_path,
    )

    try:
        session.add(testcase)
        session.commit()
        session.refresh(testcase)
        return testcase
    except Exception:
        session.rollback()
        delete_testcase_files(
            input_path, output_path
        )  # Limpiar archivos si falla la DB
        raise HTTPException(
            status_code=500, detail="Error al guardar el testcase en la base de datos"
        )


@router.delete("/{problem_id}/{testcase_id}")
async def delete_testcase(
    problem_id: int,
    testcase_id: uuid.UUID,
    current_coach: CurrentCoachDep,
    session: SessionDep,
):
    """Eliminar un testcase de un problema."""

    testcase = session.get(TestCase, testcase_id)
    if not testcase:
        raise HTTPException(status_code=404, detail="Testcase no encontrado")

    if testcase.problem_id != problem_id:
        raise HTTPException(status_code=400, detail="Testcase no pertenece al problema")

    try:
        input_path = testcase.input_file
        output_path = testcase.output_file

        session.delete(testcase)
        session.commit()

        delete_testcase_files(input_path, output_path)
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error al eliminar el testcase")


@router.get("/{problem_id}", response_model=list[TestCasePublic])
def list_testcases(
    problem_id: int, session: SessionDep, current_coach: CurrentCoachDep
):
    """Listar todos los testcases de un problema."""

    statement = select(TestCase).where(TestCase.problem_id == problem_id)
    testcases = session.exec(statement).all()

    if not testcases:
        raise HTTPException(
            status_code=404, detail="No se encontraron testcases para este problema"
        )

    return testcases


@router.get("/{problem_id}/{testcase_id}", response_model=TestCaseWithContent)
def get_testcase(
    problem_id: int,
    testcase_id: uuid.UUID,
    session: SessionDep,
    current_coach: CurrentCoachDep,
):
    """Obtener un testcase específico con su contenido."""

    testcase = session.get(TestCase, testcase_id)
    if not testcase:
        raise HTTPException(status_code=404, detail="Testcase no encontrado")

    if testcase.problem_id != problem_id:
        raise HTTPException(status_code=400, detail="Testcase no pertenece al problema")

    try:
        input_content = read_testcase_file(testcase.input_file)
        output_content = read_testcase_file(testcase.output_file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error leyendo archivos: {e}")

    return TestCaseWithContent(
        id=testcase.id,
        name=testcase.name,
        problem_id=testcase.problem_id,
        input_content=input_content,
        output_content=output_content,
    )
