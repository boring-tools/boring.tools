import { createClient } from 'redis'

const getRedisOptions = () => {
  if (import.meta.env.NODE_ENV === 'production') {
    return {
      password: import.meta.env.REDIS_PASSWORD,
      url: import.meta.env.REDIS_URL,
    }
  }
  return {
    url: import.meta.env.REDIS_URL,
  }
}
export const redis = createClient(getRedisOptions())

redis.on('error', (err) => console.log('Redis Client Error', err))
await redis.connect()
