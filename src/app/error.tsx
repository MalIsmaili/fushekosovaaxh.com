"use client";

import { useI18n } from "@/components/I18nProvider";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();

  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <p className="text-5xl">🚨</p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{t.errorPage.title}</h1>
        <p className="mt-2 max-w-md text-foreground/70">{t.errorPage.body}</p>
        <button type="button" className="btn-primary mt-6" onClick={reset}>
          {t.errorPage.tryAgain}
        </button>
      </div>
    </main>
  );
}
