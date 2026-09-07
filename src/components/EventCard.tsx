import { formatEventRange } from "@/lib/format";

export function EventCard({
  kind,
  title,
  startsAt,
  endsAt,
  location,
  notes,
}: {
  kind: "training" | "game";
  title: string;
  startsAt: Date;
  endsAt: Date | null;
  location?: string | null;
  notes?: string | null;
}) {
  return (
    <div className="card flex items-start gap-3">
      <span className="mt-0.5 text-xl">{kind === "training" ? "🏃" : "🏆"}</span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-foreground/60">{formatEventRange(startsAt, endsAt)}</p>
        {location && <p className="text-sm text-foreground/60">📍 {location}</p>}
        {notes && <p className="mt-1 text-sm text-foreground/70">{notes}</p>}
      </div>
    </div>
  );
}
