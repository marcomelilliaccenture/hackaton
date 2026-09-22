"use client";

import { useRef } from "react";
import { useLangAttr, useT } from "./LanguageProvider";
import { SourceNote, type SourceNoteProps } from "./SourceNote";

/**
 * Spiegazione estesa di un termine burocratico (docs/ux-spec.md §5).
 * Disclosure in linea con `aria-expanded` + `aria-controls`: mai un modale, su
 * smartphone un modale copre il campo di cui sta parlando. Si chiude con `Esc`
 * e con un bottone; nessun focus trap.
 *
 * Contiene, in quest'ordine: cosa vuol dire · l'istruzione ufficiale citata
 * alla lettera (solo se quella casella ha una nota sul Foglio Note: molte non
 * ne hanno, e allora la sezione non c'e' affatto) · cosa fare adesso · la
 * fonte.
 */
export interface ExplainPanelProps {
  /** id della regione: e' il bersaglio di `aria-controls`. */
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meaningKey: string;
  /**
   * La nota ufficiale, citata alla lettera. Assente quando la casella non ha
   * nessuna nota sul Foglio Note (F2): in quel caso la sezione non si stampa.
   */
  officialQuoteKey?: string;
  actionKey: string;
  source: SourceNoteProps["source"];
  sourceDetail?: string;
}

export function ExplainPanel({
  id,
  open,
  onOpenChange,
  meaningKey,
  officialQuoteKey,
  actionKey,
  source,
  sourceDetail,
}: ExplainPanelProps) {
  const t = useT();
  const langIt = useLangAttr();
  const triggerRef = useRef<HTMLButtonElement>(null);

  function chiudi() {
    onOpenChange(false);
    triggerRef.current?.focus();
  }

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          chiudi();
        }
      }}
    >
      {/* Bottone testuale, non icona: il testo dice cosa fa. */}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => onOpenChange(!open)}
        className="inline-flex min-h-[44px] items-center rounded px-1 text-base font-semibold text-accent underline underline-offset-4"
      >
        {t("campo.nonCapisco")}
      </button>

      <div
        id={id}
        hidden={!open}
        className={open ? "mt-2 flex flex-col gap-3 border-l-[3px] border-accent bg-accent-weak px-4 py-4" : ""}
      >
        <section className="flex flex-col gap-1">
          <h2 className="m-0 text-base font-semibold">{t("explain.cosaVuolDire")}</h2>
          <p className="m-0">{t(meaningKey)}</p>
        </section>

        {officialQuoteKey ? (
          <section className="flex flex-col gap-1">
            <h2 className="m-0 text-base font-semibold">{t("explain.istruzioneUfficiale")}</h2>
            {/* Citazione alla lettera: resta in italiano anche nelle altre lingue. */}
            <blockquote
              lang={langIt(officialQuoteKey)}
              className="m-0 border-l-2 border-rule pl-3 font-mono text-[0.9375rem] text-ink-soft"
            >
              «{t(officialQuoteKey)}»
            </blockquote>
            <p className="m-0 mt-1 text-[0.9375rem] font-semibold">{t("explain.traduzione")}</p>
            <p className="m-0">{t(`${officialQuoteKey}.traduzione`)}</p>
          </section>
        ) : null}

        <section className="flex flex-col gap-1">
          <h2 className="m-0 text-base font-semibold">{t("explain.cosaFare")}</h2>
          <p className="m-0">{t(actionKey)}</p>
        </section>

        <SourceNote source={source} detail={sourceDetail} />

        <button
          type="button"
          onClick={chiudi}
          className="min-h-[44px] self-start rounded border border-accent px-4 py-2 text-base font-semibold text-accent"
        >
          {t("campo.chiudiSpiegazione")}
        </button>
      </div>
    </div>
  );
}
