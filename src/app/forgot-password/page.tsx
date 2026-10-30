import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getDictionary } from "@/lib/i18n";
import { AuthShell } from "@/components/AuthShell";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.meta.forgotPassword };
}

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const t = await getDictionary();

  return (
    <AuthShell title={t.reset.forgotTitle} subtitle={t.reset.forgotSubtitle}>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
