/**
 * @file backend/rekarel-worker/src/loader/testcases.ts
 * @description Modulo del worker para evaluacion asincrona de envios.
 * @symbols loadTestcases
 */

import fs from "fs/promises"
import path from "path"

export interface TestCase {
  name: string
  input: string
  expected: string
}

const BASE = "/data/problems"

export async function loadTestcases(problemId: number): Promise<TestCase[]> {
  const dir = path.join(BASE, String(problemId), "testcases")

  const files = (await fs.readdir(dir)).sort()

  const cases: TestCase[] = []

  for (const file of files) {
    if (!file.endsWith(".in")) continue

    const base = file.replace(".in", "")
    const input = await fs.readFile(path.join(dir, `${base}.in`), "utf8")
    const expected = await fs.readFile(path.join(dir, `${base}.out`), "utf8")

    cases.push({ name: base, input, expected })
  }

  return cases
}
