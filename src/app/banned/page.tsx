import { getDictionary } from "@/lib/i18n";
import { SignOutButton } from "@/components/SignOutButton";

export default async function BannedPage() {
  const t = await getDictionary();

  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <p className="text-5xl">⛔</p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{t.banned.title}</h1>
        <p className="mt-2 max-w-md text-foreground/70">{t.banned.body}</p>
        <div className="mt-6">
          <SignOutButton className="btn-secondary" />
        </div>
      </div>
    </main>
  );
}
