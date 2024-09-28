import { drizzle } from 'drizzle-orm/postgres-js'
import { Client } from 'pg'

import * as schema from './schema'
export * from './schema'

const POSTGRES_URL = import.meta.env.POSTGRES_URL ?? process.env.POSTGRES_URL

const client = new Client({ connectionString: POSTGRES_URL })
await client.connect()

export const db = drizzle(client, { schema })
