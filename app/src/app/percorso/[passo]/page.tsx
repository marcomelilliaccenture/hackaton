"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ExplainPanel } from "@/components/ExplainPanel";
import { IssueBlock } from "@/components/IssueBlock";
import { useLangAttr, useT } from "@/components/LanguageProvider";
import { SourceNote } from "@/components/SourceNote";
import { StepProgress } from "@/components/StepProgress";
import { PROVINCE_CAP } from "@/data/province";
import { MOTIVI, motivoByCode } from "@/data/motivi";
import type { PresentedBy } from "@/domain/routing";
import type { Issue, MotivoCode } from "@/domain/types";
import { issuesForField, validateAll } from "@/domain/validators";
import { fill, toDomainAnswers, useStoredAnswers } from "../answers";

/**
 * Le cinque domande di /percorso: una per schermata, una URL per passo
 * (A-02, docs/specs/B2B). Le risposte vivono in localStorage e sopravvivono
 * al refresh; il tasto Indietro del browser fa il passo indietro.
 *
 * Nessuna regola di dominio e' riscritta qui: la data di ingresso la valida
 * `validateAll` (casella 48), l'instradamento lo decide /dove con `channelFor`.
 */

const TOTALE_PASSI = 5;
const CASELLA_INGRESSO = 48;
const CASELLA_PROVINCIA = 5;
const CASELLA_MOTIVO = 16;

const ETICHETTE_PASSI = [
  "percorso.passo.motivo",
  "percorso.passo.chiPresenta",
  "percorso.passo.ingresso",
  "percorso.passo.provincia",
  "percorso.passo.reddito",
];

interface Opzione {
  value: string;
  labelKey: string;
  hintKey?: string;
}

/** Gruppo di radio native: target da 44px, etichetta cliccabile. */
function RadioGroup({
  name,
  value,
  options,
  onChange,
  labelledBy,
}: {
  name: string;
  value: string | null;
  options: Opzione[];
  onChange: (value: string) => void;
  labelledBy: string;
}) {
  const t = useT();
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-col gap-3">
      {options.map((o) => {
        const id = `${name}-${o.value}`;
        const hintId = o.hintKey ? `${id}-nota` : undefined;
        return (
          <div
            key={o.value}
            className={[
              "flex items-start gap-3 rounded border p-3",
              value === o.value ? "border-accent bg-accent-weak" : "border-rule bg-paper",
            ].join(" ")}
          >
            <input
              type="radio"
              id={id}
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              aria-describedby={hintId}
              className="mt-1 h-6 w-6 shrink-0"
            />
            <label htmlFor={id} className="flex min-h-[44px] flex-col justify-center gap-1 text-base">
              <span className="font-semibold">{t(o.labelKey)}</span>
              {o.hintKey ? (
                <span id={hintId} className="text-[0.9375rem] text-ink-soft">
                  {t(o.hintKey)}
                </span>
              ) : null}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default function PercorsoPassoPage() {
  const t = useT();
  const langIt = useLangAttr();
  const router = useRouter();
  const params = useParams<{ passo: string }>();
  const passo = Number(params?.passo);

  const { answers, today, ready, update } = useStoredAnswers();
  const [dateIssues, setDateIssues] = useState<Issue[]>([]);
  const [bloccato, setBloccato] = useState(false);
  const [explainIngresso, setExplainIngresso] = useState(false);
  const titolo = useRef<HTMLHeadingElement>(null);
  const primoRender = useRef(true);

  // Cambio di passo = cambio di pagina: il focus va sul titolo nuovo. Non si
  // sposta mai durante la compilazione.
  useEffect(() => {
    if (primoRender.current) {
      primoRender.current = false;
      return;
    }
    titolo.current?.focus();
  }, [passo]);

  // Le risposte arrivano dal localStorage dopo il mount: finche' non sono qui
  // la data non si puo' validare.
  useEffect(() => {
    if (!ready || !today) return;
    if (!answers.entryDate) {
      setDateIssues([]);
      return;
    }
    setDateIssues(issuesForField(validateAll(toDomainAnswers(answers), today), CASELLA_INGRESSO));
  }, [ready, today, answers]);

  if (!Number.isInteger(passo) || passo < 1 || passo > TOTALE_PASSI) {
    return (
      <div className="flex flex-col gap-6">
        <h1 id="titolo-pagina" tabIndex={-1} className="m-0 text-[1.5rem] font-semibold">
          {t("percorso.passoInesistente.h1")}
        </h1>
        <p className="m-0">{t("percorso.passoInesistente.testo")}</p>
        <Link
          href="/percorso/1"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("percorso.passoInesistente.cta")}
        </Link>
      </div>
    );
  }

  const haErroreBloccante = passo === 3 && dateIssues.some((i) => i.severity === "error");
  const indietroHref = passo === 1 ? "/percorso" : `/percorso/${passo - 1}`;
  const avantiHref = passo === TOTALE_PASSI ? "/dove" : `/percorso/${passo + 1}`;

  function continua() {
    if (haErroreBloccante) {
      setBloccato(true);
      return;
    }
    setBloccato(false);
    router.push(avantiHref);
  }

  const motivoScelto = answers.motivo ? motivoByCode(answers.motivo) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <StepProgress current={passo} total={TOTALE_PASSI} labelKeys={ETICHETTE_PASSI} minutes={3} />

      <h1
        id="titolo-pagina"
        ref={titolo}
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t(`percorso.${passo}.domanda`)}
      </h1>

      {/* 1 — perche' sei in Italia (casella 16) */}
      {passo === 1 ? (
        <section className="flex flex-col gap-4">
          <p className="m-0 flex flex-wrap items-center gap-2">
            <span className="rounded border border-rule bg-paper-warm px-2 py-1 font-mono text-[0.8125rem] text-ink-soft">
              {t("campo.casella")} {CASELLA_MOTIVO}
            </span>
            <span
              className="font-mono text-[0.9375rem] text-ink-soft"
              lang={langIt("percorso.1.official")}
            >
              {t("percorso.1.official")}
            </span>
          </p>
          <p className="m-0">{t("percorso.1.why")}</p>
          <RadioGroup
            name="motivo"
            labelledBy="titolo-pagina"
            value={answers.motivo}
            options={MOTIVI.map((m) => ({ value: m.code, labelKey: m.i18nKey }))}
            onChange={(v) => update({ motivo: v as MotivoCode })}
          />
          <p aria-live="polite" className="m-0 rounded border border-rule bg-paper-warm px-3 py-2">
            {motivoScelto ? (
              motivoScelto.code === "altro" ? (
                t("percorso.1.nessunCodice")
              ) : (
                <>
                  {fill(t("percorso.1.codice"), { codice: motivoScelto.code })}{" "}
                  {/* il nome della tabella allegata n. 2 resta in italiano */}
                  <span lang="it">«{motivoScelto.official}»</span>
                </>
              )
            ) : (
              ""
            )}
          </p>
          <SourceNote source="F2" detail="tabella allegata n. 2 · F7" />
        </section>
      ) : null}

      {/* 2 — chi presenta la domanda */}
      {passo === 2 ? (
        <section className="flex flex-col gap-4">
          <p className="m-0">{t("percorso.2.why")}</p>
          <RadioGroup
            name="presentedBy"
            labelledBy="titolo-pagina"
            value={answers.presentedBy}
            options={[
              { value: "interessato", labelKey: "percorso.2.interessato" },
              {
                value: "terzo-autorizzato",
                labelKey: "percorso.2.terzo",
                hintKey: "percorso.2.terzo.nota",
              },
              {
                value: "minore-non-accompagnato",
                labelKey: "percorso.2.minore",
                hintKey: "percorso.2.minore.nota",
              },
            ]}
            onChange={(v) => update({ presentedBy: v as PresentedBy })}
          />
          <SourceNote source="F8" />
        </section>
      ) : null}

      {/* 3 — quando sei entrata in Italia (casella 48) */}
      {passo === 3 ? (
        <section className="flex flex-col gap-3 rounded border border-rule bg-paper p-4">
          <label htmlFor="casella-48" className="m-0 text-[1.25rem] font-semibold leading-snug">
            {t("percorso.3.label")}
          </label>
          <p className="m-0 flex flex-wrap items-center gap-2">
            <span className="rounded border border-rule bg-paper-warm px-2 py-1 font-mono text-[0.8125rem] text-ink-soft">
              <span className="sr-only">{t("campo.nomeUfficiale")} </span>
              {t("campo.casella")} {CASELLA_INGRESSO}
            </span>
            <span
              className="font-mono text-[0.9375rem] text-ink-soft"
              lang={langIt("percorso.3.official")}
            >
              {t("percorso.3.official")}
            </span>
          </p>
          <SourceNote source="F11" detail="MOD. 209 Modulo 1, n. 48" />
          <p className="m-0">{t("percorso.3.why")}</p>
          <input
            id="casella-48"
            type="date"
            value={answers.entryDate ?? ""}
            onChange={(e) => update({ entryDate: e.target.value || null })}
            onBlur={() => {
              if (!today) return;
              setDateIssues(
                issuesForField(validateAll(toDomainAnswers(answers), today), CASELLA_INGRESSO)
              );
            }}
            aria-describedby={[
              "casella-48-formato",
              ...dateIssues.map((_, n) => `casella-48-issue-${n}`),
            ].join(" ")}
            aria-invalid={dateIssues.some((i) => i.severity === "error") || undefined}
            className={[
              "min-h-[48px] w-full rounded border bg-paper px-3 py-2 text-base text-ink",
              "focus:border-2 focus:border-accent",
              dateIssues.some((i) => i.severity === "error") ? "border-alert" : "border-rule",
            ].join(" ")}
          />
          <p id="casella-48-formato" className="m-0 text-[0.9375rem] text-ink-soft">
            {t("percorso.3.formato")}
          </p>
          {dateIssues.map((issue, n) => (
            <IssueBlock key={`${issue.code}-${n}`} id={`casella-48-issue-${n}`} issue={issue} />
          ))}
          <ExplainPanel
            id="casella-48-spiegazione"
            open={explainIngresso}
            onOpenChange={setExplainIngresso}
            meaningKey="campo.48.explain.meaning"
            actionKey="campo.48.explain.action"
            source="F12"
            sourceDetail="art. 5 c. 2 D.lgs 286/1998"
          />
        </section>
      ) : null}

      {/* 4 — provincia di soggiorno (casella 5) */}
      {passo === 4 ? (
        <section className="flex flex-col gap-3 rounded border border-rule bg-paper p-4">
          <label htmlFor="casella-5" className="m-0 text-[1.25rem] font-semibold leading-snug">
            {t("percorso.4.label")}
          </label>
          <p className="m-0 flex flex-wrap items-center gap-2">
            <span className="rounded border border-rule bg-paper-warm px-2 py-1 font-mono text-[0.8125rem] text-ink-soft">
              {t("campo.casella")} {CASELLA_PROVINCIA}
            </span>
          </p>
          <p className="m-0">{t("percorso.4.why")}</p>
          <select
            id="casella-5"
            value={answers.province ?? ""}
            onChange={(e) => update({ province: e.target.value || null })}
            aria-describedby="casella-5-limite"
            className="min-h-[48px] w-full rounded border border-rule bg-paper px-3 py-2 text-base text-ink focus:border-2 focus:border-accent"
          >
            <option value="">{t("percorso.4.scegli")}</option>
            {PROVINCE_CAP.map((p) => (
              <option key={p.sigla} value={p.sigla}>
                {p.nome} ({p.sigla})
              </option>
            ))}
          </select>
          <p id="casella-5-limite" className="m-0 text-[0.9375rem] text-ink-soft">
            {t("percorso.4.limite")}
          </p>
        </section>
      ) : null}

      {/* 5 — reddito: decide se il Modulo 2 esiste per questa persona */}
      {passo === 5 ? (
        <section className="flex flex-col gap-4">
          <p className="m-0">{t("percorso.5.why")}</p>
          <RadioGroup
            name="hasIncome"
            labelledBy="titolo-pagina"
            value={answers.hasIncome === null ? null : answers.hasIncome ? "si" : "no"}
            options={[
              { value: "si", labelKey: "percorso.5.si", hintKey: "percorso.5.si.nota" },
              { value: "no", labelKey: "percorso.5.no", hintKey: "percorso.5.no.nota" },
            ]}
            onChange={(v) => update({ hasIncome: v === "si" })}
          />
          <SourceNote source="F3" />
        </section>
      ) : null}

      <p aria-live="polite" className="m-0 text-base text-alert">
        {bloccato ? t("percorso.bloccato") : ""}
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          href={indietroHref}
          className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
        >
          {t("percorso.indietro")}
        </Link>
        <button
          type="button"
          onClick={continua}
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {passo === TOTALE_PASSI ? t("percorso.vediDove") : t("nav.continua")}
        </button>
      </div>
    </div>
  );
}
