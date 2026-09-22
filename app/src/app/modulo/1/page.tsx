"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FieldCard } from "@/components/FieldCard";
import { useT } from "@/components/LanguageProvider";
import { SourceNote } from "@/components/SourceNote";
import { JourneyProgress } from "@/components/JourneyProgress";

import type { Issue } from "@/domain/types";
import { issuesForField, validateAll } from "@/domain/validators";
import { useStoredAnswers } from "@/app/percorso/answers";
import { toAnswersConModulo, useModuloAnswers } from "../modulo-answers";

/**
 * MOD. 209 · Modulo 1 · caselle 3 e 4 (A-08, docs/specs/B4A-modulo-1-4.md).
 *
 * Il nome nell'ordine del passaporto: la nota (a) chiede di riportare il dato
 * come e' scritto sul passaporto, e nella MRZ il cognome viene prima.
 *
 * Nessuna regola e' riscritta qui: gli avvisi arrivano da `validateAll`
 * (che al suo interno chiama `validateName`) filtrati con `issuesForField`.
 */

const CASELLA_COGNOME = 3;
const CASELLA_NOME = 4;

/** Dati palesemente finti: nessun dato reale entra nel repo. */
const MRZ_ESEMPIO = {
  prefisso: "P<XXX",
  cognome: "COGNOMEDIPROVA",
  separatore: "<<",
  nome: "NOMEDIPROVA",
  coda: "<<<<<<<<<<<<",
};

export default function Modulo1Page() {
  const t = useT();
  const { answers, today, ready } = useStoredAnswers();
  const { modulo, mounted, update } = useModuloAnswers();
  const [issues, setIssues] = useState<Issue[]>([]);

  const valida = useCallback(() => {
    if (!today) return;
    setIssues(validateAll(toAnswersConModulo(answers, modulo), today));
  }, [answers, modulo, today]);

  // Al rientro nella pagina gli avvisi gia' guadagnati restano: il passo
  // indietro non perde nulla.
  useEffect(() => {
    if (!ready || !mounted || !today) return;
    if (modulo.cognome === "" && modulo.nome === "") {
      setIssues([]);
      return;
    }
    setIssues(validateAll(toAnswersConModulo(answers, modulo), today));
    // volutamente solo al primo momento utile: dopo, la validazione e' al blur
  }, [ready, mounted, today]);


  return (
    <div className="flex flex-col gap-6">
      {/* L'avanzamento e' quello della catena intera: le sette schermate del
          Modulo 1 non esistono tutte, e dire «passo 1 di 7» sarebbe falso. */}
      <JourneyProgress route="/modulo/1" />

      <h1
        id="titolo-pagina"
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t("modulo.1.h1")}
      </h1>

      <p className="m-0">{t("modulo.1.intro")}</p>

      {/* L'esempio che rende autoesplicativa la coppia di caselle: la MRZ. */}
      <section
        aria-labelledby="mrz-titolo"
        className="flex flex-col gap-3 border-l-[3px] border-accent bg-accent-weak px-4 py-4"
      >
        <h2 id="mrz-titolo" className="m-0 text-[1.125rem] font-semibold">
          {t("modulo.1.mrz.titolo")}
        </h2>
        <p className="m-0">{t("modulo.1.mrz.spiega")}</p>

        <p className="m-0 overflow-x-auto whitespace-nowrap font-mono text-[0.9375rem]">
          <span>{MRZ_ESEMPIO.prefisso}</span>
          <span className="sr-only"> {t("modulo.1.mrz.leggenda.cognome")}: </span>
          <span className="bg-paper font-semibold underline decoration-2 underline-offset-4">
            {MRZ_ESEMPIO.cognome}
          </span>
          <span>{MRZ_ESEMPIO.separatore}</span>
          <span className="sr-only"> {t("modulo.1.mrz.leggenda.nome")}: </span>
          <span className="bg-paper font-semibold underline decoration-2 underline-offset-4">
            {MRZ_ESEMPIO.nome}
          </span>
          <span>{MRZ_ESEMPIO.coda}</span>
        </p>

        <dl className="m-0 flex flex-col gap-1 text-[0.9375rem]">
          <div className="flex flex-wrap gap-2">
            <dt className="font-mono font-semibold">{MRZ_ESEMPIO.prefisso}</dt>
            <dd className="m-0">{t("modulo.1.mrz.leggenda.stato")}</dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="font-mono font-semibold">{MRZ_ESEMPIO.cognome}</dt>
            <dd className="m-0">{t("modulo.1.mrz.leggenda.cognome")}</dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="font-mono font-semibold">{MRZ_ESEMPIO.separatore}</dt>
            <dd className="m-0">{t("modulo.1.mrz.leggenda.separatore")}</dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="font-mono font-semibold">{MRZ_ESEMPIO.nome}</dt>
            <dd className="m-0">{t("modulo.1.mrz.leggenda.nome")}</dd>
          </div>
        </dl>

        <p className="m-0 text-[0.9375rem] text-ink-soft">{t("modulo.1.mrz.finto")}</p>
      </section>

      <FieldCard
        casella={CASELLA_COGNOME}
        labelKey="campo.3.plain"
        officialKey="campo.3.official"
        noteKey="nota.a"
        whyKey="campo.3.why"
        exampleKey="campo.3.example"
        issues={issuesForField(issues, CASELLA_COGNOME)}
        value={modulo.cognome}
        onChange={(v) => update({ cognome: v })}
        onBlur={valida}
        source="F2"
        sourceDetail="Foglio Note, nota (a)"
        officialSource="F11"
        autoComplete="family-name"
      />

      <FieldCard
        casella={CASELLA_NOME}
        labelKey="campo.4.plain"
        officialKey="campo.4.official"
        noteKey="nota.a"
        whyKey="campo.4.why"
        exampleKey="campo.4.example"
        issues={issuesForField(issues, CASELLA_NOME)}
        value={modulo.nome}
        onChange={(v) => update({ nome: v })}
        onBlur={valida}
        source="F2"
        sourceDetail="Foglio Note, nota (a)"
        officialSource="F11"
        autoComplete="given-name"
      />

      {/* Campo facoltativo: senza MRZ la pagina funziona e non si dice nulla. */}
      <section className="flex flex-col gap-2 rounded border border-rule bg-paper p-4">
        <label htmlFor="mrz" className="m-0 text-[1.125rem] font-semibold leading-snug">
          {t("modulo.1.mrz.label")}
        </label>
        <p className="m-0">{t("modulo.1.mrz.why")}</p>
        <input
          id="mrz"
          type="text"
          value={modulo.mrz}
          onChange={(e) => update({ mrz: e.target.value })}
          onBlur={valida}
          aria-describedby="mrz-aiuto"
          className="min-h-[48px] w-full rounded border border-rule bg-paper px-3 py-2 font-mono text-base text-ink focus:border-2 focus:border-accent"
        />
        <p id="mrz-aiuto" className="m-0 text-[0.9375rem] text-ink-soft">
          {t("modulo.1.mrz.aiuto")}
        </p>
        <SourceNote source="F2" detail="Foglio Note, nota (a)" />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/costi"
          className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
        >
          {t("modulo.1.indietroCosti")}
        </Link>
        <Link
          href="/modulo/4"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("modulo.1.avanti")}
        </Link>
      </div>

      <p className="m-0 text-[0.9375rem] text-ink-soft">{t("modulo.salto")}</p>
    </div>
  );
}
