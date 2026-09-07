import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatEventRange } from "@/lib/format";
import { getAttendanceWindow } from "@/lib/attendance-window";
import { getDictionary } from "@/lib/i18n";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { Avatar } from "@/components/Avatar";
import { approveStudentAction, removeStudentAction, deleteTrainingAction, deleteGameAction } from "./actions";
import { deleteGroupAction } from "@/app/coach/actions";
import { TrainingForm } from "./TrainingForm";
import { GameForm } from "./GameForm";

export default async function GroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  const group = await prisma.groupAge.findUnique({
    where: { id: groupId },
    include: {
      students: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      trainings: { orderBy: { startsAt: "desc" } },
      games: {
        orderBy: { startsAt: "desc" },
        include: { roster: { include: { student: { include: { user: true } } } } },
      },
    },
  });

  if (!group) notFound();

  const dict = await getDictionary();
  const pending = group.students.filter((s) => s.status === "PENDING");
  const approved = group.students.filter((s) => s.status === "APPROVED");
  const players = approved.map((s) => ({ id: s.id, name: s.user.name, email: s.user.email }));

  return (
    <div className="container-page py-10">
      <Link href="/coach" className="text-sm text-foreground/60 hover:text-foreground">
        {dict.coach.allGroups}
      </Link>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{group.name}</h1>
          {group.description && <p className="mt-1 text-foreground/70">{group.description}</p>}
        </div>
        <form action={deleteGroupAction}>
          <input type="hidden" name="id" value={group.id} />
          <ConfirmSubmitButton
            className="btn-secondary"
            confirmMessage={`${dict.coach.deleteGroup}: "${group.name}"?`}
          >
            {dict.coach.deleteGroup}
          </ConfirmSubmitButton>
        </form>
      </div>

      <section id="roster" className="mt-10">
        <h2 className="text-lg font-bold">{dict.coach.roster}</h2>

        {pending.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-warning-700">{dict.coach.pendingApproval}</p>
            {pending.map((s) => (
              <div key={s.id} className="card flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar src={s.user.image} name={s.user.name} email={s.user.email} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.user.name ?? s.user.email}</p>
                    <p className="truncate text-sm text-foreground/60">{s.user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <form action={approveStudentAction}>
                    <input type="hidden" name="studentProfileId" value={s.id} />
                    <input type="hidden" name="groupAgeId" value={group.id} />
                    <button type="submit" className="btn-primary">
                      {dict.common.approve}
                    </button>
                  </form>
                  <form action={removeStudentAction}>
                    <input type="hidden" name="studentProfileId" value={s.id} />
                    <input type="hidden" name="groupAgeId" value={group.id} />
                    <ConfirmSubmitButton confirmMessage={`${dict.common.reject}: ${s.user.name ?? s.user.email}?`}>
                      {dict.common.reject}
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 space-y-2">
          {approved.length === 0 && (
            <p className="text-sm text-foreground/60">{dict.coach.noApproved}</p>
          )}
          {approved.map((s) => (
            <div key={s.id} className="card flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar src={s.user.image} name={s.user.name} email={s.user.email} />
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {s.jerseyNumber != null && <span className="mr-2 text-foreground/50">#{s.jerseyNumber}</span>}
                    {s.user.name ?? s.user.email}
                  </p>
                  <p className="truncate text-sm text-foreground/60">{s.user.email}</p>
                  {(s.position || s.heightCm != null || s.weightKg != null) && (
                    <p className="mt-0.5 text-sm text-foreground/60">
                      {[
                        s.position,
                        s.heightCm != null ? `${s.heightCm} cm` : null,
                        s.weightKg != null ? `${s.weightKg} kg` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>
              <form action={removeStudentAction}>
                <input type="hidden" name="studentProfileId" value={s.id} />
                <input type="hidden" name="groupAgeId" value={group.id} />
                <ConfirmSubmitButton
                  className="btn-secondary"
                  confirmMessage={`${dict.common.remove}: ${s.user.name ?? s.user.email}?`}
                >
                  {dict.common.remove}
                </ConfirmSubmitButton>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section id="trainings" className="mt-12 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-lg font-bold">{dict.coach.trainings}</h2>
          <div className="mt-3 space-y-2">
            {group.trainings.length === 0 && <p className="text-sm text-foreground/60">{dict.coach.noTrainings}</p>}
            {group.trainings.map((t) => {
              const window = getAttendanceWindow(t.startsAt, t.endsAt);
              const attendanceLabel =
                window === "OPEN"
                  ? dict.coach.takeAttendance
                  : window === "CLOSED"
                    ? dict.coach.viewAttendance
                    : dict.coach.attendance;
              return (
                <div key={t.id} className="card flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-sm text-foreground/60">{formatEventRange(t.startsAt, t.endsAt)}</p>
                    {t.location && <p className="text-sm text-foreground/60">📍 {t.location}</p>}
                    {t.notes && <p className="mt-1 text-sm text-foreground/70">{t.notes}</p>}
                    <Link
                      href={`/coach/trainings/${t.id}/attendance`}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
                    >
                      📋 {attendanceLabel}
                      {window === "OPEN" && <span className="badge-approved ml-1">{dict.coach.live}</span>}
                    </Link>
                  </div>
                  <form action={deleteTrainingAction}>
                    <input type="hidden" name="trainingId" value={t.id} />
                    <input type="hidden" name="groupAgeId" value={group.id} />
                    <ConfirmSubmitButton confirmMessage={`${dict.common.delete}?`}>
                      {dict.common.delete}
                    </ConfirmSubmitButton>
                  </form>
                </div>
              );
            })}
          </div>
        </div>
        <TrainingForm groupAgeId={group.id} />
      </section>

      <section id="games" className="mt-12 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-lg font-bold">{dict.coach.games}</h2>
          <div className="mt-3 space-y-2">
            {group.games.length === 0 && <p className="text-sm text-foreground/60">{dict.coach.noGames}</p>}
            {group.games.map((g) => (
              <div key={g.id} className="card flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{dict.coach.vs} {g.opponent}</p>
                  <p className="text-sm text-foreground/60">{formatEventRange(g.startsAt, g.endsAt)}</p>
                  {g.location && <p className="text-sm text-foreground/60">📍 {g.location}</p>}
                  {g.notes && <p className="mt-1 text-sm text-foreground/70">{g.notes}</p>}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {g.roster.map((r) => (
                      <span key={r.id} className="badge-brand">
                        {r.student.user.name ?? r.student.user.email}
                      </span>
                    ))}
                  </div>
                </div>
                <form action={deleteGameAction}>
                  <input type="hidden" name="gameId" value={g.id} />
                  <input type="hidden" name="groupAgeId" value={group.id} />
                  <ConfirmSubmitButton confirmMessage={`${dict.common.delete}?`}>
                    {dict.common.delete}
                  </ConfirmSubmitButton>
                </form>
              </div>
            ))}
          </div>
        </div>
        <GameForm groupAgeId={group.id} players={players} />
      </section>
    </div>
  );
}
