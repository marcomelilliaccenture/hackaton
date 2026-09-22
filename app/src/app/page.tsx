"use client";

import Link from "next/link";
import { useT } from "@/components/LanguageProvider";

/**
 * Home. La scelta della lingua nell'intestazione cambia questa pagina insieme a
 * tutto il resto (A-01): qui non c'e' testo scritto a mano, solo chiavi.
 */
export default function HomePage() {
  const t = useT();

  return (
    <div className="flex flex-col gap-6">
      <h1
        id="titolo-pagina"
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t("home.h1")}
      </h1>
      <p className="m-0">{t("home.intro")}</p>
      {/* Da qui parte il percorso: / → /percorso → … → /riepilogo. */}
      <Link
        href="/percorso"
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper sm:w-auto"
      >
        {t("home.ctaPercorso")}
      </Link>
      <Link
        href="/riepilogo"
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded border border-accent px-6 py-3 text-base font-semibold text-accent sm:w-auto"
      >
        {t("home.ctaRiepilogo")}
      </Link>
    </div>
  );
}
