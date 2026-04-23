"""
@file backend/judge/app/models/__init__.py
@description Modelo de datos ORM del backend Judge.
@symbols N/A
"""

from .contest import Contest
from .contest_problem import ContestProblem
from .contest_user import ContestUser
from .email_verification import PendingRegistration
from .password_reset import PendingPasswordReset
from .problem import Problem, ProblemDifficulty
from .submission import Submission
from .testcase import TestCase
from .user import User, UserRole
from .scoreboard import ScoreboardEntry
