"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { isAllowedCoachEmail } from "@/lib/auth-helpers";
import { generateInviteCode } from "@/lib/invite-code";
import type { Role } from "@prisma/client";

type ActionState = { error?: string };

export async function signupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const role = String(formData.get("role") ?? "") as Role | "";

  if (!name) return { error: "Name is required." };
  if (!email || !email.includes("@")) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { error: "Passwords don't match." };
  if (!["COACH", "STUDENT", "PARENT"].includes(role)) return { error: "Please choose who you are." };
  if (role === "COACH" && !isAllowedCoachEmail(email)) {
    return { error: "This email isn't authorized to register as coach." };
  }

  let groupAgeId: string | null = null;
  let phone: string | null = null;
  let age: number | null | undefined = null;
  if (role === "STUDENT") {
    groupAgeId = String(formData.get("groupAgeId") ?? "");
    if (!groupAgeId) return { error: "Please select a group to join." };
    const group = await prisma.groupAge.findUnique({ where: { id: groupAgeId } });
    if (!group) return { error: "That group no longer exists." };

    phone = String(formData.get("phone") ?? "").trim() || null;

    const ageRaw = String(formData.get("age") ?? "").trim();
    if (ageRaw) {
      const n = Number(ageRaw);
      age = Number.isInteger(n) && n >= 3 && n <= 99 ? n : undefined;
      if (age === undefined) return { error: "Age must be between 3 and 99." };
    }
  }

  const existing = await prisma.user.findFirst({ where: { email, role: role as Role } });
  if (existing) return { error: "You already have a " + role.toLowerCase() + " account with that email." };

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
    if (err instanceof AuthError) return { error: "Account created, but sign-in failed. Please log in." };
    throw err;
  }
  return {};
}
