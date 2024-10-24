import { relations } from 'drizzle-orm'
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { changelog, changelogs_to_pages } from './changelog'
import { user } from './user'

export const page = pgTable('page', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: varchar('userId', { length: 32 }).references(() => user.id, {
    onDelete: 'cascade',
  }),

  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').default(''),
})

export const pageRelation = relations(page, ({ many }) => ({
  changelogs: many(changelogs_to_pages),
}))
