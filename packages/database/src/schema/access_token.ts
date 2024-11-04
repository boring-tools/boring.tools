import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from '.'
import { _basic_schema } from './_basic'

export const access_token = pgTable('access_token', {
  ..._basic_schema,

  userId: uuid().references(() => user.id, {
    onDelete: 'cascade',
  }),
  token: text().notNull(),
  name: text().notNull(),
  lastUsedOn: timestamp(),
})

export const access_token_relation = relations(access_token, ({ one }) => ({
  user: one(user, {
    fields: [access_token.userId],
    references: [user.id],
  }),
}))
