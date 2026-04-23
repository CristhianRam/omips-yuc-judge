/**
 * @file backend/rekarel-worker/src/index.ts
 * @description Modulo del worker para evaluacion asincrona de envios.
 * @symbols main
 */

import "dotenv/config"
import { connectRedis } from "./redis"
import { startWorker } from "./worker"

async function main() {
  await connectRedis()
  await startWorker()
}

main()
