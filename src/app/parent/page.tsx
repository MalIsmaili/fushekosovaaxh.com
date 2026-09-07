import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { EventCard } from "@/components/EventCard";
import { Avatar } from "@/components/Avatar";
import { AddChildForm } from "./AddChildForm";

export default async function ParentDashboard() {
  const parent = await requireRole("PARENT");
  const dict = await getDictionary();
  const parentId = parent.id;

  const links = await prisma.parentChildLink.findMany({
    where: { parentId },
    include: {
      student: {
        include: { studentProfile: { include: { groupAge: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const children = await Promise.all(
    links.map(async (link) => {
      const profile = link.student.studentProfile;
      if (!profile || !profile.groupAgeId) {
        return { user: link.student, profile, trainings: [], games: [] as { id: string; opponent: string; startsAt: Date; endsAt: Date | null; location: string | null; notes: string | null }[] };
      }

      const [trainings, gameRosterEntries] = await Promise.all([
        prisma.training.findMany({
          where: { groupAgeId: profile.groupAgeId },
          orderBy: { startsAt: "asc" },
        }),
        prisma.gameRoster.findMany({
          where: { studentId: profile.id },
          include: { game: true },
          orderBy: { game: { startsAt: "asc" } },
        }),
      ]);

      return { user: link.student, profile, trainings, games: gameRosterEntries.map((r) => r.game) };
    }),
  );

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-extrabold tracking-tight">{dict.parent.yourChildren}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          {children.length === 0 && (
            <p className="text-sm text-foreground/60">{dict.parent.noChildren}</p>
          )}
          {children.map(({ user, profile, trainings, games }) => (
            <div key={user.id}>
              <div className="flex items-center gap-3">
                <Avatar src={user.image} name={user.name} email={user.email} />
                <h2 className="text-lg font-bold">{user.name ?? user.email}</h2>
                {profile?.status === "PENDING" && <span className="badge-pending">{dict.parent.pendingApproval}</span>}
                {profile?.groupAge && <span className="badge-brand">{profile.groupAge.name}</span>}
              </div>

              <div className="mt-3 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground/70">{dict.parent.trainings}</p>
                  <div className="mt-2 space-y-2">
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
                  <p className="text-sm font-semibold text-foreground/70">{dict.parent.games}</p>
                  <div className="mt-2 space-y-2">
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
              </div>
            </div>
          ))}
        </div>

        <AddChildForm />
      </div>
    </div>
  );
}
