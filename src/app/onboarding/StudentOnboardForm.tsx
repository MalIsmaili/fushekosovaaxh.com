"use client";

import { useActionState } from "react";
import { completeStudentOnboardingAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

type GroupOption = { id: string; name: string };

export function StudentOnboardForm({ groups }: { groups: GroupOption[] }) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(completeStudentOnboardingAction, {});

  return (
    <form action={formAction} className="card max-w-md space-y-4">
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
      </div>

      <div>
        <label className="label" htmlFor="phone">
          {t.onboarding.phone} ({t.common.optional})
        </label>
        <input id="phone" name="phone" className="input" placeholder="+383 4X XXX XXX" />
      </div>

      <div>
        <label className="label" htmlFor="birthDate">
          {t.onboarding.birthDate} ({t.common.optional})
        </label>
        <input id="birthDate" name="birthDate" type="date" className="input" />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {groups.length === 0 && <p className="text-sm text-warning-700">{t.onboarding.noGroups}</p>}

      <button type="submit" className="btn-primary w-full" disabled={pending || groups.length === 0}>
        {pending ? t.onboarding.joining : t.onboarding.joinGroup}
      </button>
    </form>
  );
}
