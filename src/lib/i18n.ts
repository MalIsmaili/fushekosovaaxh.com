import { cookies } from "next/headers";
import { dictionaries, LOCALE_COOKIE, type Locale } from "@/lib/dictionaries";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(LOCALE_COOKIE)?.value === "sq" ? "sq" : "en";
}

export async function getDictionary() {
  const locale = await getLocale();
  return dictionaries[locale];
}
