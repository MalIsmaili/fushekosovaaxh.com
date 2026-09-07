import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getDictionary } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const t = await getDictionary();

  return (
    <main className="flex flex-1 flex-col">
      <div className="container-page flex h-16 items-center justify-between">
        <span className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm">
            🏀
          </span>
          CourtSide
        </span>
        <LanguageToggle />
      </div>
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
    </main>
  );
}

function FeatureCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="card">
      <div className="mb-2 text-2xl">{emoji}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-foreground/70">{body}</p>
    </div>
  );
}
