// app/src/domain/validators.ts
// R-07 (caselle 3, 4) · R-08 (caselle 76-84) · R-13 (casella 29) · R-11 (casella 25)
// R-01/R-02 sul termine, riusando deadline.ts.
//
// Puro: nessun import da React, nessuna frase leggibile. Si restituiscono SOLO codici:
// le parole stanno in i18n/. L'"oggi" arriva sempre dal chiamante, mai new Date().
//
// Severita': `error` SOLO dove l'istanza verrebbe respinta o la convocazione non
// arriverebbe. Tutto il resto e' warning o info (D-08: il CAP di un'altra provincia e'
// legittimo — il datore di lavoro puo' stare altrove — e quindi non blocca).
//
// Casella del recapito: la 76 e' l'intestazione della sezione 8 (nota q, non compilabile);
// il campo PRESSO compilabile e' la 77 (nota r, F9). Il CAP della sezione 8 e' la 84.

import { calendarDaysDeadline, daysRemaining, workingDaysDeadline } from "@/domain/deadline";
import { capFuoriProvincia } from "@/data/province";
import type { Address, Answers, Issue, PassportData, Severity } from "@/domain/types";

export type { Issue, Severity };

// ── caselle citate dai codici ────────────────────────────────────────────────
const CASELLA_COGNOME = 3;
const CASELLA_NOME = 4;
const CASELLA_FOGLI = 25;
const CASELLA_FIRMA = 29;
const CASELLA_PASSAPORTO_NUMERO = 44;
const CASELLA_PASSAPORTO_SCADENZA = 45;
const CASELLA_INGRESSO = 48;
const CASELLA_PRESSO = 77;
const CASELLA_CAP_COMUNICAZIONI = 84;

/** Oltre questa soglia l'ingresso e' cosi' lontano da meritare un avviso (non un blocco). */
const GIORNI_INGRESSO_TROPPO_VECCHIO = 90;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function issue(field: number, code: string, severity: Severity): Issue {
  return { field, code, severity };
}

function atMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function giorniTrascorsi(from: Date, to: Date): number {
  return Math.round((atMidnight(to).getTime() - atMidnight(from).getTime()) / MS_PER_DAY);
}

// ── R-07, caselle 3 e 4 ──────────────────────────────────────────────────────

/** Maiuscole, senza diacritici, senza doppi spazi: come la MRZ scrive i nomi. */
function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]+/g, " ")
    .trim();
}

/** Lettere latine, spazi, apostrofi e trattini: tutto il resto va traslitterato. */
function isLatin(value: string): boolean {
  const senzaDiacritici = value.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return /^[A-Za-z\s'\-.]*$/.test(senzaDiacritici);
}

export interface MrzNames {
  surname: string;
  given: string;
}

/**
 * Legge cognome e nome dalla riga MRZ digitata. Formato TD3:
 * `P<` + codice Stato (3 lettere) + COGNOME + `<<` + NOMI; i `<` fanno da spazio.
 * Ritorna null se la riga non e' riconoscibile: in quel caso non si dice nulla.
 */
export function parseMrzNames(mrz: string): MrzNames | null {
  const raw = mrz.trim().toUpperCase();
  if (!raw.includes("<<")) return null;
  const senzaPrefisso = raw.replace(/^P[A-Z<]?[A-Z<]{3}/, "");
  const [surnamePart, ...givenParts] = senzaPrefisso.split("<<");
  const surname = normalizeName(surnamePart.replace(/</g, " "));
  const given = normalizeName(givenParts.join(" ").replace(/</g, " "));
  if (!surname || !given) return null;
  return { surname, given };
}

export function validateName(i: {
  surname: string;
  given: string;
  passportMrz?: string;
}): Issue[] {
  const issues: Issue[] = [];

  if (!isLatin(i.surname) || !isLatin(i.given)) {
    // nota (a): il dato va riportato come scritto sul passaporto, cioe' traslitterato.
    issues.push(issue(CASELLA_COGNOME, "NAME_NON_LATIN", "warning"));
    return issues;
  }

  const mrz = i.passportMrz ? parseMrzNames(i.passportMrz) : null;
  if (!mrz) return issues;

  const surname = normalizeName(i.surname);
  const given = normalizeName(i.given);
  if (!surname && !given) return issues;

  if (surname === mrz.surname && given === mrz.given) return issues;

  if (surname === mrz.given && given === mrz.surname) {
    issues.push(issue(CASELLA_COGNOME, "NAME_ORDER_SUSPECT", "warning"));
    return issues;
  }

  const nellaMrz = new Set([...mrz.surname.split(" "), ...mrz.given.split(" ")]);
  if (surname && !surname.split(" ").every((t) => nellaMrz.has(t))) {
    issues.push(issue(CASELLA_COGNOME, "NAME_NOT_IN_MRZ", "warning"));
  }
  if (given && !given.split(" ").every((t) => nellaMrz.has(t))) {
    issues.push(issue(CASELLA_NOME, "NAME_NOT_IN_MRZ", "warning"));
  }

  return issues;
}

// ── R-08, caselle 76-84 ──────────────────────────────────────────────────────

function isAddressEmpty(a: Address | null | undefined): boolean {
  if (!a) return true;
  return ![a.presso, a.via, a.civico, a.comune, a.cap, a.provincia].some(
    (v) => (v ?? "").trim() !== ""
  );
}

function sameAddress(a: Address, b: Address): boolean {
  const key = (x: Address) =>
    [x.presso, x.via, x.civico, x.comune, x.cap, x.provincia]
      .map((v) => (v ?? "").trim().toLowerCase())
      .join("|");
  return key(a) === key(b);
}

/**
 * `province` e' la provincia dichiarata per il recapito: se vuota si usa quella
 * dell'indirizzo. Il CAP incoerente e' un avviso, mai un blocco (D-08).
 */
export function validateCommunicationAddress(
  a: Address,
  residence: Address,
  province: string
): Issue[] {
  const issues: Issue[] = [];
  const recapitoVuoto = isAddressEmpty(a);
  const residenzaVuota = isAddressEmpty(residence);

  if (recapitoVuoto) {
    if (residenzaVuota) {
      // la raccomandata di convocazione non arriverebbe da nessuna parte: e' un errore.
      issues.push(issue(CASELLA_PRESSO, "ADDRESS_EMPTY_NO_STABLE", "error"));
    }
    return issues;
  }

  if (!residenzaVuota && sameAddress(a, residence)) {
    // nota (q): "se uguale al precedente non compilare".
    issues.push(issue(CASELLA_PRESSO, "ADDRESS_SAME_AS_RESIDENCE", "info"));
  }

  const sigla = (province || a.provincia || "").trim();
  if (capFuoriProvincia(a.cap ?? "", sigla)) {
    issues.push(issue(CASELLA_CAP_COMUNICAZIONI, "ADDRESS_PROVINCE_MISMATCH", "warning"));
  }

  return issues;
}

// ── caselle 44, 45 ───────────────────────────────────────────────────────────

export function validatePassport(p: PassportData, entryDate: Date): Issue[] {
  const issues: Issue[] = [];

  if (!p.number || p.number.trim() === "") {
    issues.push(issue(CASELLA_PASSAPORTO_NUMERO, "PASSPORT_NUMBER_EMPTY", "error"));
  }

  if (p.expiry && entryDate && atMidnight(p.expiry).getTime() < atMidnight(entryDate).getTime()) {
    issues.push(issue(CASELLA_PASSAPORTO_SCADENZA, "PASSPORT_EXPIRED_BEFORE_ENTRY", "error"));
  }

  return issues;
}

// ── tutto insieme ────────────────────────────────────────────────────────────

export function validateAll(answers: Answers, today: Date): Issue[] {
  const issues: Issue[] = [];

  issues.push(
    ...validateName({
      surname: answers.surname,
      given: answers.given,
      passportMrz: answers.passport?.mrz,
    })
  );

  if (answers.entryDate) {
    issues.push(...validatePassport(answers.passport, answers.entryDate));
  } else if (!answers.passport?.number?.trim()) {
    issues.push(issue(CASELLA_PASSAPORTO_NUMERO, "PASSPORT_NUMBER_EMPTY", "error"));
  }

  const recapito = answers.communicationAddress;
  issues.push(
    ...validateCommunicationAddress(
      recapito ?? { via: "", comune: "", cap: "", provincia: "" },
      answers.residence,
      recapito?.provincia ?? ""
    )
  );

  if (answers.entryDate) {
    const scarto = giorniTrascorsi(answers.entryDate, today);
    if (scarto < 0) {
      issues.push(issue(CASELLA_INGRESSO, "ENTRY_DATE_FUTURE", "error"));
    } else {
      if (scarto > GIORNI_INGRESSO_TROPPO_VECCHIO) {
        issues.push(issue(CASELLA_INGRESSO, "ENTRY_DATE_TOO_OLD", "warning"));
      }
      // R-01: 8 giorni lavorativi. R-02: la lettura prudente di F5 e' a calendario;
      // il termine si dice passato quando anche il piu' largo dei due e' scaduto.
      const lavorativi = workingDaysDeadline(answers.entryDate).deadline;
      const calendario = calendarDaysDeadline(answers.entryDate);
      const piuLargo = calendario.getTime() > lavorativi.getTime() ? calendario : lavorativi;
      if (daysRemaining(piuLargo, today) < 0) {
        issues.push(issue(CASELLA_INGRESSO, "DEADLINE_PASSED", "warning"));
      }
    }
  }

  if (!answers.signatureConfirmed) {
    // nota (f): senza firma l'istanza non viene accettata allo sportello postale.
    issues.push(issue(CASELLA_FIRMA, "SIGNATURE_REQUIRED", "error"));
  }

  if (!answers.sheetCountConfirmed) {
    issues.push(issue(CASELLA_FOGLI, "SHEET_COUNT_UNCONFIRMED", "info"));
  }

  return issues;
}

/** A-11: gli issue di una singola casella. Il conteggio lo fa il dominio, non la pagina. */
export function issuesForField(issues: Issue[], field: number): Issue[] {
  return issues.filter((i) => i.field === field);
}
