import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { EventCard } from "@/components/EventCard";
import { Avatar } from "@/components/Avatar";

export default async function StudentDashboard() {
  const user = await requireRole("STUDENT");
  const dict = await getDictionary();
  const userId = user.id;

  const profile = await prisma.studentProfile.findUniqueOrThrow({
    where: { userId },
    include: { groupAge: true },
  });

  const now = new Date();

  const [allTrainings, gameRosterEntries] = profile.groupAgeId
    ? await Promise.all([
        prisma.training.findMany({
          where: { groupAgeId: profile.groupAgeId },
          orderBy: { startsAt: "asc" },
        }),
        prisma.gameRoster.findMany({
          where: { studentId: profile.id },
          include: { game: true },
          orderBy: { game: { startsAt: "asc" } },
        }),
      ])
    : [[], []];

  const allGames = gameRosterEntries.map((r) => r.game);

  const trainings = allTrainings.filter((t) => t.startsAt >= now);
  const pastTrainings = allTrainings.filter((t) => t.startsAt < now).reverse();
  const games = allGames.filter((g) => g.startsAt >= now);
  const pastGames = allGames.filter((g) => g.startsAt < now).reverse();

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={user.image} name={user.name} email={user.email} size="md" />
          <h1 className="truncate text-2xl font-extrabold tracking-tight">
            {profile.groupAge ? `${dict.student.hey}, ${profile.groupAge.name}` : dict.student.heyThere}
          </h1>
        </div>
        <Link href="/student/profile" className="btn-secondary">
          {dict.student.editProfile}
        </Link>
      </div>

      {profile.status === "PENDING" && (
        <div className="card mt-4 border-warning-700/30 bg-warning-100 text-warning-700">
          {dict.student.pendingBanner1} <strong>{profile.groupAge?.name}</strong>. {dict.student.pendingBanner2}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold">{dict.student.upcomingTrainings}</h2>
            <div className="mt-3 space-y-2">
              {trainings.length === 0 && <p className="text-sm text-foreground/60">{dict.common.nothingScheduled}</p>}
              {trainings.map((t) => (
                <EventCard
                  key={t.id}
                  kind="training"
                  title={t.title}
                  startsAt={t.startsAt}
                  endsAt={t.endsAt}
                  location={t.location}
                  notes={t.notes}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold">{dict.student.upcomingGames}</h2>
            <div className="mt-3 space-y-2">
              {games.length === 0 && <p className="text-sm text-foreground/60">{dict.common.nothingScheduled}</p>}
              {games.map((g) => (
                <EventCard
                  key={g.id}
                  kind="game"
                  title={`${dict.coach.vs} ${g.opponent}`}
                  startsAt={g.startsAt}
                  endsAt={g.endsAt}
                  location={g.location}
                  notes={g.notes}
                />
              ))}
            </div>
          </div>

          {(pastTrainings.length > 0 || pastGames.length > 0) && (
            <div>
              <h2 className="text-lg font-bold text-foreground/60">{dict.student.past}</h2>
              <div className="mt-3 space-y-2 opacity-70">
                {pastTrainings.map((t) => (
                  <EventCard
                    key={t.id}
                    kind="training"
                    title={t.title}
                    startsAt={t.startsAt}
                    endsAt={t.endsAt}
                    location={t.location}
                    notes={t.notes}
                  />
                ))}
                {pastGames.map((g) => (
                  <EventCard
                    key={g.id}
                    kind="game"
                    title={`${dict.coach.vs} ${g.opponent}`}
                    startsAt={g.startsAt}
                    endsAt={g.endsAt}
                    location={g.location}
                    notes={g.notes}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card h-fit">
          <h3 className="font-semibold">{dict.student.yourInviteCode}</h3>
          <p className="mt-1 text-sm text-foreground/60">{dict.student.inviteCodeShare}</p>
          <p className="mt-3 rounded-xl bg-surface-muted px-4 py-3 text-center text-2xl font-bold tracking-[0.3em]">
            {profile.inviteCode}
          </p>
        </div>
      </div>
    </div>
  );
}
