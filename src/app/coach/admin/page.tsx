import { redirect } from "next/navigation";
import { requireRole, isOwner } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { Avatar } from "@/components/Avatar";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { banUserAction, unbanUserAction, deleteUserAction } from "./actions";

export default async function AdminPage() {
  const user = await requireRole("COACH");
  if (!isOwner(user.email)) redirect("/coach");

  const dict = await getDictionary();

  const [students, parents] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "asc" },
      include: {
        studentProfile: { include: { groupAge: true } },
        childLinks: { include: { parent: { select: { name: true, email: true } } } },
      },
    }),
    prisma.user.findMany({
      where: { role: "PARENT" },
      orderBy: { createdAt: "asc" },
      include: {
        parentLinks: { include: { student: { select: { name: true, email: true } } } },
      },
    }),
  ]);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-extrabold tracking-tight">{dict.coach.adminTitle}</h1>
      <p className="mt-1 text-foreground/70">{dict.coach.adminSub}</p>

      <section className="mt-10">
        <h2 className="text-lg font-bold">{dict.coach.players}</h2>
        <div className="mt-3 space-y-2">
          {students.length === 0 && <p className="text-sm text-foreground/60">{dict.coach.noPlayers}</p>}
          {students.map((s) => (
            <div key={s.id} className="card flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar src={s.image} name={s.name} email={s.email} />
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {s.name ?? s.email} {s.banned && <span className="badge-loss ml-1">{dict.coach.banned}</span>}
                  </p>
                  <p className="truncate text-sm text-foreground/60">{s.email}</p>
                  <p className="truncate text-sm text-foreground/60">
                    {s.studentProfile?.groupAge?.name ?? dict.coach.noGroup}
                    {s.childLinks.length > 0 && (
                      <> · {dict.coach.linkedTo} {s.childLinks.map((l) => l.parent.name ?? l.parent.email).join(", ")}</>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <form action={s.banned ? unbanUserAction : banUserAction}>
                  <input type="hidden" name="userId" value={s.id} />
                  <button type="submit" className="btn-secondary">
                    {s.banned ? dict.coach.unban : dict.coach.ban}
                  </button>
                </form>
                <form action={deleteUserAction}>
                  <input type="hidden" name="userId" value={s.id} />
                  <ConfirmSubmitButton confirmMessage={`${dict.common.delete}: ${s.name ?? s.email}?`}>
                    {dict.common.delete}
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-bold">{dict.coach.parents}</h2>
        <div className="mt-3 space-y-2">
          {parents.length === 0 && <p className="text-sm text-foreground/60">{dict.coach.noParents}</p>}
          {parents.map((p) => (
            <div key={p.id} className="card flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar src={p.image} name={p.name} email={p.email} />
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {p.name ?? p.email} {p.banned && <span className="badge-loss ml-1">{dict.coach.banned}</span>}
                  </p>
                  <p className="truncate text-sm text-foreground/60">{p.email}</p>
                  {p.parentLinks.length > 0 && (
                    <p className="truncate text-sm text-foreground/60">
                      {dict.coach.linkedTo} {p.parentLinks.map((l) => l.student.name ?? l.student.email).join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <form action={p.banned ? unbanUserAction : banUserAction}>
                  <input type="hidden" name="userId" value={p.id} />
                  <button type="submit" className="btn-secondary">
                    {p.banned ? dict.coach.unban : dict.coach.ban}
                  </button>
                </form>
                <form action={deleteUserAction}>
                  <input type="hidden" name="userId" value={p.id} />
                  <ConfirmSubmitButton confirmMessage={`${dict.common.delete}: ${p.name ?? p.email}?`}>
                    {dict.common.delete}
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
