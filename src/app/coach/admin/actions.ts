"use server";

import { revalidatePath } from "next/cache";
import { requireRole, isOwner } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

async function requireOwner() {
  const user = await requireRole("COACH");
  if (!isOwner(user.email)) throw new Error("Not authorized.");
  return user;
}

export async function banUserAction(formData: FormData) {
  await requireOwner();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  await prisma.user.update({ where: { id: userId }, data: { banned: true } });
  revalidatePath("/coach/admin");
}

export async function unbanUserAction(formData: FormData) {
  await requireOwner();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  await prisma.user.update({ where: { id: userId }, data: { banned: false } });
  revalidatePath("/coach/admin");
}

export async function deleteUserAction(formData: FormData) {
  await requireOwner();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/coach/admin");
}
