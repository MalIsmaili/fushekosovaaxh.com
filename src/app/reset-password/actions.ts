"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getDictionary } from "@/lib/i18n";
import { verifyResetToken } from "@/lib/password-reset";

type ActionState = { error?: string };

export async function resetPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const t = await getDictionary();
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) return { error: t.errors.passwordTooShort };
  if (password !== confirmPassword) return { error: t.errors.passwordsDontMatch };

  const user = await verifyResetToken(token);
  if (!user) return { error: t.reset.invalidLink };

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(password) } });
  redirect("/login?reset=1");
}
