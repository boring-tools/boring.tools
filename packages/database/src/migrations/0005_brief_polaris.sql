ALTER TABLE "changelog_commit" DROP CONSTRAINT "changelog_commit_versionId_changelog_version_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "changelog_commit" ADD CONSTRAINT "changelog_commit_versionId_changelog_version_id_fk" FOREIGN KEY ("versionId") REFERENCES "public"."changelog_version"("id") ON DELETE no action ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
