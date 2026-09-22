// app/src/domain/routing.ts
// R-03…R-06 — dove si presenta la domanda. Funzione pura: restituisce CODICI, non frasi.

import type { Channel, MotivoCode } from "@/domain/types";

export type { Channel };

export type RoutingReason =
  | "MOTIVO_SOLO_QUESTURA"
  | "PRESENTATO_DA_TERZO"
  | "MINORE_NON_ACCOMPAGNATO"
  | "SOGGIORNO_BREVE"
  | "MOTIVO_NON_RICONOSCIUTO";

export type PresentedBy = "interessato" | "terzo-autorizzato" | "minore-non-accompagnato";

export interface RoutingInput {
  motivo: MotivoCode;
  presentedBy: PresentedBy;
  stayLongerThan3Months: boolean;
}

export interface RoutingResult {
  channel: Channel;
  reasons: RoutingReason[];
}

/** R-03 — i motivi del kit postale fra quelli esposti dal percorso. Fonte: F2 tab. 2 · F7. */
const MOTIVI_KIT_POSTALE: readonly MotivoCode[] = ["16", "31", "13"];

/**
 * R-04 — i 14 motivi che si presentano solo in Questura. Fonte: F8.
 * Nessuno di questi e' oggi un MotivoCode esposto: chi li ha scelti passa da "altro".
 * La lista resta qui perche' e' il dato citabile, e per il controllo difensivo sotto.
 */
export const MOTIVI_SOLO_QUESTURA: readonly string[] = [
  "asilo-politico-primo-rilascio",
  "cure-mediche",
  "minore-eta",
  "protezione-internazionale",
  "protezione-speciale",
  "protezione-sussidiaria",
  "motivi-umanitari",
  "affari",
  "gara-sportiva",
  "giustizia",
  "status-apolide-primo-rilascio",
  "integrazione-minore",
  "invito",
  "casi-speciali",
];

export function channelFor(input: RoutingInput): RoutingResult {
  const reasons: RoutingReason[] = [];

  // R-04 — motivo riservato alla Questura.
  if (MOTIVI_SOLO_QUESTURA.includes(input.motivo as string)) {
    reasons.push("MOTIVO_SOLO_QUESTURA");
  } else if (!MOTIVI_KIT_POSTALE.includes(input.motivo)) {
    // R-03 — "altro" e ogni codice fuori tabella: non sappiamo dirlo, si manda a chiedere.
    reasons.push("MOTIVO_NON_RICONOSCIUTO");
  }

  // R-05 — chi presenta la domanda per conto di un'altra persona va in Questura.
  if (input.presentedBy === "terzo-autorizzato") {
    reasons.push("PRESENTATO_DA_TERZO");
  }
  if (input.presentedBy === "minore-non-accompagnato") {
    reasons.push("MINORE_NON_ACCOMPAGNATO");
  }

  // R-06 — soggiorno fino a 3 mesi: non e' un permesso, e' la dichiarazione di presenza.
  if (!input.stayLongerThan3Months) {
    reasons.push("SOGGIORNO_BREVE");
  }

  // Precedenza: il soggiorno breve cambia proprio istituto, quindi vince sul canale.
  if (reasons.includes("SOGGIORNO_BREVE")) {
    return { channel: "dichiarazione-di-presenza", reasons };
  }
  if (reasons.length > 0) {
    return { channel: "questura", reasons };
  }
  return { channel: "ufficio-postale", reasons };
}
