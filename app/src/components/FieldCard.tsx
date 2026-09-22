"use client";

import { useEffect, useRef, useState } from "react";
import type { Issue } from "@/domain/types";
import { ExplainPanel } from "./ExplainPanel";
import { IssueBlock } from "./IssueBlock";
import { useLangAttr, useT } from "./LanguageProvider";
import { SourceNote, type SourceNoteProps } from "./SourceNote";

/**
 * Un campo del MOD. 209, con tutto quello che serve per rispondere
 * (docs/ux-spec.md §4 e §5).
 *
 * Ordine verticale, non negoziabile: la domanda · il nome burocratico con il
 * chip `casella N` · perche' serve · il campo · l'esempio · le issue ·
 * "Non capisco questa domanda".
 *
 * Comportamento: la validazione la decide chi passa `issues` e scatta al
 * `blur` (`onBlur`), non a ogni tasto. Al secondo `error` sullo stesso campo
 * l'ExplainPanel si apre da solo e resta aperto. Il focus non si sposta mai da
 * solo: l'errore si annuncia via `aria-live`, non rubando il cursore.
 *
 * Le chiavi della spiegazione estesa seguono la convenzione
 * `campo.<n>.explain.meaning` e `campo.<n>.explain.action`.
 */
export interface FieldCardProps {
  /** Numero ufficiale del campo sul MOD. 209, sempre visibile. */
  casella: number;
  labelKey: string;
  officialKey: string;
  /**
   * Nota del Foglio Note (F2) che il modulo aggancia a questa casella, es. la
   * lettera (b) sulla 78. Molte caselle non ne hanno nessuna: in quel caso si
   * omette e la nota non compare, ne' a schermo ne' nella descrizione.
   */
  noteKey?: string;
  whyKey: string;
  exampleKey: string;
  /** Gia' filtrate per questa casella. */
  issues: Issue[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Obbligatoria: nessun testo normativo a schermo senza la sua fonte. */
  source: SourceNoteProps["source"];
  sourceDetail?: string;
  /** Fonte dell'etichetta ufficiale del campo: F11 la dà in quattro lingue. */
  officialSource: SourceNoteProps["source"];
  autoComplete?: string;
  /**
   * Se c'è, il campo è una `<select>` invece di un `<input>`: stessa etichetta,
   * stesso `aria-describedby`, stessa altezza. Serve dove il valore ammesso è
   * un elenco chiuso (la sigla della provincia, casella 78).
   */
  options?: { value: string; label: string }[];
  /** Testo della voce vuota della `<select>`. */
  emptyOptionKey?: string;
  inputMode?: "text" | "numeric";
  maxLength?: number;
}

/**
 * Nell'etichetta la parte fra asterischi va in grassetto: `Come è scritto il
 * tuo cognome *sul passaporto*?`. È la traduttrice a decidere dove cade
 * l'enfasi nella sua lingua, non il codice.
 */
function conEnfasi(testo: string) {
  return testo.split("*").map((pezzo, n) =>
    n % 2 === 1 ? <strong key={n}>{pezzo}</strong> : <span key={n}>{pezzo}</span>
  );
}

export function FieldCard({
  casella,
  labelKey,
  officialKey,
  noteKey,
  whyKey,
  exampleKey,
  issues,
  value,
  onChange,
  onBlur,
  source,
  sourceDetail,
  officialSource,
  autoComplete,
  options,
  emptyOptionKey,
  inputMode,
  maxLength,
}: FieldCardProps) {
  const t = useT();
  const langIt = useLangAttr();

  const inputId = `casella-${casella}`;
  const exampleId = `${inputId}-esempio`;
  const noteId = `${inputId}-nota`;
  const panelId = `${inputId}-spiegazione`;

  const [explainOpen, setExplainOpen] = useState(false);
  const [blurCount, setBlurCount] = useState(0);
  const errorCount = useRef(0);
  const countedBlur = useRef(0);
  const autoOpened = useRef(false);

  const hasError = issues.some((i) => i.severity === "error");

  // Il contatore degli errori e' per campo: conta le uscite dal campo che
  // hanno prodotto un `error`, non i tasti premuti.
  useEffect(() => {
    if (blurCount === 0 || countedBlur.current === blurCount) return;
    countedBlur.current = blurCount;
    if (!hasError) return;
    errorCount.current += 1;
    // Secondo errore: l'aiuto esteso compare senza doverlo chiedere (A-11).
    // Una volta sola: al terzo tentativo non si riapre da solo, e se e' aperto
    // resta aperto.
    if (errorCount.current >= 2 && !autoOpened.current) {
      autoOpened.current = true;
      setExplainOpen(true);
    }
  }, [blurCount, hasError]);

  const describedBy = [
    exampleId,
    ...issues.map((_, n) => `${inputId}-issue-${n}`),
    ...(noteKey ? [noteId] : []),
  ].join(" ");

  return (
    <div className="flex flex-col gap-2 rounded border border-rule bg-paper p-4">
      {/* 1. la domanda, in parole nostre */}
      <label htmlFor={inputId} className="m-0 text-[1.25rem] font-semibold leading-snug">
        {conEnfasi(t(labelKey))}
      </label>

      {/* 2. il nome burocratico, che non si toglie mai, con il chip della casella */}
      <p className="m-0 flex flex-wrap items-center gap-2">
        <span className="rounded border border-rule bg-paper-warm px-2 py-1 font-mono text-[0.8125rem] text-ink-soft">
          <span className="sr-only">{t("campo.nomeUfficiale")} </span>
          {t("campo.casella")} {casella}
        </span>
        {/* F11 dà l'etichetta ufficiale in quattro lingue: `lang="it"` solo se
            per questa casella la traduzione non c'è ed è rimasta l'italiana. */}
        <span lang={langIt(officialKey)} className="font-mono text-[0.9375rem] text-ink-soft">
          {t(officialKey)}
        </span>
      </p>
      <SourceNote source={officialSource} />

      {/* 3. perche' serve, una riga */}
      <p className="m-0">{t(whyKey)}</p>

      {/* 4. il campo */}
      {options ? (
        <select
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            onBlur?.();
            setBlurCount((n) => n + 1);
          }}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          className={[
            "min-h-[48px] w-full rounded border bg-paper px-3 py-2 text-base text-ink",
            "focus:border-2 focus:border-accent",
            hasError ? "border-alert" : "border-rule",
          ].join(" ")}
        >
          <option value="">{emptyOptionKey ? t(emptyOptionKey) : ""}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type="text"
          value={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            onBlur?.();
            setBlurCount((n) => n + 1);
          }}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          className={[
            "min-h-[48px] w-full rounded border bg-paper px-3 py-2 text-base text-ink",
            "focus:border-2 focus:border-accent",
            hasError ? "border-alert" : "border-rule",
          ].join(" ")}
        />
      )}

      {/* 5. l'esempio, con dati palesemente finti */}
      <p id={exampleId} className="m-0 text-[0.9375rem] text-ink-soft">
        {t("campo.esempio")} {t(exampleKey)}
      </p>

      {/* 6. le issue */}
      {issues.map((issue, n) => (
        <IssueBlock key={`${issue.code}-${n}`} id={`${inputId}-issue-${n}`} issue={issue} />
      ))}

      {/* La nota ufficiale fa parte della descrizione del campo anche quando la
          spiegazione e' chiusa: `aria-describedby` la include sempre. */}
      {noteKey ? (
        <p id={noteId} lang={langIt(noteKey)} className="sr-only">
          {t(noteKey)}
        </p>
      ) : null}

      {/* 7. "Non capisco questa domanda" */}
      <ExplainPanel
        id={panelId}
        open={explainOpen}
        onOpenChange={setExplainOpen}
        meaningKey={`campo.${casella}.explain.meaning`}
        officialQuoteKey={noteKey}
        actionKey={`campo.${casella}.explain.action`}
        source={source}
        sourceDetail={sourceDetail}
      />
    </div>
  );
}
