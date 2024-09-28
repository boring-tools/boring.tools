import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { accessToken } from '.'

export const user = pgTable('user', {
  id: varchar('id', { length: 32 }).primaryKey(), // Clerk User Id
  name: text('name'),
  email: text('email').notNull().unique(),
})

export const userRelation = relations(user, ({ many }) => ({
  accessTokens: many(accessToken),
}))

export type UserSelect = typeof user.$inferSelect
export type UserInsert = typeof user.$inferInsert
