import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export async function SiteFooter() {
  const t = await getDictionary();

  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-wrap items-center justify-between gap-2 py-6 text-sm text-foreground/60">
        <p>© {new Date().getFullYear()} FushëkosovaBB</p>
        <Link href="/privacy" className="hover:text-foreground hover:underline">
          {t.footer.privacy}
        </Link>
      </div>
    </footer>
  );
}
