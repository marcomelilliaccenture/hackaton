"use client";

import Link from "next/link";
import { useT } from "@/components/LanguageProvider";

/**
 * L'ingresso del percorso: cosa stiamo per chiedere, e il badge sulla
 * persistenza, che compare una volta sola (docs/ux-spec.md §7).
 * Le cinque domande stanno in /percorso/1 … /percorso/5: un passo, una URL.
 */
export default function PercorsoIndexPage() {
  const t = useT();

  return (
    <div className="flex flex-col gap-6">
      <h1
        id="titolo-pagina"
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t("percorso.intro.h1")}
      </h1>

      <p className="m-0">{t("percorso.intro.testo")}</p>

      <p className="m-0 border-l-[3px] border-rule bg-paper-warm px-3 py-2 text-[0.9375rem] text-ink-soft">
        {t("percorso.badge.locale")}
      </p>

      <Link
        href="/percorso/1"
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper sm:w-auto"
      >
        {t("percorso.intro.cta")}
      </Link>
    </div>
  );
}
