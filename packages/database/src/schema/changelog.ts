import { relations } from 'drizzle-orm'
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { json } from 'drizzle-orm/pg-core'
import { uniqueIndex } from 'drizzle-orm/pg-core'
import { user } from './user'

export const changelog = pgTable('changelog', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt'),

  userId: text('userId').references(() => user.id, {
    onDelete: 'cascade',
  }),

  title: varchar('title', { length: 256 }),
  description: text('description'),
  isSemver: boolean('isSemver').default(true),
})

export const changelog_relation = relations(changelog, ({ many }) => ({
  versions: many(changelog_version),
  commits: many(changelog_commit),
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
  shortHash: varchar('shortHash', { length: 8 }).notNull(),
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
