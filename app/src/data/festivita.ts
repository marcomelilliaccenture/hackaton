// app/src/data/festivita.ts
// Festivita' nazionali italiane 2026 e 2027, usate dal conteggio dei giorni lavorativi (R-01).
// [da verificare: manca una fonte citabile in docs/sources.md]
// Verificato il: 22/09/2026 — Pasqua 2026 = 5 aprile (Lunedi' dell'Angelo 6 aprile),
// Pasqua 2027 = 28 marzo (Lunedi' dell'Angelo 29 marzo).
//
// LIMITE DICHIARATO: le festivita' PATRONALI LOCALI non sono gestite. Il santo patrono
// del comune e' giorno festivo ma varia comune per comune: non entra in questa tabella.

export interface Festivita {
  /** mese 1-12 */
  month: number;
  day: number;
  year: number;
  /** codice, non frase: la traduzione sta in i18n */
  code: string;
}

export const FESTIVITA_NAZIONALI_ROWS: Festivita[] = [
  // 2026
  { year: 2026, month: 1, day: 1, code: "CAPODANNO" },
  { year: 2026, month: 1, day: 6, code: "EPIFANIA" },
  { year: 2026, month: 4, day: 6, code: "LUNEDI_ANGELO" },
  { year: 2026, month: 4, day: 25, code: "LIBERAZIONE" },
  { year: 2026, month: 5, day: 1, code: "FESTA_LAVORO" },
  { year: 2026, month: 6, day: 2, code: "FESTA_REPUBBLICA" },
  { year: 2026, month: 8, day: 15, code: "FERRAGOSTO" },
  { year: 2026, month: 11, day: 1, code: "OGNISSANTI" },
  { year: 2026, month: 12, day: 8, code: "IMMACOLATA" },
  { year: 2026, month: 12, day: 25, code: "NATALE" },
  { year: 2026, month: 12, day: 26, code: "SANTO_STEFANO" },
  // 2027
  { year: 2027, month: 1, day: 1, code: "CAPODANNO" },
  { year: 2027, month: 1, day: 6, code: "EPIFANIA" },
  { year: 2027, month: 3, day: 29, code: "LUNEDI_ANGELO" },
  { year: 2027, month: 4, day: 25, code: "LIBERAZIONE" },
  { year: 2027, month: 5, day: 1, code: "FESTA_LAVORO" },
  { year: 2027, month: 6, day: 2, code: "FESTA_REPUBBLICA" },
  { year: 2027, month: 8, day: 15, code: "FERRAGOSTO" },
  { year: 2027, month: 11, day: 1, code: "OGNISSANTI" },
  { year: 2027, month: 12, day: 8, code: "IMMACOLATA" },
  { year: 2027, month: 12, day: 25, code: "NATALE" },
  { year: 2027, month: 12, day: 26, code: "SANTO_STEFANO" },
];

/** Le stesse date come oggetti Date locali a mezzanotte. */
export const FESTIVITA_NAZIONALI: Date[] = FESTIVITA_NAZIONALI_ROWS.map(
  (f) => new Date(f.year, f.month - 1, f.day)
);
