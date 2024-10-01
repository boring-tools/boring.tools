import path from 'node:path'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { client, db } from './'

export const migrateDatabase = async (dir: string) => {
  try {
    console.log(__dirname)
    await migrate(db, { migrationsFolder: dir })
    await client.end()
    console.log('Migrations: Ok')
  } catch (error) {
    console.error('Migrations: Failed')
    console.error(error)
  }
}
