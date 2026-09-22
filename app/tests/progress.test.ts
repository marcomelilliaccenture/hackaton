import { describe, expect, it } from "vitest";
import { sheetCount } from "@/domain/progress";
import type { Answers, Address } from "@/domain/types";

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
    sheetCountConfirmed: false,
    ...overrides,
  };
}

describe("sheetCount — R-11, casella 25", () => {
  it("senza reddito e senza documenti spuntati, il totale conta solo il Modulo 1", () => {
    const answers = baseAnswers({ hasIncome: false });
    const result = sheetCount(answers, []);
    expect(result.breakdown.some((b) => b.label.toLowerCase().includes("modulo 2"))).toBe(false);
    expect(result.proposed).toBeGreaterThan(0);
  });

  it("con reddito, il Modulo 2 aggiunge fogli al totale rispetto a senza reddito", () => {
    const senzaReddito = sheetCount(baseAnswers({ hasIncome: false }), []);
    const conReddito = sheetCount(baseAnswers({ hasIncome: true }), []);
    expect(conReddito.proposed).toBeGreaterThan(senzaReddito.proposed);
  });

  it("ogni documento spuntato aggiunge la propria voce al breakdown", () => {
    const senzaDocumenti = sheetCount(baseAnswers(), []);
    const conDocumenti = sheetCount(baseAnswers(), ["passaporto", "codice-fiscale"]);
    expect(conDocumenti.breakdown.length).toBeGreaterThan(senzaDocumenti.breakdown.length);
    expect(conDocumenti.proposed).toBeGreaterThan(senzaDocumenti.proposed);
  });

  it("il totale proposto e' sempre la somma esatta delle voci del breakdown", () => {
    const result = sheetCount(baseAnswers({ hasIncome: true }), ["passaporto"]);
    const somma = result.breakdown.reduce((acc, b) => acc + b.sheets, 0);
    expect(result.proposed).toBe(somma);
  });

  it("il numero di fogli e' sempre un intero, mai un valore decimale", () => {
    const result = sheetCount(baseAnswers({ hasIncome: true }), ["passaporto", "codice-fiscale"]);
    expect(Number.isInteger(result.proposed)).toBe(true);
    result.breakdown.forEach((b) => expect(Number.isInteger(b.sheets)).toBe(true));
  });
});
