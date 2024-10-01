import path from 'node:path'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { client, db } from './'

export const migrateDatabase = async () => {
  await migrate(db, { migrationsFolder: path.join(__dirname, 'migrations') })
  await client.end()
}
