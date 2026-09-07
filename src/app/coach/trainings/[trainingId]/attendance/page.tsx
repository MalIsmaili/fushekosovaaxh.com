import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatEventRange } from "@/lib/format";
import { getAttendanceWindow } from "@/lib/attendance-window";
import { getDictionary } from "@/lib/i18n";
import { Avatar } from "@/components/Avatar";
import { markAttendanceAction } from "./actions";

export default async function AttendancePage({ params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  const t = await getDictionary();

  const training = await prisma.training.findUnique({
    where: { id: trainingId },
    include: { groupAge: true },
  });
  if (!training) notFound();

  const [students, attendances] = await Promise.all([
    prisma.studentProfile.findMany({
      where: { groupAgeId: training.groupAgeId, status: "APPROVED" },
      include: { user: { select: { name: true, email: true, image: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.attendance.findMany({ where: { trainingId } }),
  ]);

  const statusByStudent = new Map(attendances.map((a) => [a.studentId, a.status]));
  const window = getAttendanceWindow(training.startsAt, training.endsAt);

  const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
  const absentCount = attendances.filter((a) => a.status === "ABSENT").length;

  return (
    <div className="container-page py-10">
      <Link
        href={`/coach/groups/${training.groupAgeId}`}
        className="text-sm text-foreground/60 hover:text-foreground"
      >
        {t.attendance.backTo} {training.groupAge.name}
      </Link>

      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
        {t.attendance.titlePrefix} {training.title}
      </h1>
      <p className="mt-1 text-foreground/70">{formatEventRange(training.startsAt, training.endsAt)}</p>

      {window === "BEFORE" && (
        <div className="card mt-4 border-warning-700/30 bg-warning-100 text-warning-700">
          {t.attendance.beforeMsg} <strong>{formatEventRange(training.startsAt, training.endsAt)}</strong>.
        </div>
      )}
      {window === "CLOSED" && (
        <div className="card mt-4 text-foreground/70">
          {t.attendance.closedMsg}{" "}
          <strong className="text-success-600">
            {presentCount} {t.attendance.presentLower}
          </strong>
          , <strong>{absentCount} {t.attendance.absentLower}</strong>.
        </div>
      )}
      {window === "OPEN" && (
        <div className="card mt-4 border-success-600/30 bg-success-100 text-success-600">
          {t.attendance.openMsg} {presentCount} {t.attendance.presentLower}, {absentCount}{" "}
          {t.attendance.absentLower} {t.attendance.soFar}
          {!training.endsAt && t.attendance.noEndHint}
        </div>
      )}

      <div className="mt-6 space-y-2">
        {students.length === 0 && (
          <p className="text-sm text-foreground/60">{t.attendance.noApproved}</p>
        )}
        {students.map((s) => {
          const current = statusByStudent.get(s.id);
          return (
            <div key={s.id} className="card flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar src={s.user.image} name={s.user.name} email={s.user.email} />
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {s.jerseyNumber != null && (
                      <span className="mr-2 text-foreground/50">#{s.jerseyNumber}</span>
                    )}
                    {s.user.name ?? s.user.email}
                  </p>
                  {current && (
                    <p className="text-sm text-foreground/60">
                      {t.attendance.marked}{" "}
                      <span className={current === "PRESENT" ? "text-success-600" : "text-red-600"}>
                        {current === "PRESENT" ? t.attendance.presentLower : t.attendance.absentLower}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {window === "OPEN" ? (
                <div className="flex gap-2">
                  <form action={markAttendanceAction}>
                    <input type="hidden" name="trainingId" value={training.id} />
                    <input type="hidden" name="studentId" value={s.id} />
                    <input type="hidden" name="status" value="PRESENT" />
                    <button
                      type="submit"
                      className={current === "PRESENT" ? "btn-primary" : "btn-secondary"}
                    >
                      {t.attendance.present}
                    </button>
                  </form>
                  <form action={markAttendanceAction}>
                    <input type="hidden" name="trainingId" value={training.id} />
                    <input type="hidden" name="studentId" value={s.id} />
                    <input type="hidden" name="status" value="ABSENT" />
                    <button
                      type="submit"
                      className={current === "ABSENT" ? "btn-danger" : "btn-secondary"}
                    >
                      {t.attendance.absent}
                    </button>
                  </form>
                </div>
              ) : (
                <span
                  className={
                    current === "PRESENT"
                      ? "badge-approved"
                      : current === "ABSENT"
                        ? "badge bg-red-100 text-red-600"
                        : "badge bg-surface-muted text-foreground/50"
                  }
                >
                  {current
                    ? current === "PRESENT"
                      ? t.attendance.presentLower
                      : t.attendance.absentLower
                    : t.attendance.notMarked}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
