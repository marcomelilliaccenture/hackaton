"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FieldCard } from "@/components/FieldCard";
import { IssueBlock } from "@/components/IssueBlock";
import { useLangAttr, useT } from "@/components/LanguageProvider";
import { SourceNote } from "@/components/SourceNote";
import { JourneyProgress } from "@/components/JourneyProgress";
import { PROVINCE_CAP } from "@/data/province";
import { needsModulo2, stepsFor } from "@/domain/form-model";
import type { Issue } from "@/domain/types";
import { issuesForField, validateAll } from "@/domain/validators";
import { useStoredAnswers } from "@/app/percorso/answers";
import {
  toAnswersConModulo,
  useModuloAnswers,
  type SceltaRecapito,
} from "../modulo-answers";

/**
 * MOD. 209 · Modulo 1 · sezione 8, caselle 76-84 (A-09, A-10, A-11).
 *
 * La 76 e' l'intestazione della sezione 8 (nota q) e non e' un campo: il primo
 * campo compilabile e' la 77, PRESSO (nota r). Il CAP e' la 84.
 *
 * Qui arriva la raccomandata con cui la Questura convoca per foto e impronte
 * (R-27, F3): e' il punto in cui oggi una pratica si perde in silenzio.
 *
 * Nessuna regola e' riscritta in pagina: gli esiti arrivano da `validateAll`
 * (che chiama `validateCommunicationAddress`) filtrati con `issuesForField`.
 */

const CASELLA_SEZIONE_8 = 76;
const CASELLA_PRESSO = 77;
const CASELLA_PROVINCIA = 78;
const CASELLA_COMUNE = 79;
const CASELLA_INDIRIZZO = 80;
const CASELLA_CIVICO = 81;
const CASELLA_SCALA = 82;
const CASELLA_INTERNO = 83;
const CASELLA_CAP = 84;
const CASELLA_INDIRIZZO_SEZIONE_7 = 68;

export default function Modulo4Page() {
  const t = useT();
  const langIt = useLangAttr();
  const { answers, today, ready } = useStoredAnswers();
  const { modulo, mounted, update } = useModuloAnswers();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [capConfermato, setCapConfermato] = useState(false);

  const valida = useCallback(() => {
    if (!today) return;
    setIssues(validateAll(toAnswersConModulo(answers, modulo), today));
  }, [answers, modulo, today]);

  // Al rientro nella pagina si rilegge quello che c'era: il passo indietro non
  // perde nulla. Dopo, la validazione scatta al blur.
  useEffect(() => {
    if (!ready || !mounted || !today) return;
    if (modulo.sceltaRecapito === null) {
      setIssues([]);
      return;
    }
    setIssues(validateAll(toAnswersConModulo(answers, modulo), today));
  }, [ready, mounted, today]);

  function scegli(scelta: SceltaRecapito) {
    update({ sceltaRecapito: scelta });
    setCapConfermato(false);
    // Scegliere e' una conferma, e la validazione scatta anche li' (ux-spec §4).
    // Solo per "stesso": scegliere "altro" apre caselle ancora da compilare, e
    // un errore su un campo mai toccato non si mostra.
    if (scelta === "stesso" && today) {
      const dopoLaScelta = { ...modulo, sceltaRecapito: scelta };
      setIssues(validateAll(toAnswersConModulo(answers, dopoLaScelta), today));
    } else {
      setIssues([]);
    }
  }

  /** Il CAP di un'altra provincia e' un avviso superabile: qui si supera. */
  const capIssues = issuesForField(issues, CASELLA_CAP).filter(
    (i) => !(capConfermato && i.code === "ADDRESS_PROVINCE_MISMATCH")
  );
  const mismatchDaConfermare =
    !capConfermato &&
    issuesForField(issues, CASELLA_CAP).some((i) => i.code === "ADDRESS_PROVINCE_MISMATCH");

  const pressoIssues = issuesForField(issues, CASELLA_PRESSO);
  const erroreSenzaRecapito = pressoIssues.filter((i) => i.severity === "error");

  const domainAnswers = toAnswersConModulo(answers, modulo);
  const dopoIModuli = stepsFor(domainAnswers).find((s) => s.id === "fotocopie")?.route ?? "/documenti";
  const ancheModulo2 = needsModulo2(domainAnswers);

  const opzioniProvincia = PROVINCE_CAP.map((p) => ({
    value: p.sigla,
    label: `${p.nome} (${p.sigla})`,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* L'avanzamento e' quello della catena intera (vedi /modulo/1). */}
      <JourneyProgress route="/modulo/4" />

      {/* La domanda, prima di tutto. Il nome burocratico viene dopo. */}
      <h1
        id="titolo-pagina"
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t("modulo.4.h1")}
      </h1>

      <div className="flex flex-col gap-2 border-l-[3px] border-accent bg-accent-weak px-4 py-4">
        <p className="m-0 font-semibold">{t("modulo.4.perche")}</p>
        <p className="m-0">{t("modulo.4.perche.seconda")}</p>
        <SourceNote source="F3" />
      </div>

      {/* Il nome burocratico della sezione: casella 76, intestazione, non campo. */}
      <section aria-labelledby="sezione-8" className="flex flex-col gap-2">
        <h2 id="sezione-8" className="m-0 text-[1.125rem] font-semibold">
          {t("modulo.4.sezione8.titolo")}
        </h2>
        <p className="m-0 flex flex-wrap items-center gap-2">
          <span className="rounded border border-rule bg-paper-warm px-2 py-1 font-mono text-[0.8125rem] text-ink-soft">
            {t("campo.casella")} {CASELLA_SEZIONE_8}
          </span>
          <span
            lang={langIt("modulo.4.sezione8.official")}
            className="font-mono text-[0.9375rem] text-ink-soft"
          >
            {t("modulo.4.sezione8.official")}
          </span>
        </p>
        <p className="m-0 text-[0.9375rem] text-ink-soft">
          {t("modulo.4.sezione8.nonCompilabile")}
        </p>
        <SourceNote source="F11" detail="MOD. 209 Modulo 1, n. 76" />
      </section>

      {/* Sezione 7: serve a sapere se un indirizzo esiste gia' da qualche parte. */}
      <FieldCard
        casella={CASELLA_INDIRIZZO_SEZIONE_7}
        labelKey="campo.68.plain"
        officialKey="campo.68.official"
        whyKey="campo.68.why"
        exampleKey="campo.68.example"
        issues={[]}
        value={modulo.residenzaIndirizzo}
        onChange={(v) => update({ residenzaIndirizzo: v })}
        onBlur={valida}
        source="F11"
        officialSource="F11"
        autoComplete="street-address"
      />

      {/* La nota (q) come scelta, non come omissione. */}
      <fieldset className="m-0 flex flex-col gap-3 rounded border border-rule bg-paper p-4">
        <legend className="px-1 text-[1.125rem] font-semibold">{t("modulo.4.scelta.label")}</legend>
        {(
          [
            { value: "stesso", labelKey: "modulo.4.scelta.stesso", notaKey: "modulo.4.scelta.stesso.nota" },
            { value: "altro", labelKey: "modulo.4.scelta.altro", notaKey: "modulo.4.scelta.altro.nota" },
          ] as { value: SceltaRecapito; labelKey: string; notaKey: string }[]
        ).map((o) => {
          const id = `recapito-${o.value}`;
          return (
            <div
              key={o.value}
              className={[
                "flex items-start gap-3 rounded border p-3",
                modulo.sceltaRecapito === o.value
                  ? "border-accent bg-accent-weak"
                  : "border-rule bg-paper",
              ].join(" ")}
            >
              <input
                type="radio"
                id={id}
                name="recapito"
                value={o.value}
                checked={modulo.sceltaRecapito === o.value}
                onChange={() => scegli(o.value)}
                aria-describedby={`${id}-nota`}
                className="mt-1 h-6 w-6 shrink-0"
              />
              <label htmlFor={id} className="flex min-h-[44px] flex-col justify-center gap-1 text-base">
                <span className="font-semibold">{t(o.labelKey)}</span>
                <span id={`${id}-nota`} className="text-[0.9375rem] text-ink-soft">
                  {t(o.notaKey)}
                </span>
              </label>
            </div>
          );
        })}
        <blockquote
          lang={langIt("nota.q")}
          className="m-0 border-l-2 border-rule pl-3 font-mono text-[0.9375rem] text-ink-soft"
        >
          «{t("nota.q")}»
        </blockquote>
        <SourceNote source="F2" detail="Foglio Note, nota (q)" />
      </fieldset>

      {/* L'unico errore bloccante: nessun indirizzo, da nessuna parte. */}
      {modulo.sceltaRecapito === "stesso"
        ? erroreSenzaRecapito.map((issue, n) => (
            <IssueBlock key={`${issue.code}-${n}`} id={`senza-recapito-${n}`} issue={issue} />
          ))
        : null}

      {modulo.sceltaRecapito === "altro" ? (
        <div className="flex flex-col gap-6">
          <FieldCard
            casella={CASELLA_PRESSO}
            labelKey="campo.77.plain"
            officialKey="campo.77.official"
            noteKey="nota.r"
            whyKey="campo.77.why"
            exampleKey="campo.77.example"
            issues={pressoIssues}
            value={modulo.presso}
            onChange={(v) => update({ presso: v })}
            onBlur={valida}
            source="F2"
            sourceDetail="Foglio Note, nota (r)"
            officialSource="F11"
          />

          <FieldCard
            casella={CASELLA_PROVINCIA}
            labelKey="campo.78.plain"
            officialKey="campo.78.official"
            noteKey="nota.78"
            whyKey="campo.78.why"
            exampleKey="campo.78.example"
            issues={issuesForField(issues, CASELLA_PROVINCIA)}
            value={modulo.provincia}
            onChange={(v) => {
              update({ provincia: v });
              setCapConfermato(false);
            }}
            onBlur={valida}
            source="F2"
            sourceDetail="Foglio Note, nota (b)"
            officialSource="F11"
            options={opzioniProvincia}
            emptyOptionKey="percorso.4.scegli"
          />

          <FieldCard
            casella={CASELLA_COMUNE}
            labelKey="campo.79.plain"
            officialKey="campo.79.official"
            whyKey="campo.79.why"
            exampleKey="campo.79.example"
            issues={issuesForField(issues, CASELLA_COMUNE)}
            value={modulo.comune}
            onChange={(v) => update({ comune: v })}
            onBlur={valida}
            source="F11"
            officialSource="F11"
          />

          <FieldCard
            casella={CASELLA_INDIRIZZO}
            labelKey="campo.80.plain"
            officialKey="campo.80.official"
            whyKey="campo.80.why"
            exampleKey="campo.80.example"
            issues={issuesForField(issues, CASELLA_INDIRIZZO)}
            value={modulo.indirizzo}
            onChange={(v) => update({ indirizzo: v })}
            onBlur={valida}
            source="F11"
            officialSource="F11"
            autoComplete="street-address"
          />

          <FieldCard
            casella={CASELLA_CIVICO}
            labelKey="campo.81.plain"
            officialKey="campo.81.official"
            whyKey="campo.81.why"
            exampleKey="campo.81.example"
            issues={issuesForField(issues, CASELLA_CIVICO)}
            value={modulo.civico}
            onChange={(v) => update({ civico: v })}
            onBlur={valida}
            source="F11"
            officialSource="F11"
          />

          <FieldCard
            casella={CASELLA_SCALA}
            labelKey="campo.82.plain"
            officialKey="campo.82.official"
            whyKey="campo.82.why"
            exampleKey="campo.82.example"
            issues={issuesForField(issues, CASELLA_SCALA)}
            value={modulo.scala}
            onChange={(v) => update({ scala: v })}
            onBlur={valida}
            source="F11"
            officialSource="F11"
          />

          <FieldCard
            casella={CASELLA_INTERNO}
            labelKey="campo.83.plain"
            officialKey="campo.83.official"
            whyKey="campo.83.why"
            exampleKey="campo.83.example"
            issues={issuesForField(issues, CASELLA_INTERNO)}
            value={modulo.interno}
            onChange={(v) => update({ interno: v })}
            onBlur={valida}
            source="F11"
            officialSource="F11"
          />

          <FieldCard
            casella={CASELLA_CAP}
            labelKey="campo.84.plain"
            officialKey="campo.84.official"
            whyKey="campo.84.why"
            exampleKey="campo.84.example"
            issues={capIssues}
            value={modulo.cap}
            onChange={(v) => {
              update({ cap: v });
              setCapConfermato(false);
            }}
            onBlur={valida}
            source="F11"
            officialSource="F11"
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={5}
          />
        </div>
      ) : null}

      {/* Un avviso non blocca: accanto a Continua si conferma e si va avanti. */}
      <p aria-live="polite" className="m-0 text-base text-ok">
        {capConfermato ? t("modulo.4.capConfermato") : ""}
      </p>

      {ancheModulo2 ? (
        <p className="m-0 text-[0.9375rem] text-ink-soft">{t("modulo.4.ancheModulo2")}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/modulo/1"
          className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
        >
          {t("modulo.4.indietro")}
        </Link>
        <Link
          href={dopoIModuli}
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("modulo.4.avanti")}
        </Link>
        {mismatchDaConfermare ? (
          <button
            type="button"
            onClick={() => setCapConfermato(true)}
            className="inline-flex min-h-[48px] items-center rounded border border-warn px-5 py-3 text-base font-semibold text-warn"
          >
            {t("modulo.4.hoControllato")}
          </button>
        ) : null}
      </div>

      <p className="m-0 text-[0.9375rem] text-ink-soft">{t("modulo.salto")}</p>
    </div>
  );
}
