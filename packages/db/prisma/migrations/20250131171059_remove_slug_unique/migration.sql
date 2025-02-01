-- DropIndex
DROP INDEX "Room_slug_key";

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "slug" SET DATA TYPE TEXT;
