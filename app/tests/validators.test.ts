import { describe, expect, it } from "vitest";
import {
  validateName,
  validateCommunicationAddress,
  validatePassport,
  validateAll,
} from "@/domain/validators";
import type { Address, Answers, PassportData, Issue } from "@/domain/types";

// Tutte le date sono scritte a mano (mai new Date()), come richiesto dallo spec B3A.
//
// NB sulle caselle del recapito (76-84): lo spec B3A elenca ADDRESS_SAME_AS_RESIDENCE e
// ADDRESS_EMPTY_NO_STABLE come casella 76, ma 76 e' l'intestazione della sezione 8 (nota q,
// non compilabile): il campo PRESSO compilabile e' la casella 77 (nota r). Su istruzione
// esplicita ricevuta insieme allo spec, questi test asseriscono field: 77, non 76: e' un
// difetto noto dello spec, segnalato in report.

const RESIDENCE: Address = {
  via: "via Roma 1",
  comune: "Modena",
  cap: "41100",
  provincia: "MO",
};

function emptyAddress(): Address {
  return { via: "", comune: "", cap: "", provincia: "" };
}

describe("validateName — R-07, caselle 3 e 4", () => {
  it("cognome e nome sembrano invertiti rispetto alla MRZ", () => {
    const issues = validateName({
      surname: "Fatou",
      given: "Diallo",
      passportMrz: "P<SENDIALLO<<FATOU<<<<<<<<<<<<<<<<<<<<<<<<<",
    });
    expect(issues.map((i) => i.code)).toContain("NAME_ORDER_SUSPECT");
  });

  it("cognome e nome nell'ordine giusto non generano nessun issue", () => {
    const issues = validateName({
      surname: "Diallo",
      given: "Fatou",
      passportMrz: "P<SENDIALLO<<FATOU<<<<<<<<<<<<<<<<<<<<<<<<<",
    });
    expect(issues).toHaveLength(0);
  });

  it("un nome assente dalla MRZ genera NAME_NOT_IN_MRZ", () => {
    const issues = validateName({
      surname: "Diallo",
      given: "Aminata",
      passportMrz: "P<SENDIALLO<<FATOU<<<<<<<<<<<<<<<<<<<<<<<<<",
    });
    expect(issues.map((i) => i.code)).toContain("NAME_NOT_IN_MRZ");
  });

  it("caratteri non latini nel nome generano NAME_NON_LATIN", () => {
    const issues = validateName({
      surname: "Дialло",
      given: "Fatou",
      passportMrz: "P<SENDIALLO<<FATOU<<<<<<<<<<<<<<<<<<<<<<<<<",
    });
    expect(issues.map((i) => i.code)).toContain("NAME_NON_LATIN");
  });

  it("gli issue sul nome riportano la casella 3 o 4, non altre", () => {
    const issues = validateName({
      surname: "Fatou",
      given: "Diallo",
      passportMrz: "P<SENDIALLO<<FATOU<<<<<<<<<<<<<<<<<<<<<<<<<",
    });
    issues.forEach((i) => expect([3, 4]).toContain(i.field));
  });
});

describe("validateCommunicationAddress — R-08, caselle 76-84", () => {
  it("un CAP di un'altra provincia e' un avviso, non un errore", () => {
    const address: Address = { via: "via Torino 5", comune: "Milano", cap: "20100", provincia: "MO" };
    const issues = validateCommunicationAddress(address, RESIDENCE, "MO");
    const mismatch = issues.find((i) => i.code === "ADDRESS_PROVINCE_MISMATCH");
    expect(mismatch).toBeDefined();
    expect(mismatch?.severity).toBe("warning");
    expect(issues.some((i) => i.severity === "error")).toBe(false);
  });

  it("il CAP incoerente e' segnalato sulla casella 84", () => {
    const address: Address = { via: "via Torino 5", comune: "Milano", cap: "20100", provincia: "MO" };
    const issues = validateCommunicationAddress(address, RESIDENCE, "MO");
    const mismatch = issues.find((i) => i.code === "ADDRESS_PROVINCE_MISMATCH");
    expect(mismatch?.field).toBe(84);
  });

  it("un CAP coerente con la provincia non genera nessun issue di mismatch", () => {
    const address: Address = { via: "via Emilia 2", comune: "Modena", cap: "41100", provincia: "MO" };
    const issues = validateCommunicationAddress(address, RESIDENCE, "MO");
    expect(issues.some((i) => i.code === "ADDRESS_PROVINCE_MISMATCH")).toBe(false);
  });

  it("una provincia fuori dalla tabella della demo non emette nessun issue di mismatch", () => {
    const address: Address = { via: "via Napoli 9", comune: "Napoli", cap: "80100", provincia: "NA" };
    const issues = validateCommunicationAddress(address, RESIDENCE, "NA");
    expect(issues.some((i) => i.code === "ADDRESS_PROVINCE_MISMATCH")).toBe(false);
  });

  it("il recapito vuoto senza un indirizzo in sezione 7 e' un errore", () => {
    const issues = validateCommunicationAddress(emptyAddress(), emptyAddress(), "");
    const empty = issues.find((i) => i.code === "ADDRESS_EMPTY_NO_STABLE");
    expect(empty).toBeDefined();
    expect(empty?.severity).toBe("error");
    expect(empty?.field).toBe(77);
  });

  it("il recapito identico alla residenza e' solo un'informazione, non un errore", () => {
    const issues = validateCommunicationAddress(RESIDENCE, RESIDENCE, "MO");
    const same = issues.find((i) => i.code === "ADDRESS_SAME_AS_RESIDENCE");
    expect(same).toBeDefined();
    expect(same?.severity).toBe("info");
    expect(same?.field).toBe(77);
  });
});

describe("validatePassport — caselle 44, 45", () => {
  it("un passaporto scaduto il 1 settembre 2026 con ingresso il 18 settembre 2026 e' un errore", () => {
    const passport: PassportData = { number: "AB123456", expiry: new Date(2026, 8, 1) };
    const entryDate = new Date(2026, 8, 18);
    const issues = validatePassport(passport, entryDate);
    const expired = issues.find((i) => i.code === "PASSPORT_EXPIRED_BEFORE_ENTRY");
    expect(expired).toBeDefined();
    expect(expired?.severity).toBe("error");
    expect(expired?.field).toBe(45);
  });

  it("un passaporto valido dopo la data di ingresso non genera PASSPORT_EXPIRED_BEFORE_ENTRY", () => {
    const passport: PassportData = { number: "AB123456", expiry: new Date(2027, 8, 1) };
    const entryDate = new Date(2026, 8, 18);
    const issues = validatePassport(passport, entryDate);
    expect(issues.some((i) => i.code === "PASSPORT_EXPIRED_BEFORE_ENTRY")).toBe(false);
  });

  it("un numero di passaporto vuoto e' un errore sulla casella 44", () => {
    const passport: PassportData = { number: "", expiry: new Date(2027, 8, 1) };
    const entryDate = new Date(2026, 8, 18);
    const issues = validatePassport(passport, entryDate);
    const empty = issues.find((i) => i.code === "PASSPORT_NUMBER_EMPTY");
    expect(empty).toBeDefined();
    expect(empty?.severity).toBe("error");
    expect(empty?.field).toBe(44);
  });
});

describe("nessuna funzione di validazione restituisce una stringa leggibile", () => {
  const CODICI_AMMESSI = new Set([
    "NAME_NOT_IN_MRZ",
    "NAME_NON_LATIN",
    "NAME_ORDER_SUSPECT",
    "ADDRESS_PROVINCE_MISMATCH",
    "ADDRESS_SAME_AS_RESIDENCE",
    "ADDRESS_EMPTY_NO_STABLE",
    "PASSPORT_EXPIRED_BEFORE_ENTRY",
    "PASSPORT_NUMBER_EMPTY",
    "ENTRY_DATE_FUTURE",
    "ENTRY_DATE_TOO_OLD",
    "DEADLINE_PASSED",
    "SIGNATURE_REQUIRED",
    "SHEET_COUNT_UNCONFIRMED",
  ]);

  function assertOnlyCodes(issues: Issue[]) {
    issues.forEach((issue) => {
      expect(CODICI_AMMESSI.has(issue.code)).toBe(true);
      expect(issue.code).toEqual(issue.code.toUpperCase());
      expect(issue.code).not.toMatch(/[a-z]/);
      expect(issue.code).not.toContain(" ");
    });
  }

  it("validateName produce solo codici della tabella, mai frasi", () => {
    assertOnlyCodes(
      validateName({
        surname: "Fatou",
        given: "Diallo",
        passportMrz: "P<SENDIALLO<<FATOU<<<<<<<<<<<<<<<<<<<<<<<<<",
      })
    );
  });

  it("validateCommunicationAddress produce solo codici della tabella, mai frasi", () => {
    assertOnlyCodes(validateCommunicationAddress(emptyAddress(), emptyAddress(), ""));
  });

  it("validatePassport produce solo codici della tabella, mai frasi", () => {
    assertOnlyCodes(validatePassport({ number: "", expiry: null }, new Date(2026, 8, 18)));
  });
});

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

describe("validateAll — R-01, R-02, R-13", () => {
  it("una data di ingresso nel futuro rispetto a oggi e' un errore", () => {
    const today = new Date(2026, 8, 1);
    const answers = baseAnswers({ entryDate: new Date(2026, 8, 18) });
    const issues = validateAll(answers, today);
    const future = issues.find((i) => i.code === "ENTRY_DATE_FUTURE");
    expect(future).toBeDefined();
    expect(future?.severity).toBe("error");
  });

  it("una data di ingresso oltre 90 giorni nel passato e' un avviso", () => {
    const today = new Date(2026, 11, 31);
    const answers = baseAnswers({ entryDate: new Date(2026, 8, 18) });
    const issues = validateAll(answers, today);
    const tooOld = issues.find((i) => i.code === "ENTRY_DATE_TOO_OLD");
    expect(tooOld).toBeDefined();
    expect(tooOld?.severity).toBe("warning");
  });

  it("una firma non confermata e' un errore sulla casella 29", () => {
    const today = new Date(2026, 8, 20);
    const answers = baseAnswers({ signatureConfirmed: false });
    const issues = validateAll(answers, today);
    const signature = issues.find((i) => i.code === "SIGNATURE_REQUIRED");
    expect(signature).toBeDefined();
    expect(signature?.severity).toBe("error");
    expect(signature?.field).toBe(29);
  });

  it("il numero di fogli non confermato e' solo un'informazione sulla casella 25", () => {
    const today = new Date(2026, 8, 20);
    const answers = baseAnswers({ sheetCountConfirmed: false });
    const issues = validateAll(answers, today);
    const sheetCount = issues.find((i) => i.code === "SHEET_COUNT_UNCONFIRMED");
    expect(sheetCount).toBeDefined();
    expect(sheetCount?.severity).toBe("info");
    expect(sheetCount?.field).toBe(25);
  });

  it("un termine gia' passato e' un avviso, non un errore che blocca la compilazione", () => {
    const today = new Date(2026, 9, 5); // lunedi' 5 ottobre 2026, dopo il termine dell'8 giorni lavorativi
    const answers = baseAnswers({ entryDate: new Date(2026, 8, 18) }); // venerdi' 18 settembre 2026
    const issues = validateAll(answers, today);
    const passed = issues.find((i) => i.code === "DEADLINE_PASSED");
    expect(passed).toBeDefined();
    expect(passed?.severity).toBe("warning");
  });
});
