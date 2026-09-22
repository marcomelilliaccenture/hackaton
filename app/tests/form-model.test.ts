import { describe, expect, it } from "vitest";
import { needsModulo2, stepsFor } from "@/domain/form-model";
import type { Address, Answers } from "@/domain/types";

// Tutte le date sono scritte a mano (mai new Date()), come richiesto dallo spec B3A.

const RESIDENCE: Address = {
  via: "via Roma 1",
  comune: "Modena",
  cap: "41100",
  provincia: "MO",
};

function baseAnswers(overrides: Partial<Answers> = {}): Answers {
  return {
    motivo: "16",
    presentedBy: "interessato",
    stayLongerThan3Months: true,
    entryDate: new Date(2026, 8, 18),
    surname: "Diallo",
    given: "Fatou",
    passport: { number: "AB123456", expiry: new Date(2027, 8, 1), mrz: "P<SENDIALLO<<FATOU<<<<<<<<<<<<<<<<<<<<<<<<<" },
    residence: RESIDENCE,
    communicationAddress: null,
    istanza: "rilascio",
    durata: "1-2-anni",
    ageYears: 29,
    childrenUnder14: 0,
    hasIncome: true,
    signatureConfirmed: true,
    sheetCountConfirmed: true,
    ...overrides,
  };
}

describe("needsModulo2 — R-14", () => {
  it("chi percepisce un reddito deve compilare il Modulo 2", () => {
    const answers = baseAnswers({ hasIncome: true });
    expect(needsModulo2(answers)).toBe(true);
  });

  it("chi non percepisce nessun reddito non deve compilare il Modulo 2", () => {
    const answers = baseAnswers({ hasIncome: false });
    expect(needsModulo2(answers)).toBe(false);
  });
});

describe("stepsFor — R-12, nota (f)", () => {
  it("senza reddito, l'elenco dei passi non contiene il Modulo 2", () => {
    const answers = baseAnswers({ hasIncome: false });
    const steps = stepsFor(answers);
    expect(steps.some((s) => s.id === "modulo-2")).toBe(false);
  });

  it("con reddito, l'elenco dei passi contiene il Modulo 2", () => {
    const answers = baseAnswers({ hasIncome: true });
    const steps = stepsFor(answers);
    expect(steps.some((s) => s.id === "modulo-2")).toBe(true);
  });

  it("il passo di firma richiede, direttamente o a cascata, tutti i passi precedenti", () => {
    const answers = baseAnswers({ hasIncome: true });
    const steps = stepsFor(answers);
    const firma = steps.find((s) => s.id === "firma");
    expect(firma).toBeDefined();
    // la nota (f) impone che il controllo finale si sblocchi per ultimo: il passo di firma
    // deve dichiarare almeno una dipendenza, non essere raggiungibile "a freddo".
    expect(firma?.requires.length).toBeGreaterThan(0);
  });

  it("il passo di firma non e' il primo della lista imposta dalla nota (f)", () => {
    const answers = baseAnswers({ hasIncome: true });
    const steps = stepsFor(answers);
    const indexFirma = steps.findIndex((s) => s.id === "firma");
    const indexModulo1 = steps.findIndex((s) => s.id === "modulo-1");
    expect(indexModulo1).toBeGreaterThanOrEqual(0);
    expect(indexFirma).toBeGreaterThan(indexModulo1);
  });

  it("quando c'e' reddito, il passo di firma viene dopo il Modulo 2 nell'ordine dei passi", () => {
    const answers = baseAnswers({ hasIncome: true });
    const steps = stepsFor(answers);
    const indexModulo2 = steps.findIndex((s) => s.id === "modulo-2");
    const indexFirma = steps.findIndex((s) => s.id === "firma");
    expect(indexModulo2).toBeGreaterThanOrEqual(0);
    expect(indexFirma).toBeGreaterThan(indexModulo2);
  });
});
