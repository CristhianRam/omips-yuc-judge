// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
  token?: string;
};

export type Role = 'admin' | 'coach' | 'student';

// Matches backend ContestPublic
export interface ContestPublic {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  open: boolean;
}

// Matches backend ContestProblemPublic
export interface ContestProblemPublic {
  problem_id: number;
  problem_name: string;
  points: number;
  order: string;
}

// Matches backend ScoreProblem
export interface ScoreProblem {
  score: number;
  order: string;
  bad_submissions: number;
  solved: boolean;
}

// Matches backend ScoreboardUser
export interface ScoreboardUser {
  username: string;
  problems: ScoreProblem[];
  total_score: number;
}

// Matches backend Scoreboard
export interface Scoreboard {
  users: ScoreboardUser[];
}

export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
  id: number;
  title: string;
  description: string;
  time_limit_ms: number;
  memory_limit_mb: number;
  difficulty: ProblemDifficulty;
}

export interface ProblemForm {
  id?: number;
  title: string;
  description: string;
  time_limit_ms: number;
  memory_limit_mb: number;
  difficulty: ProblemDifficulty;
}

export interface TestCase {
  id: string;
  name: string;
  problem_id: number;
  input_file: string;
  output_file: string;
}

export interface Submission {
  id: string;
  userName: string;
  problemId: number;
  contestId?: number;
  code: string;
  status: string;
  verdict: string;
  createdAt: string;
  runtimeMs?: number;
  failedTestcase?: number;
  errorMessage?: string;
}

// Matches backend SubmissionPreview (from GET /submissions/)
export interface SubmissionPreview {
  id: string;
  userName: string;
  problemId: number;
  contestId?: number;
  status: string;
  verdict?: string;
  createdAt: string;
}

// Matches backend UserPublic (from GET /users/ and GET /users/{id})
export interface UserPublic {
  id: string;
  username: string;
  email: string;
  role: Role;
}
