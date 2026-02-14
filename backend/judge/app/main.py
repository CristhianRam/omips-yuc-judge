from fastapi import FastAPI

app = FastAPI(title="OMIPS Yucatan Judge API", version="1.0.0")

@app.get("/")
def root():
    return {"status": "ok"}
