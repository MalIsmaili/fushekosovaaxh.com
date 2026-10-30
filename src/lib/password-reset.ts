import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 60 * 60 * 1000;

// The signature covers the current password hash, so a link stops working as
// soon as the password changes — no token table needed, and each link is
// effectively single-use.
function sign(userId: string, expires: number, passwordHash: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return createHmac("sha256", secret).update(`${userId}.${expires}.${passwordHash}`).digest("base64url");
}

export function createResetToken(user: { id: string; passwordHash: string }) {
  const expires = Date.now() + TOKEN_TTL_MS;
  return `${user.id}.${expires}.${sign(user.id, expires, user.passwordHash)}`;
}

/** Returns the user the token was issued for, or null if it's malformed, expired or already used. */
export async function verifyResetToken(token: string) {
  const [userId, expiresRaw, signature] = token.split(".");
  const expires = Number(expiresRaw);
  if (!userId || !signature || !Number.isFinite(expires) || expires < Date.now()) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.banned) return null;

  const expected = Buffer.from(sign(user.id, expires, user.passwordHash));
  const supplied = Buffer.from(signature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  return user;
}
