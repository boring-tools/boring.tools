import path from 'node:path'
import { migrateDatabase } from '@boring.tools/database'
import { logger } from '@boring.tools/logger'

declare module 'bun' {
  interface Env {
    POSTGRES_URL: string
    CLERK_WEBHOOK_SECRET: string
    CLERK_SECRET_KEY: string
    CLERK_PUBLISHABLE_KEY: string
    BETTERSTACK_LOG_TOKEN: string
  }
}

const TEST_VARIABLES = ['POSTGRES_URL']

const DEVELOPMENT_VARIABLES = [
  ...TEST_VARIABLES,
  'CLERK_WEBHOOK_SECRET',
  'CLERK_SECRET_KEY',
  'CLERK_PUBLISHABLE_KEY',
]

const PRODUCTION_VARIABLES = [...DEVELOPMENT_VARIABLES, 'BETTERSTACK_LOG_TOKEN']

export const startup = async () => {
  if (import.meta.env.NODE_ENV === 'test') {
    TEST_VARIABLES.map((key) => {
      if (!import.meta.env[key]) {
        logger.error(`Env Var ${key} is missing!`)
        process.exit(0)
      }
    })
  }

  if (import.meta.env.NODE_ENV === 'development') {
    DEVELOPMENT_VARIABLES.map((key) => {
      if (!import.meta.env[key]) {
        logger.error(`Env Var ${key} is missing!`)
        process.exit(0)
      }
    })
  }

  if (import.meta.env.NODE_ENV === 'production') {
    PRODUCTION_VARIABLES.map((key) => {
      if (!import.meta.env[key]) {
        logger.error(`Env Var ${key} is missing!`)
        process.exit(0)
      }
    })
  }

  if (import.meta.env.NODE_ENV === 'production') {
    await migrateDatabase('migrations')
  }

  if (import.meta.env.NODE_ENV === 'development') {
    await migrateDatabase(
      path.join(__dirname, '../../../../packages/database/src/migrations'),
    )
  }

  logger.info('API started')
}
