"use client";

import { useActionState, useRef, useEffect } from "react";
import { createTrainingAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

export function TrainingForm({ groupAgeId }: { groupAgeId: string }) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(createTrainingAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="card space-y-4">
      <h3 className="font-semibold">{t.coach.scheduleTraining}</h3>
      <input type="hidden" name="groupAgeId" value={groupAgeId} />

      <div>
        <label className="label" htmlFor="title">
          {t.coach.title}
        </label>
        <input id="title" name="title" className="input" placeholder={t.coach.trainingTitlePlaceholder} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="startsAt">
            {t.coach.startsAt}
          </label>
          <input id="startsAt" name="startsAt" type="datetime-local" className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="endsAt">
            {t.coach.endsAt} ({t.common.optional})
          </label>
          <input id="endsAt" name="endsAt" type="datetime-local" className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="location">
          {t.coach.location} ({t.common.optional})
        </label>
        <input id="location" name="location" className="input" placeholder={t.coach.locationPlaceholder} />
      </div>

      <div>
        <label className="label" htmlFor="notes">
          {t.coach.notes} ({t.common.optional})
        </label>
        <textarea id="notes" name="notes" className="input" rows={2} placeholder={t.coach.notesPlaceholder} />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? t.coach.scheduling : t.coach.scheduleNotifyGroup}
      </button>
    </form>
  );
}
