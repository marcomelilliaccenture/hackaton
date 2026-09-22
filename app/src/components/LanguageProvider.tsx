"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANG, langAttr, type Lang, t } from "@/i18n";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

/**
 * Tiene la lingua scelta e la propaga a <html lang> e al titolo del documento.
 * I testi dell'interfaccia arrivano in B1B: qui cambiano titolo e attributo lang.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t("app.title", lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Traduzione legata alla lingua scelta: `const t = useT(); t("campo.77.plain")`.
 * Una chiave mancante ritorna la chiave (docs/specs/B1B): en ed es sono vuoti e
 * devono mancare visibilmente.
 */
export function useT(): (key: string) => string {
  const { lang } = useLanguage();
  return useCallback((key: string) => t(key, lang), [lang]);
}

/**
 * `const langIt = useLangAttr(); <span lang={langIt("nota.a")}>`.
 * Ritorna "it" solo se quella chiave e' rimasta in italiano nella lingua
 * attiva; altrimenti `undefined`, cioe' nessun attributo (vedi `langAttr`).
 */
export function useLangAttr(): (key: string) => "it" | undefined {
  const { lang } = useLanguage();
  return useCallback((key: string) => langAttr(key, lang), [lang]);
}
