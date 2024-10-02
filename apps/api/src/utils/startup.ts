import { migrateDatabase } from '@boring.tools/database'
import { logger } from '@boring.tools/logger'

declare module 'bun' {
  interface Env {
    POSTGRES_URL: string
    CLERK_WEBHOOK_SECRET: string
    CLERK_SECRET_KEY: string
    CLERK_PUBLISHABLE_KEY: string
  }
}

export const startup = async () => {
  if (import.meta.env.NODE_ENV === 'test') {
    if (!import.meta.env.POSTGRES_URL) {
      logger.error('Env Var POSTGRES_URL is missing!')
      process.exit(0)
    }
    return
  }
  const keys = [
    'POSTGRES_URL',
    'CLERK_WEBHOOK_SECRET',
    'CLERK_SECRET_KEY',
    'CLERK_PUBLISHABLE_KEY',
  ]
  keys.map((key) => {
    if (!import.meta.env[key]) {
      logger.error(`Env Var ${key} is missing!`)
      process.exit(0)
    }
  })

  if (import.meta.env.NODE_ENV === 'production') {
    await migrateDatabase('migrations')
  }

  logger.info('API started')
}
