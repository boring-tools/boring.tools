import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from '.'

export const accessToken = pgTable('accessToken', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('userId', { length: 32 }).references(() => user.id, {
    onDelete: 'cascade',
  }),
  token: text('token').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  lastUsedOn: timestamp('lastUsedOn'),
})

export const accessTokenRelation = relations(accessToken, ({ one }) => ({
  user: one(user, {
    fields: [accessToken.userId],
    references: [user.id],
  }),
}))

export type AccessTokenSelect = typeof accessToken.$inferSelect
export type AccessTokenInsert = typeof accessToken.$inferInsert
