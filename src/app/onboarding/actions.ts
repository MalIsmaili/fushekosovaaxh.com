"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/invite-code";

type ActionState = { error?: string };

export async function completeStudentOnboardingAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in." };

  const groupAgeId = String(formData.get("groupAgeId") ?? "");
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const birthDateRaw = String(formData.get("birthDate") ?? "").trim();

  if (!groupAgeId) return { error: "Please select a group age." };

  const group = await prisma.groupAge.findUnique({ where: { id: groupAgeId } });
  if (!group) return { error: "That group age no longer exists." };

  let inviteCode = generateInviteCode();
  while (await prisma.studentProfile.findUnique({ where: { inviteCode } })) {
    inviteCode = generateInviteCode();
  }

  await prisma.studentProfile.create({
    data: {
      userId: session.user.id,
      groupAgeId,
      phone,
      birthDate: birthDateRaw ? new Date(birthDateRaw) : null,
      inviteCode,
      status: "PENDING",
    },
  });

  redirect("/student");
}

export async function linkChildAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in." };

  const code = String(formData.get("inviteCode") ?? "")
    .trim()
    .toUpperCase();
  if (!code) return { error: "Enter an invite code." };

  const student = await prisma.studentProfile.findUnique({ where: { inviteCode: code } });
  if (!student) return { error: "No player found with that invite code." };

  await prisma.parentChildLink.upsert({
    where: { parentId_studentId: { parentId: session.user.id, studentId: student.userId } },
    create: { parentId: session.user.id, studentId: student.userId },
    update: {},
  });

  redirect("/parent");
}
