import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { StudentOnboardForm } from "./StudentOnboardForm";
import { ParentOnboardForm } from "./ParentOnboardForm";

export default async function OnboardingPage() {
  const user = await requireSession();
  const t = await getDictionary();

  // Role is chosen at signup. If somehow missing, send them back to log in.
  if (!user.role) redirect("/login");

  if (user.role === "COACH") redirect("/coach");

  if (user.role === "STUDENT") {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
    if (profile) redirect("/student");

    const groups = await prisma.groupAge.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
    return (
      <Shell title={t.onboarding.joinTitle} subtitle={t.onboarding.joinSubtitle}>
        <StudentOnboardForm groups={groups} />
      </Shell>
    );
  }

  // PARENT
  const linkCount = await prisma.parentChildLink.count({ where: { parentId: user.id } });
  if (linkCount > 0) redirect("/parent");

  return (
    <Shell title={t.onboarding.linkTitle} subtitle={t.onboarding.linkSubtitle}>
      <ParentOnboardForm />
    </Shell>
  );
}

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center">
      <div className="container-page py-16">
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-2 text-foreground/70">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
