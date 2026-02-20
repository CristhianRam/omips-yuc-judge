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

export interface Contest {
  id: string;
  title: string;
  status: 'Live' | 'Upcoming' | 'Past';
  duration: string;
  participants: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
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
