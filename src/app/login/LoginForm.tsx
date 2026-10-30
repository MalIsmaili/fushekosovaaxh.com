"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

type RoleValue = "COACH" | "STUDENT" | "PARENT";

const LAST_ROLE_KEY = "lastLoginRole";

export function LoginForm() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(loginAction, {});
  const [role, setRole] = useState<RoleValue>("STUDENT");

  // Most people always log in with the same role, so preselect the one used last time.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAST_ROLE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
      if (saved === "COACH" || saved === "STUDENT" || saved === "PARENT") setRole(saved);
    } catch {
      // Storage can be blocked (private mode); the default role is fine then.
    }
  }, []);

  function rememberRole() {
    try {
      localStorage.setItem(LAST_ROLE_KEY, role);
    } catch {
      // Not critical if it can't be saved.
    }
  }

  const roles = [
    { value: "COACH", emoji: "🧑‍🏫", title: t.common.coach },
    { value: "STUDENT", emoji: "⛹️", title: t.common.player },
    { value: "PARENT", emoji: "👨‍👩‍👧", title: t.common.parent },
  ] as const;

  return (
    <form action={formAction} onSubmit={rememberRole} className="card space-y-4">
      <fieldset>
        <legend className="label">{t.auth.logInAs}</legend>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <label key={r.value} className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="peer sr-only"
                required
              />
              <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface px-2 py-3 text-center text-sm transition-colors peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:text-brand-700 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500">
                <span className="text-xl">{r.emoji}</span>
                {r.title}
              </div>
            </label>
          ))}
        </div>
      </fieldset>

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
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <label className="label" htmlFor="password">
            {t.auth.password}
          </label>
          <Link href="/forgot-password" className="text-sm font-medium text-brand-600 hover:underline">
            {t.authExtra.forgotPassword}
          </Link>
        </div>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? t.auth.loggingIn : t.common.logIn}
      </button>
    </form>
  );
}
