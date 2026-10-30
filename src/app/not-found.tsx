import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.meta.notFound };
}

export default async function NotFound() {
  const t = await getDictionary();

  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <p className="text-5xl">🏀</p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{t.notFound.title}</h1>
        <p className="mt-2 text-foreground/70">{t.notFound.body}</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          {t.notFound.backHome}
        </Link>
      </div>
    </main>
  );
}
