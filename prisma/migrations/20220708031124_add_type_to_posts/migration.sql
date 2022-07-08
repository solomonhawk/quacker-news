-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('STORY', 'DISCUSSION', 'ASK', 'SHOW');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'DISCUSSION';
