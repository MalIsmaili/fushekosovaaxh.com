"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

export function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(resetPasswordAction, {});

  return (
    <form action={formAction} className="card space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="label" htmlFor="password">
          {t.reset.newPassword}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          minLength={8}
          autoComplete="new-password"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="confirmPassword">
          {t.auth.confirmPassword}
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="input"
          minLength={8}
          autoComplete="new-password"
          required
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? t.reset.saving : t.reset.savePassword}
      </button>
    </form>
  );
}
