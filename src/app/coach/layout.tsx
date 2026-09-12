import { requireRole, isOwner } from "@/lib/auth-helpers";
import { AppHeader } from "@/components/AppHeader";

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("COACH");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader homeHref="/coach" userName={user.name} role="COACH" showAdminLink={isOwner(user.email)} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
