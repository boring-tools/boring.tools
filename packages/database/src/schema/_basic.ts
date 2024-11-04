import { timestamp, uuid } from 'drizzle-orm/pg-core'

export const _basic_schema = {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }),
}
