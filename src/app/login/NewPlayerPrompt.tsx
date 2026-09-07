"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export function NewPlayerPrompt() {
  const { t } = useI18n();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="card mb-4 flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold">{t.auth.newPlayerQuestion}</p>
        <p className="text-sm text-foreground/60">{t.auth.newPlayerHint}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Link href="/signup?role=STUDENT" className="btn-primary">
          {t.common.yes}
        </Link>
        <button type="button" className="btn-ghost" onClick={() => setDismissed(true)}>
          {t.common.no}
        </button>
      </div>
    </div>
  );
}
