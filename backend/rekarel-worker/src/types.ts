/**
 * @file backend/rekarel-worker/src/types.ts
 * @description Modulo del worker para evaluacion asincrona de envios.
 * @symbols N/A
 */

export type SubmissionStatus = 'QUEUED' | 'JUDGING' | 'COMPLETED';
export type SubmissionVerdict = 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';

export interface ContestData {
  contest_id: number;
  user_id: string;
  points: number;
  solved: boolean;
  bad_submissions: number;
}

export interface SubmissionJob {
  submissionId: string;
  contestData: ContestData | null;
  problemId: number;
  sourceCode: string;
  timeLimitMs: number;
  memoryLimitMb: number;
}

export interface SubmissionUpdate {
  status?: SubmissionStatus;
  verdict?: SubmissionVerdict | null;
  runtime_ms?: number | null;
  error_message?: string | null;
  failed_testcase?: string | null;
}

export interface ScoreboardEntryUpdate {
  bad_submissions?: number | null;
  score?: number | null;
  solved?: boolean | null;
}