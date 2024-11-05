import { createClient } from 'redis'

export const redis = createClient({
  password: import.meta.env.REDIS_PASSWORD,
  url: import.meta.env.REDIS_URL,
})

console.log(import.meta.env)

redis.on('error', (err) => console.log('Redis Client Error', err))
await redis.connect()
