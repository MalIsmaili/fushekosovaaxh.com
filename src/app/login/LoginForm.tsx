"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

export function LoginForm() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(loginAction, {});

  const roles = [
    { value: "COACH", emoji: "🧑‍🏫", title: t.common.coach },
    { value: "STUDENT", emoji: "⛹️", title: t.common.player },
    { value: "PARENT", emoji: "👨‍👩‍👧", title: t.common.parent },
  ] as const;

  return (
    <form action={formAction} className="card space-y-4">
      <div>
        <span className="label">{t.auth.logInAs}</span>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((r, i) => (
            <label key={r.value} className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={r.value}
                defaultChecked={i === 0}
                className="peer sr-only"
                required
              />
              <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface px-2 py-3 text-center text-sm transition-colors peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:text-brand-700">
                <span className="text-xl">{r.emoji}</span>
                {r.title}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="email">
          {t.auth.email}
        </label>
        <input id="email" name="email" type="email" className="input" placeholder="you@example.com" required />
      </div>
      <div>
        <label className="label" htmlFor="password">
          {t.auth.password}
        </label>
        <input id="password" name="password" type="password" className="input" required />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? t.auth.loggingIn : t.common.logIn}
      </button>
    </form>
  );
}
