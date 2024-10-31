ALTER TABLE "changelog_commit" RENAME COLUMN "shortHash" TO "commit";--> statement-breakpoint
ALTER TABLE "changelog_commit" RENAME COLUMN "message" TO "parent";--> statement-breakpoint
DROP INDEX IF EXISTS "unique";--> statement-breakpoint
ALTER TABLE "changelog_commit" ALTER COLUMN "parent" SET DATA TYPE varchar(8);--> statement-breakpoint
ALTER TABLE "changelog_commit" ALTER COLUMN "parent" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "changelog_commit" ADD COLUMN "subject" text NOT NULL;--> statement-breakpoint
ALTER TABLE "changelog_commit" ADD COLUMN "comitter" json;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique" ON "changelog_commit" USING btree ("changelogId","commit");