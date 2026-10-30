import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "@/components/SiteFooter";

// Static class names so Tailwind picks them up; indexed by how many stat tiles are shown.
const statColumns = ["", "sm:grid-cols-1", "sm:grid-cols-2", "sm:grid-cols-3", "sm:grid-cols-4"];

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const t = await getDictionary();

  const [totalTrainings, totalGames, totalPlayers, wins, losses] = await Promise.all([
    prisma.training.count(),
    prisma.game.count(),
    prisma.studentProfile.count({ where: { status: "APPROVED" } }),
    prisma.game.count({ where: { result: "WIN" } }),
    prisma.game.count({ where: { result: "LOSS" } }),
  ]);

  // A row of zeros makes the club look inactive, so only show stats that have something to say.
  const stats = [
    totalTrainings > 0 && <StatTile key="trainings" emoji="🏋️" value={totalTrainings} label={t.landing.statsTrainings} />,
    totalGames > 0 && <StatTile key="games" emoji="🏀" value={totalGames} label={t.landing.statsGames} />,
    totalPlayers > 0 && <StatTile key="players" emoji="👥" value={totalPlayers} label={t.landing.statsPlayers} />,
    wins + losses > 0 && (
      <StatTile
        key="record"
        emoji="🏆"
        label={t.landing.statsRecord}
        value={
          <>
            <span className="text-success-600">{wins}</span>
            <span className="text-foreground/40">–</span>
            <span className="text-red-700">{losses}</span>
          </>
        }
      />
    ),
  ].filter(Boolean);

  return (
    <>
      <header className="container-page flex h-16 items-center justify-between">
        <span className="flex items-center gap-2 font-extrabold tracking-tight">
          <Logo />
          FushëkosovaBB
        </span>
        <LanguageToggle />
      </header>
      <main className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center">
          <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="badge-brand mb-5">{t.landing.badge}</span>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t.landing.title}</h1>
              <p className="mt-4 max-w-md text-lg text-foreground/70">{t.landing.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="btn-primary">
                  {t.common.createAccount}
                </Link>
                <Link href="/login" className="btn-secondary">
                  {t.common.logIn}
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <FeatureCard emoji="🧑‍🏫" title={t.common.coach} body={t.landing.coachBody} />
              <FeatureCard emoji="⛹️" title={t.common.player} body={t.landing.playerBody} />
              <FeatureCard emoji="👨‍👩‍👧" title={t.common.parent} body={t.landing.parentBody} />
            </div>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="border-t border-border bg-surface-muted/60">
            <div className={`container-page grid grid-cols-2 gap-4 py-10 ${statColumns[stats.length]}`}>{stats}</div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function FeatureCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="card">
      <div className="mb-2 text-2xl">{emoji}</div>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-foreground/70">{body}</p>
    </div>
  );
}

function StatTile({ emoji, value, label }: { emoji: string; value: React.ReactNode; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-xl">{emoji}</div>
      <p className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{value}</p>
      <p className="mt-0.5 text-sm text-foreground/60">{label}</p>
    </div>
  );
}
