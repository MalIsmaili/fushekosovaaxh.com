"use client";

import { useActionState } from "react";
import { requestGroupChangeAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

type GroupOption = { id: string; name: string };

export function ChangeGroupForm({ groups }: { groups: GroupOption[] }) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(requestGroupChangeAction, {});

  return (
    <form action={formAction} className="card h-fit space-y-3">
      <div>
        <h3 className="font-semibold">{t.student.changeGroupTitle}</h3>
        <p className="mt-1 text-sm text-foreground/60">{t.student.changeGroupHint}</p>
      </div>

      <select name="groupAgeId" className="input" required defaultValue="">
        <option value="" disabled>
          {t.student.selectNewGroup}
        </option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.sent && <p className="text-sm text-success-600">{t.student.changeGroupSent}</p>}

      <button type="submit" className="btn-secondary w-full" disabled={pending || groups.length === 0}>
        {pending ? t.student.requestingChange : t.student.requestToJoin}
      </button>
    </form>
  );
}
