"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getDictionary } from "@/lib/i18n";

type ActionState = { error?: string };

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const t = await getDictionary();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!email || !password) return { error: t.errors.enterEmailPassword };

  try {
    await signIn("credentials", { email, password, role, redirectTo: "/dashboard" });
  } catch (err) {
    if (err instanceof AuthError) return { error: t.errors.invalidCredentials };
    throw err;
  }
  return {};
}
