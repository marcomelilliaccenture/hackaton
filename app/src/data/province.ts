// app/src/data/province.ts
// Province della demo con l'intervallo di CAP usato per il controllo di coerenza (R-08).
//
// NON VERIFICATO (nota per noi, non per l'utente) — nessuna tabella ufficiale aperta e citabile
// per gli intervalli CAP/provincia risulta in docs/sources.md alla data del 22/09/2026.
// Provenienza dei numeri: il prefisso provinciale di due cifre noto per le cinque province della
// demo, esteso a tutto il blocco di mille CAP (es. MO -> 41000-41999). E' un'approssimazione
// nostra, non una fonte. La tabella allegata n. 1 del MOD. 209 (F2) dà le SIGLE delle province,
// non gli intervalli di CAP.
// A schermo NON compare nessun marcatore: il limite e' dichiarato per intero su /limiti
// (chiavi limiti.nonVerificati.*).
// Conseguenza voluta: per una provincia ASSENTE da questa tabella non si emette
// ADDRESS_PROVINCE_MISMATCH. Meglio il silenzio di un avviso inventato.

export interface ProvinciaCap {
  /** sigla di due lettere */
  sigla: string;
  /** nome della provincia, come sulla busta */
  nome: string;
  /** primo CAP dell'intervallo, incluso */
  capFrom: string;
  /** ultimo CAP dell'intervallo, incluso */
  capTo: string;
}

export const PROVINCE_CAP: ProvinciaCap[] = [
  { sigla: "MO", nome: "Modena", capFrom: "41000", capTo: "41999" },
  { sigla: "BO", nome: "Bologna", capFrom: "40000", capTo: "40999" },
  { sigla: "RE", nome: "Reggio Emilia", capFrom: "42000", capTo: "42999" },
  { sigla: "MI", nome: "Milano", capFrom: "20000", capTo: "20999" },
  { sigla: "RM", nome: "Roma", capFrom: "00010", capTo: "00199" },
];

/** La provincia e' fra quelle della demo? Se no, nessun controllo sul CAP. */
export function isProvinciaNota(sigla: string): boolean {
  return PROVINCE_CAP.some((p) => p.sigla === sigla.trim().toUpperCase());
}

/** true solo se la provincia e' in tabella E il CAP di 5 cifre cade fuori dal suo intervallo. */
export function capFuoriProvincia(cap: string, sigla: string): boolean {
  const normalizedCap = cap.trim();
  if (!/^\d{5}$/.test(normalizedCap)) return false;
  const provincia = PROVINCE_CAP.find((p) => p.sigla === sigla.trim().toUpperCase());
  if (!provincia) return false;
  return normalizedCap < provincia.capFrom || normalizedCap > provincia.capTo;
}
