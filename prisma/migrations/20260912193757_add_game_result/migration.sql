-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WIN', 'LOSS');

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "result" "GameResult";
