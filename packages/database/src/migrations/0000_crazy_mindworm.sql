DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('draft', 'review', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "access_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(32),
	"token" text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastUsedOn" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "changelog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"userId" varchar(32),
	"title" varchar(256),
	"description" text,
	"isSemver" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "changelog_commit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp,
	"changelogId" uuid,
	"versionId" uuid,
	"shortHash" varchar(8) NOT NULL,
	"author" json,
	"body" text,
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "changelog_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"releasedAt" timestamp,
	"changelogId" uuid NOT NULL,
	"version" varchar(32) NOT NULL,
	"markdown" text NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"shortHash" varchar(8) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "access_token" ADD CONSTRAINT "access_token_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "changelog" ADD CONSTRAINT "changelog_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "changelog_commit" ADD CONSTRAINT "changelog_commit_changelogId_changelog_id_fk" FOREIGN KEY ("changelogId") REFERENCES "public"."changelog"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "changelog_commit" ADD CONSTRAINT "changelog_commit_versionId_changelog_version_id_fk" FOREIGN KEY ("versionId") REFERENCES "public"."changelog_version"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "changelog_version" ADD CONSTRAINT "changelog_version_changelogId_changelog_id_fk" FOREIGN KEY ("changelogId") REFERENCES "public"."changelog"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique" ON "changelog_commit" USING btree ("changelogId","shortHash");