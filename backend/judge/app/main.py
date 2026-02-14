from fastapi import FastAPI
from app.api.submissions import router as submissions_router

app = FastAPI(title="OMIPS Yucatan Judge API", version="1.0.0")

app.include_router(submissions_router)

@app.get("/")
def root():
    return {"status": "ok"}
