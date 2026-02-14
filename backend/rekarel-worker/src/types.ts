export interface SubmissionJob {
  submissionId: number
  problemId: number
  sourceCode: string
}

export interface JudgeResult {
  submissionId: number
  verdict: "AC" | "WA" | "RE" | "TLE"
  testcase?: string
  error?: string
  runtimeMs: number
}
