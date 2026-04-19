import { createClient } from "redis"

const redisPassword = process.env.REDIS_PASSWORD
const redisHost = process.env.REDIS_HOST
const redisPort = process.env.REDIS_PORT || 6379

const redisUrl = redisPassword
  ? `redis://:${redisPassword}@${redisHost}:${redisPort}`
  : `redis://${redisHost}:${redisPort}`

export const redis = createClient({
  url: redisUrl
})

redis.on("error", err => console.error("Redis error", err))

export async function connectRedis() {
  await redis.connect()
  console.log("✅ Redis conectado")
}
