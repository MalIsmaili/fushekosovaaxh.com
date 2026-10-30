import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";

/** Centered card layout shared by the forgot/reset password pages. */
export async function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const t = await getDictionary();

  return (
    <main className="flex flex-1 flex-col">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/login" className="text-sm text-foreground/60 hover:text-foreground">
          {t.reset.backToLogin}
        </Link>
        <LanguageToggle />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-extrabold tracking-tight">
              <Logo />
              FushëkosovaBB
            </Link>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-foreground/70">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
