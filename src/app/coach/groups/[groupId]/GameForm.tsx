"use client";

import { useActionState, useRef, useEffect } from "react";
import { createGameAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";

type Player = { id: string; name: string | null; email: string };

export function GameForm({ groupAgeId, players }: { groupAgeId: string; players: Player[] }) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(createGameAction, {});
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
      <h3 className="font-semibold">{t.coach.scheduleGame}</h3>
      <input type="hidden" name="groupAgeId" value={groupAgeId} />

      <div>
        <label className="label" htmlFor="opponent">
          {t.coach.opponent}
        </label>
        <input id="opponent" name="opponent" className="input" placeholder={t.coach.opponentPlaceholder} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="game-startsAt">
            {t.coach.startsAt}
          </label>
          <input id="game-startsAt" name="startsAt" type="datetime-local" className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="game-endsAt">
            {t.coach.endsAt} ({t.common.optional})
          </label>
          <input id="game-endsAt" name="endsAt" type="datetime-local" className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="game-location">
          {t.coach.location} ({t.common.optional})
        </label>
        <input id="game-location" name="location" className="input" placeholder={t.coach.gameLocationPlaceholder} />
      </div>

      <div>
        <label className="label" htmlFor="game-notes">
          {t.coach.notes} ({t.common.optional})
        </label>
        <textarea id="game-notes" name="notes" className="input" rows={2} placeholder={t.coach.gameNotesPlaceholder} />
      </div>

      <div>
        <label className="label" htmlFor="game-result">
          {t.coach.result} ({t.common.optional})
        </label>
        <select id="game-result" name="result" className="input" defaultValue="">
          <option value="">{t.coach.resultNotPlayedYet}</option>
          <option value="WIN">{t.coach.win}</option>
          <option value="LOSS">{t.coach.loss}</option>
        </select>
      </div>

      <div>
        <span className="label">{t.coach.playersCalledUp}</span>
        {players.length === 0 ? (
          <p className="text-sm text-foreground/60">{t.coach.noActivePlayers}</p>
        ) : (
          <div className="grid max-h-48 gap-2 overflow-y-auto rounded-xl border border-border p-3 sm:grid-cols-2">
            {players.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="studentIds" value={p.id} className="h-4 w-4 accent-brand-600" />
                {p.name ?? p.email}
              </label>
            ))}
          </div>
        )}
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={pending || players.length === 0}>
        {pending ? t.coach.scheduling : t.coach.scheduleNotifyPlayers}
      </button>
    </form>
  );
}
