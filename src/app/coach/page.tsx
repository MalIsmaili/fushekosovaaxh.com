import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { CreateGroupForm } from "./CreateGroupForm";

export default async function CoachHomePage() {
  const t = await getDictionary();
  const groups = await prisma.groupAge.findMany({
    orderBy: { name: "asc" },
    include: { students: { select: { status: true } } },
  });

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-extrabold tracking-tight">{t.coach.yourGroups}</h1>
      <p className="mt-1 text-foreground/70">{t.coach.yourGroupsSub}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {groups.length === 0 && <div className="card text-foreground/60">{t.coach.noGroups}</div>}
          {groups.map((group) => {
            const approved = group.students.filter((s) => s.status === "APPROVED").length;
            const pending = group.students.filter((s) => s.status === "PENDING").length;
            return (
              <Link
                key={group.id}
                href={`/coach/groups/${group.id}`}
                className="card flex items-center justify-between transition hover:border-brand-500 hover:shadow-md"
              >
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  {group.description && (
                    <p className="mt-0.5 text-sm text-foreground/60">{group.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge-approved">
                    {approved} {t.coach.active}
                  </span>
                  {pending > 0 && (
                    <span className="badge-pending">
                      {pending} {t.coach.pending}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <CreateGroupForm />
      </div>
    </div>
  );
}
