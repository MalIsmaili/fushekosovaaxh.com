import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export const coachEmails = (process.env.COACH_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedCoachEmail(email: string | null | undefined) {
  if (!email) return false;
  return coachEmails.includes(email.toLowerCase());
}

const ownerEmail = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();

export function isOwner(email: string | null | undefined) {
  if (!ownerEmail || !email) return false;
  return email.toLowerCase() === ownerEmail;
}

/** Returns the signed-in user's DB record, or null if not signed in or the
 * account no longer exists (e.g. a stale login cookie after deletion). */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}

export async function requireSession() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.banned) redirect("/banned");
  return user;
}

export async function requireRole(role: Role) {
  const user = await requireSession();
  if (!user.role) redirect("/login");
  if (user.role !== role) redirect("/dashboard");
  return user;
}
