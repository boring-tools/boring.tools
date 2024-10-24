import { relations } from 'drizzle-orm'
import {
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { json } from 'drizzle-orm/pg-core'
import { uniqueIndex } from 'drizzle-orm/pg-core'
import { page } from './page'
import { user } from './user'

export const changelog = pgTable('changelog', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt'),

  userId: varchar('userId', { length: 32 }).references(() => user.id, {
    onDelete: 'cascade',
  }),

  pageId: uuid('pageId').references(() => page.id),

  title: varchar('title', { length: 256 }),
  description: text('description'),
  isSemver: boolean('isSemver').default(true),
})

export const changelogs_to_pages = pgTable(
  'changelogs_to_pages',
  {
    changelogId: uuid('changelogId')
      .notNull()
      .references(() => changelog.id, { onDelete: 'cascade' }),
    pageId: uuid('pageId')
      .notNull()
      .references(() => page.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.changelogId, t.pageId] }),
  }),
)

export const changelogs_to_pages_relations = relations(
  changelogs_to_pages,
  ({ one }) => ({
    changelog: one(changelog, {
      fields: [changelogs_to_pages.changelogId],
      references: [changelog.id],
    }),
    page: one(page, {
      fields: [changelogs_to_pages.pageId],
      references: [page.id],
    }),
  }),
)

export const changelog_relation = relations(changelog, ({ many, one }) => ({
  versions: many(changelog_version),
  commits: many(changelog_commit),
  user: one(user, {
    fields: [changelog.userId],
    references: [user.id],
  }),
  pages: many(changelogs_to_pages),
}))

export const changelog_version_status = pgEnum('status', [
  'draft',
  'review',
  'published',
])

export const changelog_version = pgTable('changelog_version', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt'),
  releasedAt: timestamp('releasedAt'),

  changelogId: uuid('changelogId')
    .references(() => changelog.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  version: varchar('version', { length: 32 }).notNull(),
  markdown: text('markdown').notNull(),
  status: changelog_version_status('status').default('draft').notNull(),
})

export const changelog_commit = pgTable(
  'changelog_commit',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('createdAt'),

    changelogId: uuid('changelogId').references(() => changelog.id, {
      onDelete: 'cascade',
    }),
    versionId: uuid('versionId').references(() => changelog_version.id, {
      onDelete: 'cascade',
    }),

    shortHash: varchar('shortHash', { length: 8 }).notNull(),
    author: json('author').$type<{ name: string; email: string }>(),
    body: text('body'),
    message: text('message').notNull(),
  },
  (table) => ({
    unique: uniqueIndex('unique').on(table.changelogId, table.shortHash),
  }),
)

export const changelog_commit_relation = relations(
  changelog_commit,
  ({ one }) => ({
    changelog: one(changelog, {
      fields: [changelog_commit.changelogId],
      references: [changelog.id],
    }),
    version: one(changelog_version, {
      fields: [changelog_commit.versionId],
      references: [changelog_version.id],
    }),
  }),
)

export const changelog_version_relation = relations(
  changelog_version,
  ({ one, many }) => ({
    changelog: one(changelog, {
      fields: [changelog_version.changelogId],
      references: [changelog.id],
    }),
    commits: many(changelog_commit),
  }),
)
