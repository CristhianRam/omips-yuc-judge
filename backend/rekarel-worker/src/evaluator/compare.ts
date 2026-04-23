/**
 * @file backend/rekarel-worker/src/evaluator/compare.ts
 * @description Modulo del worker para evaluacion asincrona de envios.
 * @symbols compareOutput
 */

export function compareOutput(a: string, b: string): boolean {
  return a.replace(/\s+/g, "") === b.replace(/\s+/g, "")
}
