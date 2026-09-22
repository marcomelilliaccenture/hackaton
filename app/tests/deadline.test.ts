import { describe, expect, it } from "vitest";
import {
  workingDaysDeadline,
  calendarDaysDeadline,
  daysRemaining,
} from "@/domain/deadline";

// Tutte le date sono scritte a mano (mai new Date()), come richiesto dallo spec B1A.
// NB sul primo test: lo spec (B1A, "Fatto quando") chiede che il nome contenga
// "un ingresso venerdì 18 settembre 2026 fa scadere il termine martedì 30 settembre 2026".
// Verificato con due metodi indipendenti (Zeller da un'ancora nota + conteggio a mano
// Fri+12 giorni) che il 30 settembre 2026 cade di MERCOLEDÌ, non di martedì. Il valore
// della data (30 settembre 2026) è corretto e viene asserito; l'etichetta del giorno nel
// nome del test è corretta di conseguenza. Segnalato in report come difetto dello spec.

describe("workingDaysDeadline — R-01, R-02", () => {
  it("un ingresso di venerdì 18 settembre 2026 fa scadere il termine mercoledì 30 settembre 2026", () => {
    const entryDate = new Date(2026, 8, 18); // venerdì
    const result = workingDaysDeadline(entryDate);
    expect(result.deadline).toEqual(new Date(2026, 8, 30));
  });

  it("gli 8 giorni lavorativi contati sono esattamente 8 e non includono il giorno di ingresso", () => {
    const entryDate = new Date(2026, 8, 18); // venerdì
    const result = workingDaysDeadline(entryDate);
    expect(result.countedDays).toHaveLength(8);
    expect(result.countedDays.map((d) => d.getTime())).not.toContain(entryDate.getTime());
    expect(result.countedDays[0]).toEqual(new Date(2026, 8, 21)); // lunedì successivo
  });

  it("i due weekend compresi nella finestra vengono saltati con motivo weekend", () => {
    const entryDate = new Date(2026, 8, 18); // venerdì, nessuna festività nella finestra
    const result = workingDaysDeadline(entryDate);
    const weekendDates = result.skipped.filter((s) => s.reason === "weekend").map((s) => s.date.getTime());
    expect(weekendDates).toEqual(
      [
        new Date(2026, 8, 19),
        new Date(2026, 8, 20),
        new Date(2026, 8, 26),
        new Date(2026, 8, 27),
      ].map((d) => d.getTime())
    );
    expect(result.skipped.some((s) => s.reason === "holiday")).toBe(false);
  });

  it("il 1 maggio (festività nazionale) nella finestra viene saltato con motivo holiday", () => {
    const entryDate = new Date(2026, 3, 27); // lunedì 27 aprile 2026
    const result = workingDaysDeadline(entryDate);
    const holiday = result.skipped.find((s) => s.reason === "holiday");
    expect(holiday?.date).toEqual(new Date(2026, 4, 1));
    expect(result.countedDays).toHaveLength(8);
    expect(result.deadline).toEqual(new Date(2026, 4, 8));
  });

  it("un ingresso a ridosso del 1 novembre include la festività fra i giorni saltati", () => {
    const entryDate = new Date(2026, 9, 29); // giovedì 29 ottobre 2026
    const result = workingDaysDeadline(entryDate);
    const skippedDates = result.skipped.map((s) => s.date.getTime());
    expect(skippedDates).toContain(new Date(2026, 10, 1).getTime());
    expect(result.countedDays).toHaveLength(8);
    expect(result.deadline).toEqual(new Date(2026, 10, 10));
  });
});

describe("calendarDaysDeadline — R-02, limite prudente", () => {
  it("il limite a 8 giorni di calendario cade prima o lo stesso giorno del termine a giorni lavorativi", () => {
    const entryDate = new Date(2026, 8, 18); // venerdì
    const working = workingDaysDeadline(entryDate);
    const calendar = calendarDaysDeadline(entryDate);
    expect(calendar.getTime()).toBeLessThanOrEqual(working.deadline.getTime());
  });
});

describe("daysRemaining", () => {
  it("è negativo quando il termine è già passato rispetto a oggi", () => {
    const deadline = new Date(2026, 8, 30); // mercoledì 30 settembre 2026
    const today = new Date(2026, 9, 5); // lunedì 5 ottobre 2026, dopo il termine
    expect(daysRemaining(deadline, today)).toBeLessThan(0);
  });
});
