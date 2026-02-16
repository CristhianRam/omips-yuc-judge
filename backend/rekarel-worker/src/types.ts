export type SubmissionStatus = 'QUEUED' | 'JUDGING' | 'COMPLETED';
export type SubmissionVerdict = 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';

export interface SubmissionJob {
  submissionId: string;
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