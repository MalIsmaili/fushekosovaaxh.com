import { requireRole } from "@/lib/auth-helpers";
import { AppHeader } from "@/components/AppHeader";

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("PARENT");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader homeHref="/parent" userName={user.name} role="PARENT" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
