"use client";

import Link from "next/link";
import { daysRemaining, workingDaysDeadline } from "@/domain/deadline";
import { fill, formatLongDate, parseDay, useStoredAnswers } from "@/app/percorso/answers";
import { useLanguage, useT } from "./LanguageProvider";
import { SourceNote } from "./SourceNote";

/**
 * Da /percorso in poi, su ogni pagina (docs/ux-spec.md §3).
 * Informativo, non un countdown: sotto i 2 giorni cambia la FRASE, non il
 * colore. `aria-live="off"`: non si annuncia a ogni cambio di pagina.
 *
 * Il calcolo non sta qui: arriva da `workingDaysDeadline` e `daysRemaining`.
 */
export function DeadlineBanner() {
  const t = useT();
  const { lang } = useLanguage();
  const { answers, today, ready } = useStoredAnswers();

  const entryDate = parseDay(answers.entryDate);
  if (!ready || !entryDate || !today) return null;

  const { deadline } = workingDaysDeadline(entryDate);
  const restano = daysRemaining(deadline, today);

  const frase =
    restano < 0
      ? t("scadenza.stato.passato")
      : restano === 0
        ? t("scadenza.stato.oggi")
        : restano === 1
          ? t("scadenza.stato.domani")
          : fill(t("scadenza.stato.giorni"), { n: restano });

  return (
    <aside
      aria-live="off"
      aria-label={t("scadenza.banner.label")}
      className="no-print flex flex-col gap-1 border-l-[3px] border-accent bg-accent-weak px-4 py-3"
    >
      <p className="m-0 text-base font-semibold">
        {fill(t("scadenza.banner.data"), { data: formatLongDate(deadline, lang) })}
      </p>
      <p className="m-0">{frase}</p>
      <Link
        href="/scadenza"
        className="inline-flex min-h-[44px] items-center self-start text-base font-semibold text-accent underline underline-offset-4"
      >
        {t("scadenza.banner.comeCalcolata")}
      </Link>
      <SourceNote source="F12" detail="art. 5 c. 2 D.lgs 286/1998" />
    </aside>
  );
}
