import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getDictionary } from "@/lib/i18n";

export async function AppHeader({
  homeHref,
  userName,
  role,
}: {
  homeHref: string;
  userName: string | null | undefined;
  role: "COACH" | "STUDENT" | "PARENT";
}) {
  const t = await getDictionary();
  const roleLabels: Record<string, string> = {
    COACH: t.common.coach,
    STUDENT: t.common.player,
    PARENT: t.common.parent,
  };

  return (
    <header className="border-b border-border bg-ink-900 text-white">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm">
            🏀
          </span>
          <span>CourtSide</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-white/70 sm:inline">
            {userName} · {roleLabels[role] ?? role}
          </span>
          <LanguageToggle />
          <SignOutButton className="btn bg-transparent text-white/90 hover:bg-white/10 hover:text-white" />
        </div>
      </div>
    </header>
  );
}
