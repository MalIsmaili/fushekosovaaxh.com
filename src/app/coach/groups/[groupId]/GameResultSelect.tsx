"use client";

import { useRef } from "react";
import { setGameResultAction } from "./actions";

export function GameResultSelect({
  gameId,
  groupAgeId,
  result,
  labels,
}: {
  gameId: string;
  groupAgeId: string;
  result: "WIN" | "LOSS" | null;
  labels: { notPlayedYet: string; win: string; loss: string };
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={setGameResultAction}>
      <input type="hidden" name="gameId" value={gameId} />
      <input type="hidden" name="groupAgeId" value={groupAgeId} />
      <select
        name="result"
        defaultValue={result ?? ""}
        onChange={() => formRef.current?.requestSubmit()}
        className={
          result === "WIN"
            ? "badge-win cursor-pointer border-0"
            : result === "LOSS"
              ? "badge-loss cursor-pointer border-0"
              : "badge cursor-pointer border-0 bg-surface-muted text-foreground/60"
        }
      >
        <option value="">{labels.notPlayedYet}</option>
        <option value="WIN">{labels.win}</option>
        <option value="LOSS">{labels.loss}</option>
      </select>
    </form>
  );
}
