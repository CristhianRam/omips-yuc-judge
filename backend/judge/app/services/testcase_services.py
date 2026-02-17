import uuid

from app.core.testcase_storage import (
    delete_testcase_files,
    read_testcase_file,
    save_testcase_files,
)
from app.models import TestCase
from app.schemas.testcase_schemas import (
    TestCasePublic,
    TestCaseWithContent,
)
from fastapi import HTTPException, UploadFile
from sqlmodel import select


def handle_testcase_create(
    session, problem_id, name: str, input_file: UploadFile, output_file: UploadFile
) -> TestCase:
    """
    Crear un nuevo testcase para un problema.

    Args:
        session: Sesión de base de datos.
        problem_id: ID del problema al que pertenece el testcase.
        name: Nombre del testcase.
        input_file: Archivo de entrada (.in).
        output_file: Archivo de salida (.out).

    Returns:
        TestCase: Testcase creado.
    """
    id = uuid.uuid4()

    try:
        input_path, output_path = save_testcase_files(
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


def handle_testcase_delete(problem_id: int, testcase_id: uuid.UUID, session):
    """
    Eliminar un testcase de un problema.

    Args:
        problem_id: ID del problema al que pertenece el testcase.
        testcase_id: ID del testcase a eliminar.
        session: Sesión de base de datos.

    Raises:
        HTTPException: Si el testcase no se encuentra o no pertenece al problema.
    """
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


def handle_testcase_list(problem_id: int, session) -> list[TestCasePublic]:
    """
    Listar todos los testcases de un problema.

    Args:
        problem_id: ID del problema del que se quieren listar los testcases.
        session: Sesión de base de datos.

    Returns:
        list[TestCasePublic]: Lista de testcases encontrados.
    """
    problem_exists = session.exec(
        select(TestCase.problem_id).where(TestCase.problem_id == problem_id)
    ).first()

    if not problem_exists:
        raise HTTPException(status_code=404, detail="El problema no existe")

    statement = select(TestCase).where(TestCase.problem_id == problem_id)
    testcases = session.exec(statement).all()

    return [TestCasePublic.model_validate(tc, from_attributes=True) for tc in testcases]


def handle_testcase_get(
    problem_id: int, testcase_id: uuid.UUID, session
) -> TestCaseWithContent:
    """
    Obtener un testcase específico.

    Args:
        problem_id: ID del problema al que pertenece el testcase.
        testcase_id: ID del testcase a obtener.
        session: Sesión de base de datos.

    Returns:
        TestCasePublic: Información del testcase encontrado.

    """
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
