// app/src/data/motivi.ts
// Tabella allegata n. 2 al kit postale — codici motivo di richiesta.
// Fonte: F2 (tabella allegata n. 2) · F7. Verificato il: 22/09/2026.
// I 33 codici ammessi dal kit postale non sono qui per intero: esponiamo le quattro voci
// del percorso (R-03). Tutto il resto passa da "altro" e finisce in Questura (R-04).

import type { MotivoCode, Channel } from "@/domain/types";

export interface Motivo {
  code: MotivoCode;
  /** nome della tabella allegata n. 2, alla lettera */
  official: string;
  i18nKey: string;
  channel: Extract<Channel, "ufficio-postale" | "questura">;
  source: string;
}

export const MOTIVI: Motivo[] = [
  {
    code: "16",
    official: "lavoro subordinato",
    i18nKey: "motivo.16",
    channel: "ufficio-postale",
    source: "F2 · F7",
  },
  {
    code: "31",
    official: "studio",
    i18nKey: "motivo.31",
    channel: "ufficio-postale",
    source: "F2 · F7",
  },
  {
    code: "13",
    official: "famiglia",
    i18nKey: "motivo.13",
    channel: "ufficio-postale",
    source: "F2 · F7",
  },
  {
    code: "altro",
    official: "altro motivo non elencato",
    i18nKey: "motivo.altro",
    channel: "questura",
    source: "F2 · F7",
  },
];

export function motivoByCode(code: MotivoCode): Motivo | undefined {
  return MOTIVI.find((m) => m.code === code);
}
