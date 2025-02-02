import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
export * from './migration'

import * as schema from './schema'
export * from './schema'

const POSTGRES_URL = import.meta.env.POSTGRES_URL ?? process.env.POSTGRES_URL

export const client = new Client({ connectionString: POSTGRES_URL })
await client.connect()

export const db = drizzle(client, { schema })
