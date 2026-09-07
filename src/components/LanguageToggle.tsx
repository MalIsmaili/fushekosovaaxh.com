"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE, type Locale } from "@/lib/dictionaries";
import { useI18n } from "@/components/I18nProvider";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    // eslint-disable-next-line react-hooks/immutability -- setting a browser cookie, not mutating React state
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className={`inline-flex overflow-hidden rounded-full border border-current/20 text-xs font-semibold ${className}`}>
      {(["en", "sq"] as const).map((l) => (
        <button
          key={l}
          type="button"
          disabled={pending}
          onClick={() => setLocale(l)}
          className={`px-2.5 py-1 uppercase transition-colors ${
            locale === l ? "bg-brand-600 text-white" : "hover:bg-current/10"
          }`}
        >
          {l === "en" ? "EN" : "SQ"}
        </button>
      ))}
    </div>
  );
}
