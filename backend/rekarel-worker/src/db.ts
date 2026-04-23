/**
 * @file backend/rekarel-worker/src/db.ts
 * @description Modulo del worker para evaluacion asincrona de envios.
 * @symbols updateSubmissionStatus, updateScoreboardEntry
 */

import { Pool } from 'pg';
import { ScoreboardEntryUpdate, SubmissionUpdate } from './types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://judge:judge@db:5432/judge',
});

export async function updateSubmissionStatus(
  id: string,
  data: SubmissionUpdate
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if (fields.length === 0) {
    console.warn(`⚠️ No hay campos para actualizar en submission ${id}`);
    return;
  }

  values.push(id);
  const query = `UPDATE submission SET ${fields.join(', ')} WHERE id = $${idx}::uuid`;

  try {
    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
      console.warn(`Submission ${id} no encontrado`);
    } else {
      console.log(`Submission ${id} actualizado`);
    }
  } catch (err) {
    console.error(`Error DB (Submission ${id}):`, err);
    throw err;
  }
}

export async function updateScoreboardEntry(
  contestId: number,
  userId: string,
  problemId: number,
  data: ScoreboardEntryUpdate
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if (fields.length === 0) {
    console.warn(`⚠️ No hay campos para actualizar en scoreboard entry ${userId} en concurso ${contestId}, problema ${problemId}`);
    return;
  }

  values.push(contestId, userId, problemId);
  const query = `UPDATE scoreboardentry SET ${fields.join(', ')} WHERE contest_id = $${idx} AND user_id = $${idx + 1} AND problem_id = $${idx + 2}`;

  try {
    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
      console.warn(`Scoreboard entry ${userId} en concurso ${contestId}, problema ${problemId} no encontrado`);
    } else {
      console.log(`Scoreboard entry ${userId} en concurso ${contestId}, problema ${problemId} actualizado`);
    }
  } catch (err) {
    console.error(`Error DB (Scoreboard Entry ${userId} en concurso ${contestId}, problema ${problemId}):`, err);
    throw err;
  }
}