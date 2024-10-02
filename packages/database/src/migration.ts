import { logger } from '@boring.tools/logger'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from './'

export const migrateDatabase = async (dir: string) => {
  try {
    await migrate(db, { migrationsFolder: dir })
    logger.info('Migrations: Ok')
  } catch (error) {
    logger.error('Migrations: Failed', error)
  }
}
