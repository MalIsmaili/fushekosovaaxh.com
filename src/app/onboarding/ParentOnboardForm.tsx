"use client";

import { useActionState } from "react";
import { linkChildAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

export function ParentOnboardForm() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(linkChildAction, {});

  return (
    <form action={formAction} className="card max-w-md space-y-4">
      <div>
        <label className="label" htmlFor="inviteCode">
          {t.onboarding.childInviteCode}
        </label>
        <input
          id="inviteCode"
          name="inviteCode"
          className="input uppercase"
          placeholder="e.g. 7K9QXHM"
          autoComplete="off"
          required
        />
        <p className="mt-1.5 text-xs text-foreground/60">{t.onboarding.inviteCodeHint}</p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? t.onboarding.linking : t.onboarding.linkChild}
      </button>
    </form>
  );
}
