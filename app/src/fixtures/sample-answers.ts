/**
 * Dati palesemente finti: nessun dato reale entra nel repo.
 * Il tipo `Answers` nasce una volta sola in `domain/types.ts`.
 */
import type { Answers } from "../domain/types";

export const SAMPLE: Answers = {
  motivo: "16",
  presentedBy: "interessato",
  stayLongerThan3Months: true,

  entryDate: new Date(2026, 0, 15), // 15 gennaio 2026, data costruita a mano

  surname: "Di Prova",
  given: "Esempio",
  passport: {
    number: "XX0000000",
    expiry: new Date(2030, 11, 31), // 31 dicembre 2030
    mrz: "P<XXXDI<PROVA<<ESEMPIO<<<<<<<<<<<<<<<<<<<<<<",
  },

  residence: {
    via: "Via di Esempio",
    civico: "0",
    comune: "Comune di Prova",
    cap: "00000",
    provincia: "XX",
  },
  communicationAddress: null,

  istanza: "rilascio",
  durata: "1-2-anni",
  ageYears: 29,
  childrenUnder14: 0,

  hasIncome: true,
  signatureConfirmed: false,
  sheetCountConfirmed: false,
};
