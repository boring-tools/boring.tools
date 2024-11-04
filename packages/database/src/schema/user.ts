import { relations } from 'drizzle-orm'
import { pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { access_token } from '.'
import { changelog } from './changelog'

export const user = pgTable('user', {
  id: varchar({ length: 32 }).primaryKey(), // Clerk User Id
  name: text(),
  email: text().notNull().unique(),
})

export const userRelation = relations(user, ({ many }) => ({
  access_tokens: many(access_token),
  changelogs: many(changelog),
}))

export type UserSelect = typeof user.$inferSelect
export type UserInsert = typeof user.$inferInsert
