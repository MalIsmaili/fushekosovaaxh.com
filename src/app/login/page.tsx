import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getDictionary } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";
import { NewPlayerPrompt } from "./NewPlayerPrompt";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.meta.login };
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const t = await getDictionary();
  const { reset } = await searchParams;

  return (
    <main className="flex flex-1 flex-col">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-sm text-foreground/60 hover:text-foreground">
          {t.common.back}
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
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{t.auth.loginTitle}</h1>
            <p className="mt-2 text-foreground/70">{t.auth.loginSubtitle}</p>
          </div>

          {reset === "1" ? (
            <p role="status" className="card mb-4 text-sm text-success-600">
              {t.authExtra.passwordChanged}
            </p>
          ) : (
            <NewPlayerPrompt />
          )}

          <LoginForm />

          <p className="mt-4 text-center text-sm text-foreground/60">
            {t.auth.noAccount}{" "}
            <Link href="/signup" className="font-medium text-brand-600 hover:underline">
              {t.common.signUp}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
