"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { notifyTrainingCreated, notifyGameCreated } from "@/lib/notify";

type ActionState = { error?: string };

export async function approveStudentAction(formData: FormData) {
  await requireRole("COACH");
  const studentProfileId = String(formData.get("studentProfileId") ?? "");
  const groupAgeId = String(formData.get("groupAgeId") ?? "");
  if (!studentProfileId) return;

  await prisma.studentProfile.update({ where: { id: studentProfileId }, data: { status: "APPROVED" } });
  revalidatePath(`/coach/groups/${groupAgeId}`);
}

export async function removeStudentAction(formData: FormData) {
  await requireRole("COACH");
  const studentProfileId = String(formData.get("studentProfileId") ?? "");
  const groupAgeId = String(formData.get("groupAgeId") ?? "");
  if (!studentProfileId) return;

  await prisma.studentProfile.delete({ where: { id: studentProfileId } });
  revalidatePath(`/coach/groups/${groupAgeId}`);
}

export async function createTrainingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("COACH");

  const groupAgeId = String(formData.get("groupAgeId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const startsAtRaw = String(formData.get("startsAt") ?? "");
  const endsAtRaw = String(formData.get("endsAt") ?? "");

  if (!title) return { error: "Title is required." };
  if (!startsAtRaw) return { error: "Start date/time is required." };

  const startsAt = new Date(startsAtRaw);
  const endsAt = endsAtRaw ? new Date(endsAtRaw) : null;
  if (Number.isNaN(startsAt.getTime())) return { error: "Invalid start date/time." };
  if (endsAt && Number.isNaN(endsAt.getTime())) return { error: "Invalid end date/time." };
  if (endsAt && endsAt < startsAt) return { error: "End time must be after the start time." };

  const training = await prisma.training.create({
    data: { groupAgeId, title, location, notes, startsAt, endsAt },
  });

  await notifyTrainingCreated(training.id);
  revalidatePath(`/coach/groups/${groupAgeId}`);
  return {};
}

export async function deleteTrainingAction(formData: FormData) {
  await requireRole("COACH");
  const trainingId = String(formData.get("trainingId") ?? "");
  const groupAgeId = String(formData.get("groupAgeId") ?? "");
  if (!trainingId) return;

  await prisma.training.delete({ where: { id: trainingId } });
  revalidatePath(`/coach/groups/${groupAgeId}`);
}

export async function createGameAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("COACH");

  const groupAgeId = String(formData.get("groupAgeId") ?? "");
  const opponent = String(formData.get("opponent") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const startsAtRaw = String(formData.get("startsAt") ?? "");
  const endsAtRaw = String(formData.get("endsAt") ?? "");
  const studentIds = formData.getAll("studentIds").map(String);

  if (!opponent) return { error: "Opponent is required." };
  if (!startsAtRaw) return { error: "Start date/time is required." };
  if (studentIds.length === 0) return { error: "Select at least one player." };

  const startsAt = new Date(startsAtRaw);
  const endsAt = endsAtRaw ? new Date(endsAtRaw) : null;
  if (Number.isNaN(startsAt.getTime())) return { error: "Invalid start date/time." };
  if (endsAt && Number.isNaN(endsAt.getTime())) return { error: "Invalid end date/time." };
  if (endsAt && endsAt < startsAt) return { error: "End time must be after the start time." };

  const game = await prisma.game.create({
    data: {
      groupAgeId,
      opponent,
      location,
      notes,
      startsAt,
      endsAt,
      roster: { create: studentIds.map((studentId) => ({ studentId })) },
    },
  });

  await notifyGameCreated(game.id);
  revalidatePath(`/coach/groups/${groupAgeId}`);
  return {};
}

export async function deleteGameAction(formData: FormData) {
  await requireRole("COACH");
  const gameId = String(formData.get("gameId") ?? "");
  const groupAgeId = String(formData.get("groupAgeId") ?? "");
  if (!gameId) return;

  await prisma.game.delete({ where: { id: gameId } });
  revalidatePath(`/coach/groups/${groupAgeId}`);
}
