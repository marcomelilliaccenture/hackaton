"use client";

import Link from "next/link";
import { JourneyProgress } from "@/components/JourneyProgress";
import { useT } from "@/components/LanguageProvider";
import { SourceNote } from "@/components/SourceNote";
import { channelFor, type RoutingReason } from "@/domain/routing";
import { toDomainAnswers, useStoredAnswers } from "../percorso/answers";
import type { SourceNoteProps } from "@/components/SourceNote";

/**
 * A-04 — dove si presenta questa domanda. La decisione non si prende qui:
 * la prende `channelFor` in `@/domain/routing`. Questa pagina traduce il
 * codice in parole e scrive SEMPRE il perche', ragione per ragione.
 */

/** Ogni ragione porta la sua fonte: chi legge deve poter risalire. */
const FONTE_RAGIONE: Record<RoutingReason, SourceNoteProps["source"]> = {
  MOTIVO_SOLO_QUESTURA: "F8",
  PRESENTATO_DA_TERZO: "F8",
  MINORE_NON_ACCOMPAGNATO: "F8",
  SOGGIORNO_BREVE: "F3",
  MOTIVO_NON_RICONOSCIUTO: "F7",
};

export default function DovePage() {
  const t = useT();
  const { answers, ready } = useStoredAnswers();

  // Prima del mount non sappiamo cosa ha risposto: non si disegna un esito.
  if (!ready) {
    return (
      <div className="flex flex-col gap-6">
        <h1 id="titolo-pagina" tabIndex={-1} className="m-0 text-[1.5rem] font-semibold">
          {t("dove.h1")}
        </h1>
        <p className="m-0">{t("dove.caricamento")}</p>
      </div>
    );
  }

  // Entrare qui senza aver risposto non e' un errore: si dice cosa manca.
  if (!answers.motivo || !answers.presentedBy) {
    return (
      <div className="flex flex-col gap-6">
        <h1 id="titolo-pagina" tabIndex={-1} className="m-0 text-[1.5rem] font-semibold">
          {t("dove.h1")}
        </h1>
        <p className="m-0">{t("dove.mancano")}</p>
        <Link
          href="/percorso/1"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("dove.vaiAlPercorso")}
        </Link>
      </div>
    );
  }

  const domain = toDomainAnswers(answers);
  const { channel, reasons } = channelFor({
    motivo: domain.motivo,
    presentedBy: domain.presentedBy,
    stayLongerThan3Months: domain.stayLongerThan3Months,
  });

  return (
    <div className="flex flex-col gap-6">
      <JourneyProgress route="/dove" />

      <h1
        id="titolo-pagina"
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t("dove.h1")}
      </h1>

      <section
        className="flex flex-col gap-3 border-l-[3px] border-accent bg-accent-weak px-4 py-4"
        aria-labelledby="esito-titolo"
      >
        <h2 id="esito-titolo" className="m-0 text-[1.25rem] font-semibold">
          {t(`dove.esito.${channel}.titolo`)}
        </h2>
        <p className="m-0">{t(`dove.esito.${channel}.testo`)}</p>

        {reasons.length > 0 ? (
          <>
            <h3 className="m-0 text-base font-semibold">{t("dove.perche")}</h3>
            <ul className="m-0 flex list-disc flex-col gap-3 pl-5">
              {reasons.map((reason) => (
                <li key={reason} className="flex flex-col gap-1">
                  <span>{t(`dove.ragione.${reason}`)}</span>
                  <SourceNote source={FONTE_RAGIONE[reason]} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      {channel === "ufficio-postale" ? (
        <section className="flex flex-col gap-3" aria-labelledby="sportello-titolo">
          <h2 id="sportello-titolo" className="m-0 text-[1.25rem] font-semibold">
            {t("dove.sportello.titolo")}
          </h2>
          <p className="m-0">{t("dove.sportello.testo")}</p>
          <p className="m-0">{t("dove.sportello.documenti")}</p>
          <SourceNote source="F5" />
        </section>
      ) : null}

      {reasons.includes("MOTIVO_NON_RICONOSCIUTO") ? (
        <section className="flex flex-col gap-3 border-l-[3px] border-warn bg-warn-weak px-4 py-4">
          <h2 className="m-0 text-[1.25rem] font-semibold">{t("dove.limite.titolo")}</h2>
          <p className="m-0">{t("dove.limite.testo")}</p>
          <p className="m-0">{t("dove.limite.doveChiedere")}</p>
          <SourceNote source="F5" />
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/percorso/5"
          className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
        >
          {t("dove.indietro")}
        </Link>
        <Link
          href="/scadenza"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("dove.vaiAllaScadenza")}
        </Link>
      </div>
    </div>
  );
}
