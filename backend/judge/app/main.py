from contextlib import asynccontextmanager

from app.api.auth_endpoints import router as auth_router
from app.api.dev_endpoints import router as dev_router
from app.api.problem_endpoints import router as problem_router
from app.api.submission_endpoints import router as submissions_router
from app.api.testcase_endpoints import router as testcase_router
from app.api.user_endpoints import router as user_router
from app.db import engine
from app.models import *  # Importa todos los modelos para que SQLModel pueda crear las tablas  # noqa: F403
from fastapi import FastAPI
from sqlmodel import SQLModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Crear tablas
    SQLModel.metadata.create_all(engine)
    yield
    # Shutdown


app = FastAPI(title="OMIPS Yucatan Judge API", version="1.0.0", lifespan=lifespan)

app.include_router(dev_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(problem_router)
app.include_router(testcase_router)
app.include_router(submissions_router)


@app.get("/")
def root():
    return {"status": "ok"}
