import Link from "next/link";
import { format } from "date-fns";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { ProfileForm } from "./ProfileForm";

export default async function StudentProfilePage() {
  const user = await requireRole("STUDENT");
  const t = await getDictionary();

  const profile = await prisma.studentProfile.findUniqueOrThrow({
    where: { userId: user.id },
  });

  const initial = {
    phone: profile.phone ?? "",
    position: profile.position ?? "",
    jerseyNumber: profile.jerseyNumber != null ? String(profile.jerseyNumber) : "",
    heightCm: profile.heightCm != null ? String(profile.heightCm) : "",
    weightKg: profile.weightKg != null ? String(profile.weightKg) : "",
    birthDate: profile.birthDate ? format(profile.birthDate, "yyyy-MM-dd") : "",
    image: user.image ?? "",
    name: user.name ?? "",
  };

  return (
    <div className="container-page py-10">
      <Link href="/student" className="text-sm text-foreground/60 hover:text-foreground">
        {t.common.backToDashboard}
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{t.student.profileTitle}</h1>
      <p className="mt-1 text-foreground/70">{t.student.profileSubtitle}</p>

      <div className="mt-8">
        <ProfileForm initial={initial} />
      </div>
    </div>
  );
}
