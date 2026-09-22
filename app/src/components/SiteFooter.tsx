"use client";

import Link from "next/link";
import { useT } from "./LanguageProvider";

/**
 * Footer istituzionale del prototipo.
 *
 * Una sola cosa qui è vera: il link a /limiti (terzo deliverable del tema).
 * Gli altri — Privacy, Cookie, Note legali, Accessibilità, Contatti — sono
 * SEGNAPOSTO: esistono perché un sito pubblico li ha, e la riga sopra il
 * copyright lo dice a voce alta. Tecnicamente sono `<a href="#">` con
 * `aria-disabled="true"` e il click annullato: restano raggiungibili da
 * tastiera e annunciati come link non disponibili, ma non navigano da nessuna
 * parte e non possono dare 404 in demo.
 */
const SEGNAPOSTO: ReadonlyArray<string> = [
  "footer.privacy",
  "footer.cookie",
  "footer.noteLegali",
  "footer.accessibilita",
  "footer.contatti",
];

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto flex w-full max-w-[40rem] flex-col gap-3 px-4 py-6 text-base text-ink-soft">
        <nav aria-label={t("footer.navLabel")}>
          <ul className="m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-1 p-0">
            {SEGNAPOSTO.map((key) => (
              <li key={key}>
                <a
                  href="#"
                  aria-disabled="true"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex min-h-[44px] cursor-not-allowed items-center text-ink-soft underline decoration-dotted"
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dichiarato, non nascosto: il finto si dice. */}
        {/* <p className="m-0 text-[0.9375rem]">{t("footer.segnaposto")}</p> */}

        <p className="m-0 text-[0.9375rem]">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
