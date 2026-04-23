"""
@file backend/judge/app/core/testcase_storage.py
@description Componentes nucleares de seguridad, almacenamiento y runtime.
@symbols get_problem_testcases_dir, save_testcase_files, read_testcase_file, delete_testcase_files, delete_problem_testcases, list_testcase_files
"""

import os
import shutil
from pathlib import Path
from typing import Tuple

from fastapi import UploadFile

TESTCASES_DIR = Path(os.getenv("TESTCASES_DIR", "/data/problems"))
# TESTCASES_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def get_problem_testcases_dir(problem_id: int) -> Path:
    """Obtiene el directorio de testcases de un problema."""
    problem_dir = TESTCASES_DIR / str(problem_id) / "testcases"
    try:
        problem_dir.mkdir(parents=True, exist_ok=True)
    except PermissionError as exc:
        raise IOError(
            f"Sin permisos para escribir en '{TESTCASES_DIR}'. "
            "Revisa permisos del volumen compartido de testcases."
        ) from exc
    return problem_dir


def save_testcase_files(
    id: str,
    problem_id: int,
    input_file: UploadFile,
    output_file: UploadFile,
) -> Tuple[str, str]:
    """
    Guarda un par de archivos .in y .out para un testcase.

    Args:
        id: ID del testcase (ej: "01", "sample").
        problem_id: ID del problema
        input_file: Archivo .in (mundo inicial de Karel)
        output_file: Archivo .out (mundo esperado)

    Returns:
        Tuple[str, str]: (ruta_input, ruta_output)
    """
    testcases_dir = get_problem_testcases_dir(problem_id)

    # Rutas de los archivos
    input_path = testcases_dir / f"{id}.in"
    output_path = testcases_dir / f"{id}.out"

    # Guardar archivo de entrada
    input_content = input_file.file.read()
    if len(input_content) > MAX_FILE_SIZE:
        raise ValueError(
            f"Archivo .in muy grande. Máximo: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )

    try:
        with open(input_path, "wb") as f:
            f.write(input_content)
    except Exception as e:
        raise IOError(f"Error guardando archivo .in: {e}")

    # Guardar archivo de salida
    output_content = output_file.file.read()
    if len(output_content) > MAX_FILE_SIZE:
        raise ValueError(
            f"Archivo .out muy grande. Máximo: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )

    try:
        with open(output_path, "wb") as f:
            f.write(output_content)
    except Exception as e:
        # Si falla al guardar el .out, eliminamos el .in para no dejar archivos huérfanos
        input_path.unlink(missing_ok=True)
        raise IOError(f"Error guardando archivo .out: {e}")

    return str(input_path), str(output_path)


def read_testcase_file(file_path: str) -> str:
    """Lee el contenido de un archivo de testcase."""
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def delete_testcase_files(input_path: str, output_path: str) -> None:
    """Elimina un par de archivos de testcase."""
    try:
        Path(input_path).unlink(missing_ok=True)
        Path(output_path).unlink(missing_ok=True)
    except Exception as e:
        print(f"Error eliminando testcase: {e}")


def delete_problem_testcases(problem_id: int) -> None:
    """Elimina todos los testcases de un problema."""
    testcases_dir = get_problem_testcases_dir(problem_id)
    if testcases_dir.exists():
        shutil.rmtree(testcases_dir)


def list_testcase_files(problem_id: int) -> list[Tuple[str, str]]:
    """
    Lista todos los pares de archivos .in/.out de un problema.

    Returns:
        Lista de tuplas (nombre, ruta_input, ruta_output)
    """
    testcases_dir = get_problem_testcases_dir(problem_id)

    testcases = []
    for input_file in sorted(testcases_dir.glob("*.in")):
        name = input_file.stem
        output_file = testcases_dir / f"{name}.out"

        if output_file.exists():
            testcases.append((name, str(input_file), str(output_file)))

    return testcases
