"use client";

import Link from "next/link";
import { JourneyProgress } from "@/components/JourneyProgress";
import { useLanguage, useT } from "@/components/LanguageProvider";
import { SourceNote } from "@/components/SourceNote";
import { FESTIVITA_NAZIONALI_ROWS } from "@/data/festivita";
import {
  calendarDaysDeadline,
  daysRemaining,
  workingDaysDeadline,
  type SkipReason,
} from "@/domain/deadline";
import {
  fill,
  formatDayInList,
  formatLongDate,
  parseDay,
  useStoredAnswers,
} from "../percorso/answers";

/**
 * A-05 — entro quando si spedisce, e come l'abbiamo contato.
 * Il conteggio arriva tutto da `@/domain/deadline`: qui si mostra la data, i
 * giorni contati uno per uno, quelli saltati con il motivo, e la seconda data
 * (lettura prudente di F5). Lo strumento deve poter essere ricontrollato a mano.
 */

/** Il nome della festivita' saltata: codice dalla tabella, parole da i18n. */
function codiceFestivita(date: Date): string | null {
  const row = FESTIVITA_NAZIONALI_ROWS.find(
    (f) =>
      f.year === date.getFullYear() && f.month === date.getMonth() + 1 && f.day === date.getDate()
  );
  return row ? row.code : null;
}

export default function ScadenzaPage() {
  const t = useT();
  const { lang } = useLanguage();
  const { answers, today, ready } = useStoredAnswers();
  const entryDate = parseDay(answers.entryDate);

  if (!ready || !today) {
    return (
      <div className="flex flex-col gap-6">
        <h1 id="titolo-pagina" tabIndex={-1} className="m-0 text-[1.5rem] font-semibold">
          {t("scadenza.h1")}
        </h1>
        <p className="m-0">{t("dove.caricamento")}</p>
      </div>
    );
  }

  if (!entryDate) {
    return (
      <div className="flex flex-col gap-6">
        <h1 id="titolo-pagina" tabIndex={-1} className="m-0 text-[1.5rem] font-semibold">
          {t("scadenza.h1")}
        </h1>
        <p className="m-0">{t("scadenza.mancaIngresso")}</p>
        <Link
          href="/percorso/3"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("scadenza.vaiAllaData")}
        </Link>
      </div>
    );
  }

  const { deadline, countedDays, skipped } = workingDaysDeadline(entryDate);
  const calendario = calendarDaysDeadline(entryDate);
  const restano = daysRemaining(deadline, today);

  type Riga = { date: Date; reason: SkipReason | null };
  const righe: Riga[] = [
    ...countedDays.map((d) => ({ date: d, reason: null })),
    ...skipped.map((s) => ({ date: s.date, reason: s.reason })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  let contati = 0;

  const frase =
    restano < 0
      ? t("scadenza.stato.passato")
      : restano === 0
        ? t("scadenza.stato.oggi")
        : restano === 1
          ? t("scadenza.stato.domani")
          : fill(t("scadenza.stato.giorni"), { n: restano });

  return (
    <div className="flex flex-col gap-6">
      <JourneyProgress route="/scadenza" />

      <h1
        id="titolo-pagina"
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t("scadenza.h1")}
      </h1>

      {/* 1 e 2 — la data, e quanto manca, in parole */}
      <section className="flex flex-col gap-2 border-l-[3px] border-accent bg-accent-weak px-4 py-4">
        <p className="m-0 text-[1.25rem] font-semibold">
          {fill(t("scadenza.dataLimite"), { data: formatLongDate(deadline, lang) })}
        </p>
        <p className="m-0">{frase}</p>
        <SourceNote source="F12" detail="art. 5 c. 2 D.lgs 286/1998 · F3 · F4" />
      </section>

      {/* 3 — il conto, giorno per giorno */}
      <section className="flex flex-col gap-3" aria-labelledby="conteggio-titolo">
        <h2 id="conteggio-titolo" className="m-0 text-[1.25rem] font-semibold">
          {t("scadenza.conteggio.titolo")}
        </h2>
        <p className="m-0">
          {fill(t("scadenza.conteggio.dalGiornoDopo"), {
            ingresso: formatLongDate(entryDate, lang),
          })}
        </p>
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {righe.map((riga) => {
            const saltato = riga.reason !== null;
            if (!saltato) contati += 1;
            const numero = contati;
            const festa = riga.reason === "holiday" ? codiceFestivita(riga.date) : null;
            const motivo = saltato
              ? riga.reason === "weekend"
                ? riga.date.getDay() === 6
                  ? t("scadenza.motivo.sabato")
                  : t("scadenza.motivo.domenica")
                : festa
                  ? fill(t("scadenza.motivo.festivita"), { nome: t(`festivita.${festa}`) })
                  : t("scadenza.motivo.festivitaSenzaNome")
              : null;

            return (
              <li
                key={riga.date.toISOString()}
                className={[
                  "flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded border px-3 py-2",
                  saltato ? "border-rule bg-paper-warm" : "border-rule bg-paper",
                ].join(" ")}
              >
                <span className="min-w-[7rem] font-semibold">
                  {saltato
                    ? t("scadenza.conteggio.nonConta")
                    : fill(t("scadenza.conteggio.giornoN"), { n: numero })}
                </span>
                <span className={saltato ? "text-ink-soft line-through" : ""}>
                  {formatDayInList(riga.date, lang)}
                </span>
                {motivo ? <span className="text-[0.9375rem] text-ink-soft">{motivo}</span> : null}
              </li>
            );
          })}
        </ol>
        <p className="m-0 text-[0.9375rem] text-ink-soft">{t("scadenza.conteggio.limite")}</p>
      </section>

      {/* 4 — la seconda data, e perche' ce ne sono due */}
      <section className="flex flex-col gap-2" aria-labelledby="prudente-titolo">
        <h2 id="prudente-titolo" className="m-0 text-[1.25rem] font-semibold">
          {t("scadenza.prudente.titolo")}
        </h2>
        <p className="m-0 font-semibold">
          {fill(t("scadenza.prudente.data"), { data: formatLongDate(calendario, lang) })}
        </p>
        <p className="m-0">{t("scadenza.prudente.perche")}</p>
        <p className="m-0">{t("scadenza.prudente.qualeSceglie")}</p>
        <SourceNote source="F5" detail="F3 · F4" />
      </section>

      {/* 6 — se il termine passa */}
      <section className="flex flex-col gap-2" aria-labelledby="oltre-titolo">
        <h2 id="oltre-titolo" className="m-0 text-[1.25rem] font-semibold">
          {t("scadenza.oltre.titolo")}
        </h2>
        <p className="m-0">{t("scadenza.oltre.testo")}</p>
        <SourceNote source="F12" detail="art. 5 c. 2 D.lgs 286/1998" />
      </section>

      <div className="flex flex-wrap gap-3">
        {/* Il passo dopo nella catena: quanto paghi, poi il modulo. */}
        <Link
          href="/costi"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("scadenza.vaiAiCosti")}
        </Link>
        <Link
          href="/dove"
          className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
        >
          {t("scadenza.indietro")}
        </Link>
      </div>
    </div>
  );
}
