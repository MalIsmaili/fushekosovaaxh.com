"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

type ActionState = { error?: string; sent?: boolean };

export async function requestGroupChangeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole("STUDENT");

  const groupAgeId = String(formData.get("groupAgeId") ?? "");
  if (!groupAgeId) return { error: "Please select a group." };

  const group = await prisma.groupAge.findUnique({ where: { id: groupAgeId } });
  if (!group) return { error: "That group no longer exists." };

  await prisma.studentProfile.update({
    where: { userId: user.id },
    data: { groupAgeId, status: "PENDING" },
  });

  revalidatePath("/student");
  return { sent: true };
}
