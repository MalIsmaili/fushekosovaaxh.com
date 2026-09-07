"use client";

import { signOut } from "next-auth/react";
import { useI18n } from "@/components/I18nProvider";

export function SignOutButton({ className = "btn-ghost" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <button type="button" className={className} onClick={() => signOut({ callbackUrl: "/" })}>
      {t.common.signOut}
    </button>
  );
}
