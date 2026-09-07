"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getAttendanceWindow } from "@/lib/attendance-window";
import { notifyAttendanceMarked } from "@/lib/notify";
import type { AttendanceStatus } from "@prisma/client";

export async function markAttendanceAction(formData: FormData) {
  await requireRole("COACH");

  const trainingId = String(formData.get("trainingId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  const status = String(formData.get("status") ?? "") as AttendanceStatus;
  if (!trainingId || !studentId || !["PRESENT", "ABSENT"].includes(status)) return;

  const training = await prisma.training.findUnique({ where: { id: trainingId } });
  if (!training) return;

  // Enforce the time window on the server — the coach can only mark attendance
  // while the training is actually happening, never before or after.
  const window = getAttendanceWindow(training.startsAt, training.endsAt);
  if (window !== "OPEN") return;

  const existing = await prisma.attendance.findUnique({
    where: { trainingId_studentId: { trainingId, studentId } },
  });

  await prisma.attendance.upsert({
    where: { trainingId_studentId: { trainingId, studentId } },
    create: { trainingId, studentId, status },
    update: { status },
  });

  // Only email the parents when the status actually changes, so re-clicking the
  // same button doesn't send duplicate notifications.
  if (!existing || existing.status !== status) {
    await notifyAttendanceMarked(trainingId, studentId, status);
  }

  revalidatePath(`/coach/trainings/${trainingId}/attendance`);
}
