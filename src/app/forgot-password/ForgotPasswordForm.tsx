"use client";

import { useActionState } from "react";
import { requestPasswordResetAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

export function ForgotPasswordForm() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, {});

  if (state.sent) {
    return (
      <p role="status" className="card text-sm text-success-600">
        {t.reset.sent}
      </p>
    );
  }

  return (
    <form action={formAction} className="card space-y-4">
      <div>
        <label className="label" htmlFor="email">
          {t.auth.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          placeholder={t.authExtra.emailPlaceholder}
          autoComplete="email"
          inputMode="email"
          required
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? t.reset.sending : t.reset.sendLink}
      </button>
    </form>
  );
}
