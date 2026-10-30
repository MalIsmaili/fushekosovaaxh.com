import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { verifyResetToken } from "@/lib/password-reset";
import { AuthShell } from "@/components/AuthShell";
import { ResetPasswordForm } from "./ResetPasswordForm";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.meta.resetPassword, robots: { index: false } };
}

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const t = await getDictionary();
  const { token = "" } = await searchParams;
  const user = token ? await verifyResetToken(token) : null;

  if (!user) {
    return (
      <AuthShell title={t.reset.resetTitle}>
        <div className="card space-y-4 text-center">
          <p role="alert" className="text-sm text-red-600">
            {t.reset.invalidLink}
          </p>
          <Link href="/forgot-password" className="btn-primary">
            {t.reset.requestNew}
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t.reset.resetTitle} subtitle={t.reset.resetSubtitle}>
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
