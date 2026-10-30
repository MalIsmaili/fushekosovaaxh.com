import { cookies } from "next/headers";
import { dictionaries, LOCALE_COOKIE, type Locale } from "@/lib/dictionaries";

// Albanian is the default for visitors who haven't picked a language yet.
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(LOCALE_COOKIE)?.value === "en" ? "en" : "sq";
}

export async function getDictionary() {
  const locale = await getLocale();
  return dictionaries[locale];
}
