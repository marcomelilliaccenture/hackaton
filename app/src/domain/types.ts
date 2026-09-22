// app/src/domain/types.ts
// Vocabolario condiviso del dominio. Nessun import da React, nessuna stringa leggibile.

// ── instradamento e motivo — R-03…R-06, tabella allegata n. 2 ─────────────────
export type MotivoCode = "16" | "31" | "13" | "altro";
export type Channel = "ufficio-postale" | "questura" | "dichiarazione-di-presenza";

// ── costi — R-15…R-21 ─────────────────────────────────────────────────────────
export type Istanza = "rilascio" | "rinnovo" | "aggiornamento" | "conversione" | "duplicato";
export type Durata = "fino-1-anno" | "1-2-anni" | "lungo-periodo";

// ── esiti di validazione — R-07, R-08, R-13 ───────────────────────────────────
export type Severity = "error" | "warning" | "info";
export interface Issue { field: number; code: string; severity: Severity }  // field = casella

// ── indirizzi — R-08, caselle 76-84 ───────────────────────────────────────────
export interface Address {
  presso?: string;      // nota (r): nome e cognome, o denominazione, presso cui recapitare
  via: string;
  civico?: string;
  comune: string;
  cap: string;          // 5 cifre, come stringa: lo zero iniziale conta
  provincia: string;    // sigla di due lettere, es. "MI"
}

// ── passaporto — caselle 44, 45 ───────────────────────────────────────────────
export interface PassportData {
  number: string;
  expiry: Date | null;
  mrz?: string;         // la riga leggibile a macchina, digitata dalla persona
}

// ── ordine di compilazione — R-12, nota (f) ───────────────────────────────────
export interface Step {
  id: string;           // "modulo-1" | "modulo-2" | "fotocopie" | "sezione-2" | "firma"
  i18nKey: string;
  route: string;
  requires: string[];   // id dei passi che la nota (f) impone prima di questo
}

// ── tutto ciò che la persona ha risposto ──────────────────────────────────────
export interface Answers {
  // dove si presenta — R-03…R-06
  motivo: MotivoCode;
  presentedBy: "interessato" | "terzo-autorizzato" | "minore-non-accompagnato";
  stayLongerThan3Months: boolean;

  // entro quando — R-01, R-02
  entryDate: Date | null;

  // chi è, come sul passaporto — R-07, caselle 3, 4
  surname: string;
  given: string;
  passport: PassportData;

  // dove arriva la raccomandata — R-08
  residence: Address;
  communicationAddress: Address | null;   // nota (q): null = uguale al precedente

  // quanto costa — R-15…R-21
  istanza: Istanza;
  durata: Durata;
  ageYears: number;
  childrenUnder14: number;

  // i moduli — R-11, R-13, R-14
  hasIncome: boolean;            // R-14: il Modulo 2 si compila solo se c'è reddito
  signatureConfirmed: boolean;   // R-13, casella 29
  sheetCountConfirmed: boolean;  // R-11, casella 25
}
