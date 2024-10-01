import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from '.'

export const access_token = pgTable('access_token', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('userId', { length: 32 }).references(() => user.id, {
    onDelete: 'cascade',
  }),
  token: text('token').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  lastUsedOn: timestamp('lastUsedOn'),
})

export const access_token_relation = relations(access_token, ({ one }) => ({
  user: one(user, {
    fields: [access_token.userId],
    references: [user.id],
  }),
}))
