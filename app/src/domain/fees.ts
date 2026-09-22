// app/src/domain/fees.ts
// Quanto paga e su quale canale — R-15…R-21.
// Puro: nessun import da React, nessuna stringa leggibile. Ogni importo in CENTESIMI interi
// (R-20: F6 scrive "30.36€" in due esempi e sbaglia una somma — qui vale 30,46 € e le voci
// restano sempre visibili, cosi' il totale e' verificabile a occhio).

import type { Durata, Istanza } from "@/domain/types";

export type { Durata, Istanza };

export type FeeChannel = "tabaccheria" | "bollettino-mef" | "cassa-poste";

export interface FeeItem {
  id: string;
  amountCents: number;
  channel: FeeChannel;
  source: string;
}

export interface Fees {
  /** c/c 67422402 intestato al MEF, un solo bollettino per richiedente — R-16, R-18 */
  bollettino: { items: FeeItem[]; totalCents: number };
  /** quello che esce di tasca: bollo + bollettino + spedizione — R-15, R-18, R-19 */
  cash: { items: FeeItem[]; totalCents: number };
  /** codici di esenzione, mai frasi — R-21 */
  exemptions: string[];
}

/** R-15 — marca da bollo, in tabaccheria, applicata sull'istanza. Fonte: F1 · F6 */
export const BOLLO_CENTS = 1600;
/** R-16 — produzione del permesso elettronico, bollettino c/c 67422402 (MEF). Fonte: F6 */
export const PRODUZIONE_CENTS = 3046;
/** R-19 — spedizione all'operatore, al momento dell'accettazione. Fonte: F5 · F6 */
export const SPEDIZIONE_CENTS = 3000;

/** R-17 — contributo per durata. Fonte: F6 · DM MEF/Interno 5.5.2017 via F4 */
export const CONTRIBUTO_CENTS: Record<Durata, number> = {
  "fino-1-anno": 4000,
  "1-2-anni": 5000,
  "lungo-periodo": 10000,
};

const SOURCE_BOLLO = "F1 · F6";
const SOURCE_PRODUZIONE = "F6";
const SOURCE_CONTRIBUTO = "F6 · DM MEF/Interno 5.5.2017 via F4";
const SOURCE_SPEDIZIONE = "F5 · F6";

/** R-21 — istanze per cui il contributo non e' previsto (permesso in corso di validita'). */
const SENZA_CONTRIBUTO: Istanza[] = ["aggiornamento", "conversione", "duplicato"];

const sum = (items: FeeItem[]): number =>
  items.reduce((acc, item) => acc + item.amountCents, 0);

export function feesFor(input: {
  istanza: Istanza;
  durata: Durata;
  ageYears: number;
  childrenUnder14: number;
}): Fees {
  const { istanza, durata, ageYears, childrenUnder14 } = input;

  const exemptions: string[] = [];
  if (SENZA_CONTRIBUTO.includes(istanza)) exemptions.push("CONTRIBUTO_NON_PREVISTO");
  if (ageYears < 18) exemptions.push("MINORE_18");

  const contributoDovuto = exemptions.length === 0;
  const contributoCents = CONTRIBUTO_CENTS[durata] ?? 0;

  // un bollettino da 30,46 € per il richiedente + uno per ogni figlio sotto i 14 nell'istanza
  const figli = Number.isFinite(childrenUnder14) ? Math.max(0, Math.trunc(childrenUnder14)) : 0;
  const produzione: FeeItem[] = Array.from({ length: 1 + figli }, () => ({
    id: "produzione",
    amountCents: PRODUZIONE_CENTS,
    channel: "bollettino-mef" as const,
    source: SOURCE_PRODUZIONE,
  }));

  const bollettinoItems: FeeItem[] = [...produzione];
  if (contributoDovuto) {
    bollettinoItems.push({
      id: "contributo",
      amountCents: contributoCents,
      channel: "bollettino-mef",
      source: SOURCE_CONTRIBUTO,
    });
  }

  const cashItems: FeeItem[] = [
    { id: "bollo", amountCents: BOLLO_CENTS, channel: "tabaccheria", source: SOURCE_BOLLO },
    // il bollettino si paga alla cassa dell'ufficio postale: stesse voci, altro canale
    ...bollettinoItems.map((item) => ({ ...item, channel: "cassa-poste" as const })),
    { id: "spedizione", amountCents: SPEDIZIONE_CENTS, channel: "cassa-poste", source: SOURCE_SPEDIZIONE },
  ];

  return {
    bollettino: { items: bollettinoItems, totalCents: sum(bollettinoItems) },
    cash: { items: cashItems, totalCents: sum(cashItems) },
    exemptions,
  };
}
