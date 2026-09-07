"use client";

import { createContext, useContext } from "react";
import { dictionaries, type Locale, type Dict } from "@/lib/dictionaries";

const I18nContext = createContext<{ locale: Locale; t: Dict }>({
  locale: "en",
  t: dictionaries.en,
});

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, t: dictionaries[locale] }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
