import { format } from "date-fns";

export function formatEventRange(startsAt: Date, endsAt: Date | null): string {
  const day = format(startsAt, "EEE, MMM d yyyy");
  const start = format(startsAt, "HH:mm");
  if (!endsAt) return `${day} · ${start}`;
  return `${day} · ${start}–${format(endsAt, "HH:mm")}`;
}
