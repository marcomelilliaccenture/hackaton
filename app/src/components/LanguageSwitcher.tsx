"use client";

import { LANGS, type Lang } from "@/i18n";
import { useLanguage } from "./LanguageProvider";

/**
 * Quattro bottoni, non un <select>: quattro target da 44px si premono con il
 * pollice e si vedono tutti insieme (docs/ux-spec.md §5).
 * Ogni voce e' scritta nella propria lingua e porta il proprio `lang`.
 */
export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  function choose(next: Lang) {
    setLang(next);
    // Il focus va al titolo della pagina, non resta su un bottone che ora
    // significa un'altra cosa.
    const heading = document.getElementById("titolo-pagina");
    if (heading instanceof HTMLElement) heading.focus();
  }

  return (
    <nav aria-label="Lingua · Language · Langue · Idioma">
      <ul className="flex flex-wrap gap-2 p-0 m-0 list-none">
        {LANGS.map(({ code, label }) => {
          const attivo = code === lang;
          return (
            <li key={code}>
              <button
                type="button"
                lang={code}
                aria-current={attivo ? "true" : undefined}
                onClick={() => choose(code)}
                className={[
                  "min-h-[44px] min-w-[44px] px-4 py-2 rounded border text-base",
                  attivo
                    ? "bg-accent text-paper border-accent font-semibold"
                    : "bg-paper text-ink border-rule",
                ].join(" ")}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="sr-only">
        {LANGS.find((l) => l.code === lang)?.label}
      </p>
    </nav>
  );
}
