"use client";

import Link from "next/link";
import { useState } from "react";
import { IssueBlock } from "@/components/IssueBlock";
import { JourneyProgress } from "@/components/JourneyProgress";
import {
  ModuloFacsimile,
  type FacsimileNota,
  type FacsimileRiga,
} from "@/components/ModuloFacsimile";
import { useLanguage, useT } from "@/components/LanguageProvider";
import { formatEuro } from "@/components/FeeTable";
import { SourceNote } from "@/components/SourceNote";
import { motivoByCode } from "@/data/motivi";
import { sezioneDiCasella } from "@/data/modulo-209-sezioni";
import { workingDaysDeadline } from "@/domain/deadline";
import { feesFor } from "@/domain/fees";
import { sheetCount } from "@/domain/progress";
import { requirementsFor } from "@/domain/requirements";
import { channelFor } from "@/domain/routing";
import type { Issue } from "@/domain/types";
import { validateAll } from "@/domain/validators";
import { fill, formatLongDate, parseDay } from "@/app/percorso/answers";
import { useKitState } from "./state";

/**
 * A-12 · A-13 · A-14 — l'uscita: i dati nella forma del modulo, gli errori
 * evitati, cosa fare prima di chiudere la busta e cosa succede dopo.
 *
 * Qui non si calcola NIENTE a mano: la proposta per la casella 25 arriva da
 * `sheetCount()` (R-11), gli avvisi da `validateAll()`, i totali da `feesFor()`,
 * l'elenco degli allegati da `requirementsFor()`, la data di spedizione da
 * `workingDaysDeadline()`. Questa pagina traduce codici in parole e stampa.
 *
 * La stampa (A-12) e' in `globals.css`, `@media print`: via navigazione,
 * intestazione, piede e bottoni; restano i dati con i numeri di casella.
 */

/** R-29 — cosa portare alla convocazione. Fonte: F1 §B · F4. */
const DA_PORTARE: { id: string; key: string; evidenza?: boolean }[] = [
  { id: "foto", key: "riepilogo.porta.foto", evidenza: true },
  { id: "ricevuta", key: "riepilogo.porta.ricevuta" },
  { id: "appuntamento", key: "riepilogo.porta.appuntamento" },
  { id: "bollettino", key: "riepilogo.porta.bollettino" },
  { id: "originali", key: "riepilogo.porta.originali" },
  { id: "figli", key: "riepilogo.porta.figli" },
];

const CASELLA_FOGLI = 25;
const CASELLA_FIRMA = 29;

interface Riga {
  casella: number;
  labelKey: string;
  /** nome burocratico, resta in italiano */
  officialKey?: string;
  value: string;
  /**
   * Cosa cambia sul facsimile di stampa, dove conta trovare la casella sul cartaceo e
   * scriverci dentro la cosa giusta: l'etichetta stampata sul modulo quando non coincide
   * con quella che l'app mostra a schermo, e il valore nella forma che la casella vuole
   * (un codice, una data in cifre) con le parole sotto.
   */
  facsimileOfficialKey?: string;
  facsimileValue?: string;
  facsimileSpiegazione?: string;
}

export default function RiepilogoPage() {
  const t = useT();
  const { lang } = useLanguage();
  const { ready, today, stored, modulo, checkedDocs, conferme, answers, updateConferme } =
    useKitState();
  const [dettaglioFogli, setDettaglioFogli] = useState(true);

  if (!ready || !today) {
    return (
      <div className="flex flex-col gap-6">
        <h1 id="titolo-pagina" tabIndex={-1} className="m-0 text-[1.5rem] font-semibold">
          {t("riepilogo.h1")}
        </h1>
        <p className="m-0">{t("riepilogo.caricamento")}</p>
      </div>
    );
  }

  // Entrare qui senza aver risposto non e' un errore: si dice cosa manca.
  if (!stored.motivo) {
    return (
      <div className="flex flex-col gap-6">
        <h1 id="titolo-pagina" tabIndex={-1} className="m-0 text-[1.5rem] font-semibold">
          {t("riepilogo.h1")}
        </h1>
        <p className="m-0">{t("riepilogo.mancano")}</p>
        <Link
          href="/percorso/1"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("riepilogo.vaiAlPercorso")}
        </Link>
      </div>
    );
  }

  const issues: Issue[] = validateAll(answers, today);
  const entryDate = parseDay(stored.entryDate);
  const scadenza = entryDate ? workingDaysDeadline(entryDate).deadline : null;
  const fogli = sheetCount(answers, checkedDocs);
  const fees = feesFor({
    istanza: answers.istanza,
    durata: answers.durata,
    ageYears: answers.ageYears,
    childrenUnder14: answers.childrenUnder14,
  });
  const requisiti = requirementsFor(answers.motivo, answers.istanza);
  const { channel } = channelFor({
    motivo: answers.motivo,
    presentedBy: answers.presentedBy,
    stayLongerThan3Months: answers.stayLongerThan3Months,
  });

  const motivo = motivoByCode(answers.motivo);
  const recapitoSeparato = modulo.sceltaRecapito === "altro";

  // Nelle caselle del modulo la data va in cifre, e il cartaceo e' italiano: GG/MM/AAAA
  // anche quando l'app parla francese.
  const dataInCifre = entryDate
    ? new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(entryDate)
    : "";
  const motivoCompilabile = motivo && motivo.code !== "altro" ? motivo : undefined;

  const righe: Riga[] = [
    {
      casella: 16,
      labelKey: "riepilogo.riga.16",
      officialKey: "percorso.1.official",
      value: motivoCompilabile ? `${motivoCompilabile.code} · ${motivoCompilabile.official}` : "",
      // sul cartaceo la casella 16 vuole il codice, e si chiama con un altro nome
      facsimileOfficialKey: "campo.16.official",
      facsimileValue: motivoCompilabile?.code ?? "",
      facsimileSpiegazione: motivoCompilabile?.official,
    },
    {
      casella: 48,
      labelKey: "riepilogo.riga.48",
      officialKey: "percorso.3.official",
      value: entryDate ? formatLongDate(entryDate, lang) : "",
      facsimileValue: dataInCifre,
      facsimileSpiegazione: entryDate ? formatLongDate(entryDate, lang) : undefined,
    },
    {
      casella: 5,
      labelKey: "riepilogo.riga.5",
      value: stored.province ?? "",
      facsimileOfficialKey: "campo.5.official",
    },
    { casella: 3, labelKey: "campo.3.plain", officialKey: "campo.3.official", value: modulo.cognome },
    { casella: 4, labelKey: "campo.4.plain", officialKey: "campo.4.official", value: modulo.nome },
    {
      casella: 68,
      labelKey: "campo.68.plain",
      officialKey: "campo.68.official",
      value: modulo.residenzaIndirizzo,
    },
    {
      casella: 77,
      labelKey: "campo.77.plain",
      officialKey: "campo.77.official",
      value: recapitoSeparato ? modulo.presso : "",
    },
    {
      casella: 78,
      labelKey: "campo.78.plain",
      officialKey: "campo.78.official",
      value: recapitoSeparato ? modulo.provincia : "",
    },
    {
      casella: 79,
      labelKey: "campo.79.plain",
      officialKey: "campo.79.official",
      value: recapitoSeparato ? modulo.comune : "",
    },
    {
      casella: 80,
      labelKey: "campo.80.plain",
      officialKey: "campo.80.official",
      value: recapitoSeparato ? modulo.indirizzo : "",
    },
    {
      casella: 81,
      labelKey: "campo.81.plain",
      officialKey: "campo.81.official",
      value: recapitoSeparato ? modulo.civico : "",
    },
    {
      casella: 82,
      labelKey: "campo.82.plain",
      officialKey: "campo.82.official",
      value: recapitoSeparato ? modulo.scala : "",
    },
    {
      casella: 83,
      labelKey: "campo.83.plain",
      officialKey: "campo.83.official",
      value: recapitoSeparato ? modulo.interno : "",
    },
    {
      casella: 84,
      labelKey: "campo.84.plain",
      officialKey: "campo.84.official",
      value: recapitoSeparato ? modulo.cap : "",
    },
    {
      casella: CASELLA_FOGLI,
      labelKey: "riepilogo.riga.25",
      value: conferme.sheetCountConfirmed ? String(fogli.proposed) : "",
      facsimileOfficialKey: "campo.25.official",
    },
    {
      casella: CASELLA_FIRMA,
      labelKey: "riepilogo.riga.29",
      value: conferme.signatureConfirmed ? t("riepilogo.riga.29.fatta") : "",
      facsimileOfficialKey: "campo.29.official",
      // la 29 non si trascrive: si firma. Vale anche se la spunta non c'e' ancora.
      facsimileValue: t("facsimile.firmaAMano"),
    },
  ];

  // Nota (q): con il recapito dove la persona vive, la sezione 8 non si compila. Sul
  // facsimile non escono otto caselle "da compilare a mano" — esce la sezione col motivo.
  const righeFacsimile: FacsimileRiga[] = righe
    .filter((riga) => recapitoSeparato || sezioneDiCasella(riga.casella)?.numero !== 8)
    .map((riga) => ({
      casella: riga.casella,
      officialKey: riga.facsimileOfficialKey ?? riga.officialKey,
      value: riga.facsimileValue ?? riga.value,
      spiegazione: riga.facsimileSpiegazione,
    }));

  const noteFacsimile: FacsimileNota[] = recapitoSeparato
    ? []
    : [{ sezione: 8, testo: t("riepilogo.dati.sezione8Vuota") }];

  // A-13 — SOLO i controlli realmente passati. Un elenco che si vanta di
  // controlli non avvenuti e' la cosa peggiore che questa pagina possa fare:
  // ogni voce qui sotto e' l'assenza di un codice che `validateAll` avrebbe
  // emesso, sui dati che la persona ha davvero scritto.
  const codici = new Set(issues.map((i) => i.code));
  const evitati: string[] = [];

  if (
    modulo.cognome.trim() !== "" &&
    modulo.nome.trim() !== "" &&
    modulo.mrz.trim() !== "" &&
    !codici.has("NAME_ORDER_SUSPECT") &&
    !codici.has("NAME_NOT_IN_MRZ") &&
    !codici.has("NAME_NON_LATIN")
  ) {
    evitati.push("riepilogo.evitato.nome");
  }

  if (modulo.sceltaRecapito !== null && !codici.has("ADDRESS_EMPTY_NO_STABLE")) {
    evitati.push(
      recapitoSeparato ? "riepilogo.evitato.recapitoAltro" : "riepilogo.evitato.recapito"
    );
  }

  if (channel === "ufficio-postale" && motivo && motivo.code !== "altro") {
    evitati.push("riepilogo.evitato.tipologia");
  }

  if (entryDate && !codici.has("DEADLINE_PASSED") && !codici.has("ENTRY_DATE_FUTURE")) {
    evitati.push("riepilogo.evitato.tempi");
  }

  if (checkedDocs.length > 0 && checkedDocs.length === requisiti.length) {
    evitati.push("riepilogo.evitato.documenti");
  }

  // Quello che resta aperto si dice, non si nasconde.
  const aperti = issues.filter((i) => i.field !== CASELLA_FOGLI && i.field !== CASELLA_FIRMA);
  const firmaIssue = issues.find((i) => i.field === CASELLA_FIRMA);
  const fogliIssue = issues.find((i) => i.field === CASELLA_FOGLI);

  function toggleDaPortare(id: string, value: boolean) {
    const next = value
      ? [...new Set([...conferme.convocazione, id])]
      : conferme.convocazione.filter((x) => x !== id);
    updateConferme({ convocazione: next });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* A-12 — su carta viene per primo, ed e' il foglio che si tiene accanto al kit.
          A schermo non esiste: gli stessi dati sono nell'elenco qui sotto, che e' la
          versione leggibile da chi usa uno screen reader. */}
      <ModuloFacsimile className="solo-stampa" righe={righeFacsimile} note={noteFacsimile} />

      <div className="no-print">
        <JourneyProgress route="/riepilogo" />
      </div>

      <div className="flex flex-col gap-3">
        <h1
          id="titolo-pagina"
          tabIndex={-1}
          className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
        >
          {t("riepilogo.h1")}
        </h1>
        <p className="m-0">{t("riepilogo.intro")}</p>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print inline-flex min-h-[48px] w-full items-center justify-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper sm:w-auto"
        >
          {t("riepilogo.stampa.cta")}
        </button>
        <p className="no-print m-0 text-[0.9375rem] text-ink-soft">
          {t("riepilogo.stampa.cosaEsce")}
        </p>
        <p className="no-print m-0 text-[0.9375rem] text-ink-soft">{t("riepilogo.stampa.nota")}</p>
      </div>

      {/* Quando spedire: resta anche in stampa. */}
      {scadenza ? (
        <section
          className="flex flex-col gap-1 border border-rule bg-paper px-4 py-3"
          aria-labelledby="riepilogo-scadenza"
        >
          <h2 id="riepilogo-scadenza" className="m-0 text-[1.25rem] font-semibold">
            {t("riepilogo.scadenza.titolo")}
          </h2>
          <p className="m-0 text-[1.125rem] font-semibold">
            {fill(t("riepilogo.scadenza.data"), { data: formatLongDate(scadenza, lang) })}
          </p>
          <SourceNote source="F12" detail="art. 5 c. 2 D.lgs 286/1998 · F3 · F4" />
        </section>
      ) : null}

      {/* 1 — i tuoi dati, nella forma del modulo. In stampa cede il posto al facsimile,
          che dice le stesse cose nella forma del cartaceo. */}
      <section className="no-print flex flex-col gap-3" aria-labelledby="riepilogo-dati">
        <h2 id="riepilogo-dati" className="m-0 text-[1.25rem] font-semibold">
          {t("riepilogo.dati.titolo")}
        </h2>
        <p className="m-0">{t("riepilogo.dati.intro")}</p>
        {!recapitoSeparato ? (
          <p className="m-0 text-[0.9375rem] text-ink-soft">{t("riepilogo.dati.sezione8Vuota")}</p>
        ) : null}

        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {righe.map((riga) => (
            <li
              key={riga.casella}
              className="flex flex-col gap-1 border border-rule bg-paper px-3 py-2"
            >
              <p className="m-0 flex flex-wrap items-baseline gap-2">
                <span className="rounded border border-rule bg-paper-warm px-2 py-1 font-mono text-[0.8125rem] text-ink-soft">
                  {t("campo.casella")} {riga.casella}
                </span>
                <span className="text-[0.9375rem] text-ink-soft">{t(riga.labelKey)}</span>
                {riga.officialKey ? (
                  <span lang="it" className="font-mono text-[0.875rem] text-ink-soft">
                    {t(riga.officialKey)}
                  </span>
                ) : null}
              </p>
              <p className="m-0 text-[1.125rem] font-semibold">
                {riga.value !== "" ? (
                  riga.value
                ) : (
                  <span className="font-normal italic text-ink-soft">
                    {t("riepilogo.dati.vuota")}
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
        <SourceNote source="F11" detail="MOD. 209 Modulo 1" />
      </section>

      {/* 2 — gli errori evitati (A-13) */}
      <section className="flex flex-col gap-3" aria-labelledby="riepilogo-evitati">
        <h2 id="riepilogo-evitati" className="m-0 text-[1.25rem] font-semibold">
          {t("riepilogo.evitati.titolo")}
        </h2>
        <p className="m-0">{t("riepilogo.evitati.intro")}</p>
        {evitati.length > 0 ? (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {evitati.map((key) => (
              <li
                key={key}
                className="flex gap-2 border-l-[3px] border-ok bg-paper px-3 py-2"
              >
                <span aria-hidden="true" className="font-semibold text-ok">
                  ✓
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0">{t("riepilogo.evitati.nessuno")}</p>
        )}
      </section>

      {/* Cosa resta aperto: si dice, non si nasconde. */}
      {aperti.length > 0 ? (
        <section className="flex flex-col gap-3" aria-labelledby="riepilogo-aperti">
          <h2 id="riepilogo-aperti" className="m-0 text-[1.25rem] font-semibold">
            {t("riepilogo.aperti.titolo")}
          </h2>
          <p className="m-0">{t("riepilogo.aperti.intro")}</p>
          {aperti.map((issue, n) => (
            <IssueBlock key={`${issue.code}-${n}`} id={`aperto-${n}`} issue={issue} />
          ))}
        </section>
      ) : null}

      {/* 3 — prima di chiudere la busta */}
      <section className="flex flex-col gap-4" aria-labelledby="riepilogo-busta">
        <h2 id="riepilogo-busta" className="m-0 text-[1.25rem] font-semibold">
          {t("riepilogo.busta.titolo")}
        </h2>

        {/* La firma, casella 29 — in evidenza, e resta in stampa. */}
        <div className="flex flex-col gap-2 border-l-[3px] border-alert bg-alert-weak px-4 py-3">
          <h3 className="m-0 text-[1.125rem] font-semibold">
            {t("campo.casella")} {CASELLA_FIRMA} · {t("riepilogo.firma.titolo")}
          </h3>
          <p className="m-0">{t("riepilogo.firma.testo")}</p>
          <blockquote
            lang="it"
            className="m-0 border-l-2 border-rule pl-3 font-mono text-[0.9375rem] text-ink-soft"
          >
            «{t("riepilogo.firma.ufficiale")}»
          </blockquote>
          <label
            htmlFor="firma-fatta"
            className="flex min-h-[44px] cursor-pointer items-start gap-3 py-1"
          >
            <input
              id="firma-fatta"
              type="checkbox"
              checked={conferme.signatureConfirmed}
              onChange={(e) => updateConferme({ signatureConfirmed: e.target.checked })}
              className="mt-1 h-6 w-6 shrink-0"
            />
            <span className="text-base font-semibold">{t("riepilogo.firma.checkbox")}</span>
          </label>
          {firmaIssue ? <IssueBlock id="issue-firma" issue={firmaIssue} /> : null}
          <SourceNote source="F2" detail="Foglio Note, casella 29" />
        </div>

        {/* La casella 25: una PROPOSTA, con il conto aperto. */}
        <div className="flex flex-col gap-2 border border-rule bg-paper px-4 py-3">
          <h3 className="m-0 text-[1.125rem] font-semibold">
            {t("campo.casella")} {CASELLA_FOGLI} · {t("riepilogo.fogli.titolo")}
          </h3>
          <p className="m-0 text-[1.25rem] font-semibold">
            {fill(t("riepilogo.fogli.proposta"), { n: fogli.proposed })}
          </p>
          <p className="m-0">{t("riepilogo.fogli.avviso")}</p>

          <button
            type="button"
            aria-expanded={dettaglioFogli}
            aria-controls="dettaglio-fogli"
            onClick={() => setDettaglioFogli((v) => !v)}
            className="no-print inline-flex min-h-[44px] items-center self-start rounded px-1 text-base font-semibold text-accent underline underline-offset-4"
          >
            {t("riepilogo.fogli.dettaglio")}
          </button>

          <div id="dettaglio-fogli" hidden={!dettaglioFogli}>
            <table className="w-full border-collapse border border-rule text-left text-base">
              <caption className="mb-2 text-left text-[0.9375rem] text-ink-soft">
                {t("riepilogo.fogli.tabella.caption")}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="border border-rule px-3 py-2 font-semibold">
                    {t("riepilogo.fogli.col.voce")}
                  </th>
                  <th scope="col" className="border border-rule px-3 py-2 font-semibold">
                    {t("riepilogo.fogli.col.fogli")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {fogli.breakdown.map((riga, n) => {
                  const nome = t(`riepilogo.foglio.${riga.label}`);
                  const doc = t(`doc.${riga.label}.semplice`);
                  const etichetta = nome.startsWith("riepilogo.foglio.")
                    ? doc.startsWith("doc.")
                      ? riga.label
                      : doc
                    : nome;
                  return (
                    <tr key={`${riga.label}-${n}`}>
                      <th scope="row" className="border border-rule px-3 py-2 font-normal">
                        {etichetta}
                      </th>
                      <td className="border border-rule px-3 py-2 [font-variant-numeric:tabular-nums]">
                        {riga.sheets}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <label
            htmlFor="fogli-confermati"
            className="flex min-h-[44px] cursor-pointer items-start gap-3 py-1"
          >
            <input
              id="fogli-confermati"
              type="checkbox"
              checked={conferme.sheetCountConfirmed}
              onChange={(e) => updateConferme({ sheetCountConfirmed: e.target.checked })}
              className="mt-1 h-6 w-6 shrink-0"
            />
            <span className="text-base font-semibold">{t("riepilogo.fogli.conferma")}</span>
          </label>
          {fogliIssue ? <IssueBlock id="issue-fogli" issue={fogliIssue} /> : null}
          {/* Il numero di fogli dei due moduli non ha una fonte ufficiale: per
              questo e' una proposta da confermare, e il limite e' dichiarato
              su /limiti. Nessun marcatore accanto al numero. */}
        </div>

        {/* Fotocopie A4 e busta aperta — R-25. */}
        <div className="flex flex-col gap-2 border border-rule bg-paper px-4 py-3">
          <h3 className="m-0 text-[1.125rem] font-semibold">{t("riepilogo.fotocopie.titolo")}</h3>
          <p className="m-0">{t("riepilogo.fotocopie.testo")}</p>
          <p className="m-0 font-semibold">{t("riepilogo.fotocopie.bustaAperta")}</p>
          <SourceNote source="F1" detail="§A · F2" />
        </div>

        {/* Gli allegati, con la casella da spuntare a penna. */}
        <div className="flex flex-col gap-2">
          <h3 className="m-0 text-[1.125rem] font-semibold">{t("riepilogo.allegati.titolo")}</h3>
          <p className="m-0">{t("riepilogo.allegati.intro")}</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {requisiti.map((req) => {
              const spuntato = checkedDocs.includes(req.id);
              return (
                <li
                  key={req.id}
                  className="flex items-start gap-3 border border-rule bg-paper px-3 py-2"
                >
                  {/* Quadrato vuoto: a schermo dice lo stato, in stampa si spunta a penna. */}
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-block h-5 w-5 shrink-0 border-2 border-ink text-center text-[0.875rem] leading-4"
                  >
                    {spuntato ? "✓" : ""}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold">{t(`doc.${req.id}.semplice`)}</span>
                    <span lang="it" className="font-mono text-[0.875rem] text-ink-soft">
                      {req.official}
                    </span>
                    <span className="text-[0.9375rem] text-ink-soft">
                      {spuntato
                        ? t("riepilogo.allegati.pronto")
                        : t("riepilogo.allegati.daPreparare")}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <SourceNote source="F1" detail="§A · R-33: checklist tipo, le Questure variano" />
        </div>

        {/* Quanto si paga: le somme le fa feesFor(), qui si formattano. */}
        <div className="flex flex-col gap-1 border border-rule bg-paper px-4 py-3">
          <h3 className="m-0 text-[1.125rem] font-semibold">{t("riepilogo.costi.titolo")}</h3>
          <p className="m-0">
            {fill(t("riepilogo.costi.bollettino"), {
              importo: formatEuro(fees.bollettino.totalCents, lang),
            })}
          </p>
          <p className="m-0">
            {fill(t("riepilogo.costi.cassa"), {
              importo: formatEuro(fees.cash.totalCents, lang),
            })}
          </p>
          <p className="m-0 text-[0.9375rem] text-ink-soft">
            {fill(t("riepilogo.costi.durata"), { durata: t(`fee.durata.${answers.durata}`) })}
          </p>
          <SourceNote source="F6" detail="F1 · F5" />
          <Link
            href="/costi"
            className="no-print inline-flex min-h-[44px] items-center self-start text-base font-semibold text-accent underline underline-offset-4"
          >
            {t("riepilogo.costi.vaiAiCosti")}
          </Link>
        </div>
      </section>

      {/* 4 — cosa succede dopo (A-14) */}
      <section className="flex flex-col gap-4" aria-labelledby="riepilogo-dopo">
        <h2 id="riepilogo-dopo" className="m-0 text-[1.25rem] font-semibold">
          {t("riepilogo.dopo.titolo")}
        </h2>

        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-[1.125rem] font-semibold">{t("riepilogo.dopo.dove.titolo")}</h3>
          <p className="m-0">{t("riepilogo.dopo.dove.testo")}</p>
          <p className="m-0">{t("riepilogo.dopo.dove.diPersona")}</p>
          <SourceNote source="F5" detail="F3" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-[1.125rem] font-semibold">{t("riepilogo.dopo.ricevi.titolo")}</h3>
          <p className="m-0">{t("riepilogo.dopo.ricevi.ricevuta")}</p>
          <p className="m-0">{t("riepilogo.dopo.ricevi.convocazione")}</p>
          <p className="m-0">{t("riepilogo.dopo.ricevi.agendaPiena")}</p>
          <SourceNote source="F3" detail="F5" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-[1.125rem] font-semibold">
            {t("riepilogo.dopo.conserva.titolo")}
          </h3>
          <p className="m-0">{t("riepilogo.dopo.conserva.testo")}</p>
          <p className="m-0">{t("riepilogo.dopo.conserva.valore")}</p>
          <SourceNote source="F4" />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="m-0 text-[1.125rem] font-semibold">{t("riepilogo.dopo.porta.titolo")}</h3>
          <p className="m-0">{t("riepilogo.dopo.porta.intro")}</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {DA_PORTARE.map((voce) => {
              const id = `porta-${voce.id}`;
              return (
                <li
                  key={voce.id}
                  className={[
                    "border px-3 py-2",
                    voce.evidenza ? "border-warn bg-warn-weak" : "border-rule bg-paper",
                  ].join(" ")}
                >
                  <label
                    htmlFor={id}
                    className="flex min-h-[44px] cursor-pointer items-start gap-3 py-1"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={conferme.convocazione.includes(voce.id)}
                      onChange={(e) => toggleDaPortare(voce.id, e.target.checked)}
                      className="mt-1 h-6 w-6 shrink-0"
                    />
                    <span className={voce.evidenza ? "font-semibold" : ""}>{t(voce.key)}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <SourceNote source="F1" detail="§B · F4" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-[1.125rem] font-semibold">{t("riepilogo.dopo.tempi.titolo")}</h3>
          <p className="m-0">{t("riepilogo.dopo.tempi.testo")}</p>
          <p className="m-0 text-[0.9375rem] text-ink-soft">
            {t("riepilogo.dopo.tempi.nonPromessa")}
          </p>
          <SourceNote source="F4" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-[1.125rem] font-semibold">{t("riepilogo.dopo.stato.titolo")}</h3>
          <p className="m-0">{t("riepilogo.dopo.stato.testo")}</p>
          <p className="m-0">{t("riepilogo.dopo.stato.numeroVerde")}</p>
          <SourceNote source="F3" detail="F5 · F15" />
        </div>

        <div className="flex flex-col gap-1 border-l-[3px] border-accent bg-accent-weak px-4 py-3">
          <h3 className="m-0 text-[1.125rem] font-semibold">{t("riepilogo.gratuito.titolo")}</h3>
          <p className="m-0">{t("riepilogo.gratuito.testo")}</p>
          <p className="m-0">{t("riepilogo.gratuito.numeroVerde")}</p>
          <SourceNote source="F3" detail="F5" />
        </div>
      </section>

      {/* 5 — dove si va da qui. La rotta /prima e' tagliata (D-17): niente link. */}
      <section className="no-print flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/limiti"
            className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
          >
            {t("riepilogo.limiti.link")}
          </Link>
          <Link
            href="/documenti"
            className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
          >
            {t("riepilogo.indietro")}
          </Link>
        </div>
      </section>
    </div>
  );
}
