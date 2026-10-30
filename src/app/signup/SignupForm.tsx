"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signupAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

type GroupOption = { id: string; name: string };
type RoleValue = "COACH" | "STUDENT" | "PARENT";

export function SignupForm({
  initialRole,
  groups,
}: {
  initialRole: RoleValue;
  groups: GroupOption[];
}) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(signupAction, {});
  const [role, setRole] = useState<RoleValue>(initialRole);

  const roles = [
    { value: "COACH", emoji: "🧑‍🏫", title: t.common.coach },
    { value: "STUDENT", emoji: "⛹️", title: t.common.player },
    { value: "PARENT", emoji: "👨‍👩‍👧", title: t.common.parent },
  ] as const;

  return (
    <form action={formAction} className="card space-y-4">
      <fieldset>
        <legend className="label">{t.auth.iAmA}</legend>
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
        <label className="label" htmlFor="name">
          {t.auth.name}
        </label>
        <input
          id="name"
          name="name"
          className="input"
          placeholder={t.auth.namePlaceholder}
          autoComplete="name"
          required
        />
      </div>
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
        <label className="label" htmlFor="password">
          {t.auth.password}
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

      {role === "STUDENT" && (
        <div className="space-y-4 rounded-xl border border-border bg-surface-muted p-4">
          <div>
            <label className="label" htmlFor="groupAgeId">
              {t.onboarding.groupAge}
            </label>
            <select id="groupAgeId" name="groupAgeId" className="input" required defaultValue="">
              <option value="" disabled>
                {t.onboarding.selectGroup}
              </option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {groups.length === 0 && <p className="mt-1 text-sm text-warning-700">{t.onboarding.noGroups}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="age">
                {t.auth.age} ({t.common.optional})
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={3}
                max={99}
                className="input"
                placeholder={t.auth.agePlaceholder}
              />
            </div>
            <div>
              <label className="label" htmlFor="phone">
                {t.onboarding.phone} ({t.common.optional})
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                placeholder="+383 4X XXX XXX"
                autoComplete="tel"
              />
            </div>
          </div>
          <p className="text-sm text-foreground/60">{t.authExtra.consentMinorHint}</p>
        </div>
      )}

      <label className="flex items-start gap-2 text-sm text-foreground/80">
        <input type="checkbox" name="consent" value="yes" className="mt-0.5 size-4 accent-brand-600" required />
        <span>
          {t.authExtra.consentPrefix}{" "}
          <Link href="/privacy" target="_blank" className="font-medium text-brand-600 hover:underline">
            {t.authExtra.consentLink}
          </Link>
          .
        </span>
      </label>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={pending || (role === "STUDENT" && groups.length === 0)}
      >
        {pending ? t.auth.creatingAccount : t.common.createAccount}
      </button>
    </form>
  );
}
