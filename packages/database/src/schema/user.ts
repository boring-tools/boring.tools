import { relations } from 'drizzle-orm'
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { access_token } from '.'
import { _basic_schema } from './_basic'
import { changelog } from './changelog'

export const user = pgTable('user', {
  ..._basic_schema,

  providerId: varchar({ length: 32 }).notNull().unique(), // Provider User Id
  name: text(),
  email: text().notNull().unique(),
})

export const userRelation = relations(user, ({ many }) => ({
  access_tokens: many(access_token),
  changelogs: many(changelog),
}))

export type UserSelect = typeof user.$inferSelect
export type UserInsert = typeof user.$inferInsert
