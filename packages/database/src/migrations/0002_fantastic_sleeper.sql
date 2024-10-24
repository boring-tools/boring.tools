CREATE TABLE IF NOT EXISTS "changelogs_to_pages" (
	"changelogId" uuid NOT NULL,
	"pageId" uuid NOT NULL,
	CONSTRAINT "changelogs_to_pages_changelogId_pageId_pk" PRIMARY KEY("changelogId","pageId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(32),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text DEFAULT ''
);
--> statement-breakpoint
ALTER TABLE "changelog" ADD COLUMN "pageId" uuid;--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "changelog" ADD CONSTRAINT "changelog_pageId_page_id_fk" FOREIGN KEY ("pageId") REFERENCES "public"."page"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
