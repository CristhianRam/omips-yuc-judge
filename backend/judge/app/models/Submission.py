from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class SubmissionStatus(str, Enum):
    """Estados posibles de un submission."""

    QUEUED = "QUEUED"
    JUDGING = "JUDGING"
    COMPLETED = "COMPLETED"


class SubmissionVerdict(str, Enum):
    """Veredictos posibles de evaluación."""

    AC = "AC"  # Accepted
    WA = "WA"  # Wrong Answer
    TLE = "TLE"  # Time Limit Exceeded
    RE = "RE"  # Runtime Error
    CE = "CE"  # Compilation Error


class Submission(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    problem_id: int = Field(foreign_key="problem.id")
    contest_id: Optional[int] = Field(default=None, foreign_key="contest.id")
    code: str
    status: SubmissionStatus = Field(default=SubmissionStatus.QUEUED)
    verdict: Optional[SubmissionVerdict] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Métricas (llenadas por el Worker)
    runtime_ms: Optional[int] = Field(default=None)
    failed_testcase: Optional[str] = Field(default=None, max_length=255)
    error_message: Optional[str] = Field(default=None)
