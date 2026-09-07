-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- AlterTable
ALTER TABLE "student_profiles" ADD COLUMN "jerseyNumber" INTEGER,
ADD COLUMN "position" TEXT,
ADD COLUMN "heightCm" INTEGER,
ADD COLUMN "weightKg" INTEGER;

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendances_trainingId_studentId_key" ON "attendances"("trainingId", "studentId");

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
