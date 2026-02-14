from fastapi import APIRouter
from app.core.redis import redis_conn, submission_queue

router = APIRouter(prefix="/submissions", tags=["Submissions"])

@router.post("/{problemId}")
def submit(problemId: str, code: str):
    job_id = str(uuid.uuid4())
    payload = {
        "submissionId": job_id,
        "problemId": problemId,
        "code": code
    }
    
    redis_conn.lpush("submission_queue", json.dumps(payload))

    return {
        "status": "queued",
        "submissionId": job_id
    }
