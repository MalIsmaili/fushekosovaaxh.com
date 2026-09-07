import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("STUDENT");

  const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (!profile) redirect("/onboarding");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader homeHref="/student" userName={user.name} role="STUDENT" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
