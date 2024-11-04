import { relations } from 'drizzle-orm'
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { _basic_schema } from './_basic'
import { changelogs_to_pages } from './changelog'
import { user } from './user'

export const page = pgTable('page', {
  ..._basic_schema,

  userId: uuid().references(() => user.id, {
    onDelete: 'cascade',
  }),

  title: text().notNull(),
  description: text().notNull(),
  icon: text().default(''),
})

export const pageRelation = relations(page, ({ many }) => ({
  changelogs: many(changelogs_to_pages),
}))
