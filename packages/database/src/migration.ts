import { logger } from '@boring.tools/logger'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { client, db } from './'

export const migrateDatabase = async (dir: string) => {
  try {
    await migrate(db, { migrationsFolder: dir })
    await client.end()
    logger.log('Migrations: Ok')
  } catch (error) {
    logger.error('Migrations: Failed')
    logger.error(error)
  }
}
