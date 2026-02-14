import json
import uuid

from app.api.deps import CurrentUserDep
from app.core.redis import redis_conn
from fastapi import APIRouter

from judge.app.schemas.SubmissionSchemas import SubmissionRequest

router = APIRouter(prefix="/submissions", tags=["Submissions"])


@router.post("/submit")
def submit(
    request: SubmissionRequest,
    current_user: CurrentUserDep,
):

    job_id = str(uuid.uuid4())
    payload = {
        "submissionId": job_id,
        "problemId": request.problem_id,
        "code": request.source_code,
    }

    redis_conn.lpush("submission_queue", json.dumps(payload))

    return {"status": "queued", "submissionId": job_id}
