from contextlib import asynccontextmanager

from app.api.AdminEndpoints import router as admin_router
from app.api.AuthEndpoints import router as auth_router
from app.api.SubmissionsEndpoints import router as submissions_router
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


app.include_router(submissions_router)
app.include_router(auth_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {"status": "ok"}
