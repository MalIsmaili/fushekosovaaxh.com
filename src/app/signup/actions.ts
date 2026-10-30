"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { isAllowedCoachEmail } from "@/lib/auth-helpers";
import { generateInviteCode } from "@/lib/invite-code";
import { getDictionary } from "@/lib/i18n";
import type { Role } from "@prisma/client";

type ActionState = { error?: string };

export async function signupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const t = await getDictionary();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const role = String(formData.get("role") ?? "") as Role | "";

  if (!name) return { error: t.errors.nameRequired };
  if (!email || !email.includes("@")) return { error: t.errors.invalidEmail };
  if (password.length < 8) return { error: t.errors.passwordTooShort };
  if (password !== confirmPassword) return { error: t.errors.passwordsDontMatch };
  if (!["COACH", "STUDENT", "PARENT"].includes(role)) return { error: t.errors.chooseRole };
  if (formData.get("consent") !== "yes") return { error: t.errors.consentRequired };
  if (role === "COACH" && !isAllowedCoachEmail(email)) {
    return { error: t.errors.coachNotAllowed };
  }

  let groupAgeId: string | null = null;
  let phone: string | null = null;
  let age: number | null | undefined = null;
  if (role === "STUDENT") {
    groupAgeId = String(formData.get("groupAgeId") ?? "");
    if (!groupAgeId) return { error: t.errors.selectGroup };
    const group = await prisma.groupAge.findUnique({ where: { id: groupAgeId } });
    if (!group) return { error: t.errors.groupGone };

    phone = String(formData.get("phone") ?? "").trim() || null;

    const ageRaw = String(formData.get("age") ?? "").trim();
    if (ageRaw) {
      const n = Number(ageRaw);
      age = Number.isInteger(n) && n >= 3 && n <= 99 ? n : undefined;
      if (age === undefined) return { error: t.errors.ageRange };
    }
  }

  const existing = await prisma.user.findFirst({ where: { email, role: role as Role } });
  if (existing) {
    const roleLabel = { COACH: t.common.coach, STUDENT: t.common.player, PARENT: t.common.parent }[role as Role];
    return { error: t.errors.accountExists.replace("{role}", roleLabel.toLowerCase()) };
  }

  if (role === "STUDENT") {
    let inviteCode = generateInviteCode();
    while (await prisma.studentProfile.findUnique({ where: { inviteCode } })) {
      inviteCode = generateInviteCode();
    }
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        role: "STUDENT",
        studentProfile: {
          create: { groupAgeId, phone, age, inviteCode, status: "PENDING" },
        },
      },
    });
  } else {
    await prisma.user.create({
      data: { name, email, passwordHash: hashPassword(password), role: role as Role },
    });
  }

  const redirectTo = role === "STUDENT" ? "/student" : "/onboarding";

  try {
    await signIn("credentials", { email, password, role, redirectTo });
  } catch (err) {
    if (err instanceof AuthError) return { error: t.errors.signInFailed };
    throw err;
  }
  return {};
}
