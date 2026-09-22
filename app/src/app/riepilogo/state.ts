"use client";

/**
 * Lo stato del kit, dietro una sola API.
 *
 * I dati stanno in quattro chiavi di localStorage, ognuna di chi la scrive:
 *   `kit209.v1`            le cinque domande del percorso   (percorso/answers.ts)
 *   `kit209.modulo.v1`     i campi del MOD. 209             (modulo/modulo-answers.ts)
 *   `kit209.documenti.v1`  le spunte degli allegati         (documenti/checked-docs.ts)
 *   `kit209.riepilogo.v1`  le due conferme di questa pagina (qui)
 *
 * Qui non si copia niente: si compone. `useKitState()` legge tutte e quattro e
 * restituisce un solo `Answers` del dominio, cosi' `/riepilogo` chiama
 * `validateAll`, `sheetCount`, `feesFor` e `requirementsFor` sugli stessi dati
 * che le altre schermate hanno scritto.
 *
 * Nessuna regola di dominio vive in questo file.
 */

import { useCallback, useEffect, useState } from "react";
import { loadCheckedDocs } from "@/app/documenti/checked-docs";
import {
  toAnswersConModulo,
  useModuloAnswers,
  type ModuloAnswers,
} from "@/app/modulo/modulo-answers";
import { useStoredAnswers, type StoredAnswers } from "@/app/percorso/answers";
import { requirementsFor } from "@/domain/requirements";
import type { Answers } from "@/domain/types";

export const RIEPILOGO_STORAGE_KEY = "kit209.riepilogo.v1";

/** Le due conferme che la persona da' solo qui: casella 29 e casella 25. */
export interface RiepilogoConferme {
  /** R-13, casella 29 — «ho firmato». */
  signatureConfirmed: boolean;
  /** R-11, casella 25 — «il numero di fogli proposto e' quello giusto». */
  sheetCountConfirmed: boolean;
  /** cosa portare alla convocazione: spuntato, id per id (R-29) */
  convocazione: string[];
}

export const EMPTY_CONFERME: RiepilogoConferme = {
  signatureConfirmed: false,
  sheetCountConfirmed: false,
  convocazione: [],
};

/** Per la demo: a storage vuoto le due conferme sono gia' date. */
export const DEMO_CONFERME: RiepilogoConferme = {
  signatureConfirmed: true,
  sheetCountConfirmed: true,
  convocazione: [],
};

function loadConferme(defaultValue: RiepilogoConferme = EMPTY_CONFERME): RiepilogoConferme {
  if (typeof window === "undefined") return EMPTY_CONFERME;
  try {
    const raw = window.localStorage.getItem(RIEPILOGO_STORAGE_KEY);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw) as Partial<RiepilogoConferme>;
    return {
      ...EMPTY_CONFERME,
      ...parsed,
      convocazione: Array.isArray(parsed.convocazione)
        ? parsed.convocazione.filter((v): v is string => typeof v === "string")
        : [],
    };
  } catch {
    // localStorage negato o JSON rotto: si riparte da vuoto, non si rompe la pagina.
    return EMPTY_CONFERME;
  }
}

function saveConferme(value: RiepilogoConferme): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RIEPILOGO_STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* modalita' privata o quota piena: si continua senza persistenza */
  }
}

export interface KitState {
  /** vero solo dopo il mount: prima il server non puo' sapere cosa c'e' scritto */
  ready: boolean;
  today: Date | null;
  stored: StoredAnswers;
  modulo: ModuloAnswers;
  checkedDocs: string[];
  conferme: RiepilogoConferme;
  /** tutto quanto sopra nel tipo del dominio */
  answers: Answers;
  updateConferme: (patch: Partial<RiepilogoConferme>) => void;
}

export function useKitState(): KitState {
  const { answers: stored, today, ready } = useStoredAnswers();
  const { modulo, mounted } = useModuloAnswers();
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const [conferme, setConferme] = useState<RiepilogoConferme>(EMPTY_CONFERME);
  const [locale, setLocale] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const defaultIds = requirementsFor(stored.motivo ?? "altro", "rilascio").map((r) => r.id);
    setCheckedDocs(loadCheckedDocs(defaultIds));
    setConferme(loadConferme(DEMO_CONFERME));
    setLocale(true);
  }, [ready, stored.motivo]);

  const updateConferme = useCallback((patch: Partial<RiepilogoConferme>) => {
    setConferme((prev) => {
      const next = { ...prev, ...patch };
      saveConferme(next);
      return next;
    });
  }, []);

  const base = toAnswersConModulo(stored, modulo);
  const answers: Answers = {
    ...base,
    signatureConfirmed: conferme.signatureConfirmed,
    sheetCountConfirmed: conferme.sheetCountConfirmed,
  };

  return {
    ready: ready && mounted && locale,
    today,
    stored,
    modulo,
    checkedDocs,
    conferme,
    answers,
    updateConferme,
  };
}
