"use client";

/**
 * Le risposte del percorso, in localStorage (docs/ux-spec.md §7).
 * Chiave unica versionata `kit209.v1`, scritta a ogni cambio di risposta.
 * Nessun dato lascia il dispositivo.
 *
 * Qui NON vive nessuna regola di dominio: si conserva quello che la persona ha
 * risposto e lo si traduce nel tipo `Answers` perche' le funzioni di
 * `@/domain/` possano lavorarci.
 */

import { useCallback, useEffect, useState } from "react";
import type { PresentedBy } from "@/domain/routing";
import type { Answers, MotivoCode } from "@/domain/types";
import type { Lang } from "@/i18n";

export const STORAGE_KEY = "kit209.v1";

export interface StoredAnswers {
  motivo: MotivoCode | null;
  presentedBy: PresentedBy | null;
  /** "AAAA-MM-GG": la stringa dell'input date, senza fuso orario. */
  entryDate: string | null;
  province: string | null;
  hasIncome: boolean | null;
}

export const EMPTY_ANSWERS: StoredAnswers = {
  motivo: null,
  presentedBy: null,
  entryDate: null,
  province: null,
  hasIncome: null,
};

/**
 * Dati palesemente finti, per la demo: a storage vuoto si parte gia' compilati,
 * cosi' si puo' sempre proseguire fino al riepilogo senza digitare nulla.
 * Nessun dato reale: nomi, indirizzi e numeri sono inventati (vedi CLAUDE.md).
 */
export const DEMO_ANSWERS: StoredAnswers = {
  motivo: "16",
  presentedBy: "interessato",
  entryDate: "2026-09-15",
  province: "RM",
  hasIncome: true,
};

export function loadAnswers(): StoredAnswers {
  if (typeof window === "undefined") return EMPTY_ANSWERS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_ANSWERS;
    const parsed = JSON.parse(raw) as Partial<StoredAnswers>;
    return { ...EMPTY_ANSWERS, ...parsed };
  } catch {
    // localStorage negato o JSON rotto: si riparte dalla demo, non si rompe la pagina.
    return DEMO_ANSWERS;
  }
}

export function saveAnswers(answers: StoredAnswers): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* modalita' privata o quota piena: si continua senza persistenza */
  }
}

/**
 * Risposte + "oggi", disponibili solo dopo il mount: prima di allora il server
 * non puo' conoscerle e disegnare un valore diverso sarebbe un mismatch.
 */
export function useStoredAnswers() {
  const [answers, setAnswers] = useState<StoredAnswers>(EMPTY_ANSWERS);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setAnswers(loadAnswers());
    setToday(new Date());
  }, []);

  const update = useCallback((patch: Partial<StoredAnswers>) => {
    setAnswers((prev) => {
      const next = { ...prev, ...patch };
      saveAnswers(next);
      return next;
    });
  }, []);

  return { answers, today, ready: today !== null, update };
}

/** "AAAA-MM-GG" → Date locale a mezzanotte. Stringa non valida → null. */
export function parseDay(iso: string | null): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Il tipo `Answers` del dominio a partire da quello che sappiamo. I campi che il
 * percorso non chiede restano vuoti: da qui si leggono SOLO gli esiti che
 * riguardano le risposte date (es. la casella 48).
 *
 * `stayLongerThan3Months`: il percorso non fa questa domanda (le domande sono
 * cinque, docs/specs/B2B). Resta `true`, cioe' il caso del permesso.
 */
export function toDomainAnswers(stored: StoredAnswers): Answers {
  return {
    motivo: stored.motivo ?? "altro",
    presentedBy: stored.presentedBy ?? "interessato",
    stayLongerThan3Months: true,
    entryDate: parseDay(stored.entryDate),
    surname: "",
    given: "",
    passport: { number: "", expiry: null },
    residence: { via: "", comune: "", cap: "", provincia: stored.province ?? "" },
    communicationAddress: null,
    istanza: "rilascio",
    durata: "1-2-anni",
    ageYears: 18,
    childrenUnder14: 0,
    hasIncome: stored.hasIncome === true,
    signatureConfirmed: false,
    sheetCountConfirmed: false,
  };
}

const LOCALE: Record<Lang, string> = { it: "it-IT", en: "en-GB", fr: "fr-FR", es: "es-ES" };

/** "martedì 30 settembre 2026": mai 30/09 (docs/ux-spec.md §6). */
export function formatLongDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** "martedì 30 settembre", per le righe dell'elenco dei giorni. */
export function formatDayInList(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

/** Sostituisce i segnaposto `{nome}` in una stringa tradotta. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match
  );
}
