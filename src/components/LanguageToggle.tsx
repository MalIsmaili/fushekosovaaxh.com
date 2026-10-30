"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE, type Locale } from "@/lib/dictionaries";
import { useI18n } from "@/components/I18nProvider";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === locale) return;
    // eslint-disable-next-line react-hooks/immutability -- setting a browser cookie, not mutating React state
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      role="group"
      aria-label={t.language.label}
      aria-busy={pending}
      className={`inline-flex overflow-hidden rounded-full border border-current/20 text-xs font-semibold transition-opacity ${
        pending ? "opacity-60" : ""
      } ${className}`}
    >
      {(["en", "sq"] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={locale === l}
          disabled={pending}
          onClick={() => setLocale(l)}
          className={`min-h-9 min-w-11 px-3 uppercase transition-colors ${
            locale === l ? "bg-brand-600 text-white" : "hover:bg-current/10"
          } ${pending ? "cursor-wait" : ""}`}
        >
          {l === "en" ? "EN" : "SQ"}
        </button>
      ))}
    </div>
  );
}
