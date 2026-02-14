import { createClient } from "redis"

export const redis = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
})

redis.on("error", err => console.error("Redis error", err))

export async function connectRedis() {
  await redis.connect()
  console.log("✅ Redis conectado")
}
