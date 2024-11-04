CREATE TYPE "public"."status" AS ENUM('draft', 'review', 'published');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "access_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	"userId" uuid,
	"token" text NOT NULL,
	"name" text NOT NULL,
	"lastUsedOn" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "changelog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	"userId" uuid,
	"pageId" uuid,
	"title" varchar(256),
	"description" text,
	"isSemver" boolean DEFAULT true,
	"isConventional" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "changelog_commit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	"changelogId" uuid,
	"versionId" uuid,
	"commit" varchar(8) NOT NULL,
	"parent" varchar(8),
	"subject" text NOT NULL,
	"author" json,
	"commiter" json,
	"body" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "changelog_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	"releasedAt" timestamp,
	"changelogId" uuid NOT NULL,
	"version" varchar(32) NOT NULL,
	"markdown" text NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "changelogs_to_pages" (
	"changelogId" uuid NOT NULL,
	"pageId" uuid NOT NULL,
	CONSTRAINT "changelogs_to_pages_changelogId_pageId_pk" PRIMARY KEY("changelogId","pageId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	"userId" uuid,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	"providerId" varchar(32) NOT NULL,
	"name" text,
	"email" text NOT NULL,
	CONSTRAINT "user_providerId_unique" UNIQUE("providerId"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
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
 ALTER TABLE "changelog" ADD CONSTRAINT "changelog_pageId_page_id_fk" FOREIGN KEY ("pageId") REFERENCES "public"."page"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "changelog_commit" ADD CONSTRAINT "changelog_commit_versionId_changelog_version_id_fk" FOREIGN KEY ("versionId") REFERENCES "public"."changelog_version"("id") ON DELETE no action ON UPDATE set null;
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
DO $$ BEGIN
 ALTER TABLE "changelogs_to_pages" ADD CONSTRAINT "changelogs_to_pages_changelogId_changelog_id_fk" FOREIGN KEY ("changelogId") REFERENCES "public"."changelog"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "changelogs_to_pages" ADD CONSTRAINT "changelogs_to_pages_pageId_page_id_fk" FOREIGN KEY ("pageId") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "page" ADD CONSTRAINT "page_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique" ON "changelog_commit" USING btree ("changelogId","commit");