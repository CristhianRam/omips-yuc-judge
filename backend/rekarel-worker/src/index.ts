import "dotenv/config"
import { connectRedis } from "./redis"
import { startWorker } from "./worker"

async function main() {
  await connectRedis()
  await startWorker()
}

main()
