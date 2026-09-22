// app/src/domain/progress.ts
// R-11 — casella 25, nota (g): numero complessivo di fogli, moduli PIU' fotocopie dei documenti.
// Puro: nessun import da React. `label` e' un identificatore (chiave), non una frase da mostrare:
// il testo per la persona sta in i18n/.
//
// NON VERIFICATO (nota per noi, non per l'utente) — il numero di fogli di cui si compongono il
// Modulo 1 e il Modulo 2, e quanti fogli occupa la fotocopia di un documento, non hanno una
// fonte citabile in docs/sources.md alla data del 22/09/2026. Provenienza dei numeri: conteggio
// a mano delle pagine dei PDF in docs/sources/ (mod-209-modulo-1.pdf) fatto da noi, non da una
// fonte ufficiale. Per questo `sheetCount` e' una PROPOSTA: finche' la persona non la conferma,
// `validateAll` emette SHEET_COUNT_UNCONFIRMED (info). Non si scrive un numero al posto suo su
// un modulo che firma lei.
// A schermo NON compare nessun marcatore accanto al numero: il limite e' dichiarato per intero
// su /limiti (chiavi limiti.nonVerificati.*).

import { needsModulo2 } from "@/domain/form-model";
import type { Answers } from "@/domain/types";

/** Fogli del Modulo 1 del kit postale. Contati da noi, nessuna fonte ufficiale. */
const FOGLI_MODULO_1 = 4;
/** Fogli del Modulo 2 del kit postale. Contati da noi, nessuna fonte ufficiale. */
const FOGLI_MODULO_2 = 2;
/** Fogli occupati dalla fotocopia A4 di un documento spuntato. Nessuna fonte ufficiale. */
const FOGLI_PER_DOCUMENTO = 1;

export interface SheetCountLine {
  /** chiave della voce: "modulo-1", "modulo-2", oppure l'id del documento spuntato */
  label: string;
  sheets: number;
}

export interface SheetCountProposal {
  proposed: number;
  breakdown: SheetCountLine[];
}

/**
 * Proposta per la casella 25, voce per voce. `proposed` e' sempre la somma esatta del
 * breakdown, cosi' la persona puo' ricontarla a mano.
 */
export function sheetCount(answers: Answers, checkedDocs: string[]): SheetCountProposal {
  const breakdown: SheetCountLine[] = [{ label: "modulo-1", sheets: FOGLI_MODULO_1 }];

  if (needsModulo2(answers)) {
    breakdown.push({ label: "modulo-2", sheets: FOGLI_MODULO_2 });
  }

  for (const doc of checkedDocs) {
    breakdown.push({ label: doc, sheets: FOGLI_PER_DOCUMENTO });
  }

  const proposed = breakdown.reduce((acc, line) => acc + line.sheets, 0);
  return { proposed, breakdown };
}
