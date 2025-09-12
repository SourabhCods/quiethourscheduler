-- AlterTable
ALTER TABLE "public"."SilentBlock" ADD COLUMN     "notification_sent" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'scheduled';
