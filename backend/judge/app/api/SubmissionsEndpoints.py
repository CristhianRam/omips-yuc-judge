import json
import uuid

from app.api.deps import get_current_user
from app.core.redis import redis_conn
from app.models.User import User
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/submissions", tags=["Submissions"])


@router.post("/{problemId}")
def submit(
    problemId: int,
    code: str,
    current_user: User = Depends(get_current_user),
):

    job_id = str(uuid.uuid4())
    payload = {"submissionId": job_id, "problemId": problemId, "code": code}

    redis_conn.lpush("submission_queue", json.dumps(payload))

    return {"status": "queued", "submissionId": job_id}
