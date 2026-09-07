"use client";

import { useActionState } from "react";
import { linkChildAction } from "@/app/onboarding/actions";
import { useI18n } from "@/components/I18nProvider";

export function AddChildForm() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(linkChildAction, {});

  return (
    <form action={formAction} className="card space-y-3">
      <h3 className="font-semibold">{t.parent.linkAnother}</h3>
      <input
        name="inviteCode"
        className="input uppercase"
        placeholder={t.parent.inviteCodePlaceholder}
        autoComplete="off"
        required
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? t.parent.linking : t.parent.linkChild}
      </button>
    </form>
  );
}
