export interface SubmissionJob {
  submissionId: string
  problemId: number
  sourceCode: string
}

export interface JudgeResult {
  submissionId: string
  verdict: "AC" | "WA" | "RE" | "TLE"
  testcase?: string
  error?: string
  runtimeMs: number
}
