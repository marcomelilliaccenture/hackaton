"use client";

import { useT } from "./LanguageProvider";

/**
 * "Nessun numero senza fonte" (docs/ux-spec.md §5).
 *
 * La prop `source` e' obbligatoria e non accetta `undefined`. Quando la fonte
 * non e' una di quelle censite in docs/sources.md, la riga NON viene stampata:
 * a schermo non compare nessun marcatore. Un marcatore rivolto all'utente
 * ("[da verificare]") non gli dice niente di utile; quello che manca si
 * dichiara in un posto solo, /limiti, e si annota nel commento del file che
 * contiene il dato.
 */
export type SourceId =
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F11"
  | "F12";

/** Etichette da docs/sources.md: nomi propri, uguali in tutte le lingue. */
const SOURCE_LABEL: Record<SourceId, string> = {
  F1: "F1 · Polizia di Stato",
  F2: "F2 · Informativa Generale — Foglio Note",
  F3: "F3 · Portale Immigrazione — La procedura",
  F4: "F4 · Polizia di Stato — Il rilascio",
  F5: "F5 · Poste Italiane",
  F6: "F6 · Portale Immigrazione — Tabella costi",
  F7: "F7 · Tipologie via Ufficio Postale",
  F8: "F8 · Tipologie solo in Questura",
  F9: "F9 · MOD. 209 — Modulo 1",
  F11: "F11 · MOD. 209 — istruzioni multilingue",
  F12: "F12 · art. 5 c. 2 D.lgs 286/1998",
};

function isSourceId(value: string): value is SourceId {
  return Object.prototype.hasOwnProperty.call(SOURCE_LABEL, value);
}

export interface SourceNoteProps {
  source: SourceId | "da-verificare";
  /** Precisazione dentro la fonte, es. "nota (r)". */
  detail?: string;
  id?: string;
  className?: string;
}

export function SourceNote({ source, detail, id, className }: SourceNoteProps) {
  const t = useT();

  // Fonte ignota: nessuna riga. Meglio il silenzio di un'etichetta che l'utente
  // non puo' usare.
  if (!isSourceId(source)) return null;

  return (
    <p id={id} className={["m-0 text-[0.875rem] text-ink-soft", className].filter(Boolean).join(" ")}>
      {/* Nomi propri delle fonti: restano in italiano in tutte le lingue. */}
      {t("fonte.label")} <span lang="it">{SOURCE_LABEL[source]}{detail ? `, ${detail}` : ""}</span>
    </p>
  );
}
