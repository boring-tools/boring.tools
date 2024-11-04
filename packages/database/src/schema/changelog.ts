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
import { _basic_schema } from './_basic'
import { page } from './page'
import { user } from './user'

export const changelog = pgTable('changelog', {
  ..._basic_schema,

  userId: uuid().references(() => user.id, {
    onDelete: 'cascade',
  }),

  pageId: uuid().references(() => page.id),

  title: varchar({ length: 256 }),
  description: text(),
  isSemver: boolean().default(true),
  isConventional: boolean().default(true),
})

export const changelogs_to_pages = pgTable(
  'changelogs_to_pages',
  {
    changelogId: uuid()
      .notNull()
      .references(() => changelog.id, { onDelete: 'cascade' }),
    pageId: uuid()
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
  ..._basic_schema,
  releasedAt: timestamp(),

  changelogId: uuid()
    .references(() => changelog.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  version: varchar({ length: 32 }).notNull(),
  markdown: text().notNull(),
  status: changelog_version_status().default('draft').notNull(),
})

export const changelog_commit = pgTable(
  'changelog_commit',
  {
    ..._basic_schema,

    changelogId: uuid().references(() => changelog.id, {
      onDelete: 'cascade',
    }),
    versionId: uuid().references(() => changelog_version.id, {
      onUpdate: 'set null',
    }),

    commit: varchar({ length: 8 }).notNull(),
    parent: varchar({ length: 8 }),
    subject: text().notNull(),
    author: json().$type<{
      name: string
      email: string
      date: string
    }>(),
    commiter: json().$type<{
      name: string
      email: string
      date: string
    }>(),

    body: text(),
  },
  (table) => ({
    unique: uniqueIndex('unique').on(table.changelogId, table.commit),
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
