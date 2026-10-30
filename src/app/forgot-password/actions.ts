"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { getDictionary } from "@/lib/i18n";
import { createResetToken } from "@/lib/password-reset";
import { appUrl } from "@/lib/site";

type ActionState = { error?: string; sent?: boolean };

export async function requestPasswordResetAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const t = await getDictionary();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email || !email.includes("@")) return { error: t.errors.invalidEmail };

  // One email can hold an account per role, so send a link for each of them.
  const users = await prisma.user.findMany({ where: { email, banned: false } });
  if (users.length > 0) {
    const roleLabels: Record<string, string> = {
      COACH: t.common.coach,
      STUDENT: t.common.player,
      PARENT: t.common.parent,
    };
    const links = users.map((user) => {
      const url = `${appUrl()}/reset-password?token=${encodeURIComponent(createResetToken(user))}`;
      return users.length > 1 ? `${t.reset.emailAccount}: ${roleLabels[user.role ?? ""] ?? "—"}\n${url}` : url;
    });
    await sendEmail(email, t.reset.emailSubject, `${t.reset.emailIntro}\n\n${links.join("\n\n")}\n\n${t.reset.emailOutro}`);
  }

  // Same answer whether or not the email exists, so the form can't be used to discover accounts.
  return { sent: true };
}
