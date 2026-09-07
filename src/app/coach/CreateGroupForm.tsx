"use client";

import { useActionState } from "react";
import { createGroupAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

export function CreateGroupForm() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(createGroupAction, {});

  return (
    <form action={formAction} className="card space-y-4">
      <h2 className="font-semibold">{t.coach.newGroup}</h2>
      <div>
        <label className="label" htmlFor="name">
          {t.coach.groupName}
        </label>
        <input id="name" name="name" className="input" placeholder={t.coach.groupNamePlaceholder} required />
      </div>
      <div>
        <label className="label" htmlFor="description">
          {t.coach.description} ({t.common.optional})
        </label>
        <input id="description" name="description" className="input" placeholder={t.coach.descriptionPlaceholder} />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? t.coach.creating : t.coach.createGroup}
      </button>
    </form>
  );
}
