// app/src/domain/deadline.ts
// R-01 · R-02 — entro quando si presenta la prima domanda.
// Funzioni pure: nessun import da React, nessuna stringa leggibile, mai new Date() senza
// argomenti (l'"oggi" arriva sempre dal chiamante).
//
// R-01: 8 giorni LAVORATIVI dall'ingresso (casella 48) — F12 = art. 5 c. 2 D.lgs 286/1998,
//       confermato da F3 e F4.
// R-02: F5 (Poste) scrive "8 giorni" senza "lavorativi" → esponiamo ANCHE la data a giorni
//       di calendario come limite prudente.

import { FESTIVITA_NAZIONALI } from "@/data/festivita";

export type SkipReason = "weekend" | "holiday";

export interface WorkingDaysDeadline {
  deadline: Date;
  countedDays: Date[];
  skipped: { date: Date; reason: SkipReason }[];
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Mezzanotte locale del giorno passato: elimina l'ora dal confronto. */
function atMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function isWeekend(date: Date): boolean {
  const d = date.getDay();
  return d === 0 || d === 6;
}

function isHoliday(date: Date, holidays: Date[]): boolean {
  const t = atMidnight(date).getTime();
  return holidays.some((h) => atMidnight(h).getTime() === t);
}

/**
 * Il giorno di ingresso NON conta: si contano i `days` giorni lavorativi successivi.
 * Sabato e domenica esclusi, piu' le festivita' nazionali (festivita' patronali locali
 * non gestite: limite dichiarato).
 */
export function workingDaysDeadline(
  entryDate: Date,
  days: number = 8,
  holidays: Date[] = FESTIVITA_NAZIONALI
): WorkingDaysDeadline {
  const countedDays: Date[] = [];
  const skipped: { date: Date; reason: SkipReason }[] = [];

  if (days <= 0) {
    return { deadline: atMidnight(entryDate), countedDays, skipped };
  }

  let cursor = atMidnight(entryDate);
  while (countedDays.length < days) {
    cursor = addDays(cursor, 1);
    if (isWeekend(cursor)) {
      skipped.push({ date: cursor, reason: "weekend" });
    } else if (isHoliday(cursor, holidays)) {
      skipped.push({ date: cursor, reason: "holiday" });
    } else {
      countedDays.push(cursor);
    }
  }

  return { deadline: countedDays[countedDays.length - 1], countedDays, skipped };
}

/** R-02 — lettura prudente di F5: 8 giorni di calendario, weekend e festivi inclusi. */
export function calendarDaysDeadline(entryDate: Date, days: number = 8): Date {
  return addDays(atMidnight(entryDate), days);
}

/** Giorni di calendario che mancano al termine. Negativo se il termine e' passato. */
export function daysRemaining(deadline: Date, today: Date): number {
  return Math.round(
    (atMidnight(deadline).getTime() - atMidnight(today).getTime()) / MS_PER_DAY
  );
}
