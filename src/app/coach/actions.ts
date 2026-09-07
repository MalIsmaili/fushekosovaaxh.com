"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

type ActionState = { error?: string };

export async function createGroupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("COACH");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { error: "Group name is required." };

  await prisma.groupAge.create({ data: { name, description } });
  revalidatePath("/coach");
  return {};
}

export async function deleteGroupAction(formData: FormData) {
  await requireRole("COACH");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.groupAge.delete({ where: { id } });
  revalidatePath("/coach");
  redirect("/coach");
}
