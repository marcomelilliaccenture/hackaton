"use client";

/**
 * Le risposte delle schermate del MOD. 209, in localStorage.
 * Chiave versionata `kit209.modulo.v1`, accanto (non dentro) a quella del
 * percorso: `app/src/app/percorso/answers.ts` non e' scrivibile da questo
 * blocco (docs/specs/B4A-modulo-1-4.md, sezione File).
 *
 * Qui NON vive nessuna regola di dominio: si conserva quello che la persona ha
 * scritto e lo si traduce nel tipo `Answers` perche' i validatori di
 * `@/domain/validators` possano lavorarci.
 */

import { useCallback, useEffect, useState } from "react";
import type { Address, Answers } from "@/domain/types";
import { toDomainAnswers, type StoredAnswers } from "@/app/percorso/answers";

export const MODULO_STORAGE_KEY = "kit209.modulo.v1";

/** nota (q): la sezione 8 si compila solo se il recapito e' diverso. */
export type SceltaRecapito = "stesso" | "altro";

export interface ModuloAnswers {
  /** caselle 3 e 4, come sul passaporto */
  cognome: string;
  nome: string;
  /** la riga in basso del passaporto, digitata dalla persona: facoltativa */
  mrz: string;
  /** sezione 7, casella 68: l'indirizzo dove la persona vive */
  residenzaIndirizzo: string;
  /** nota (q): `null` finche' la persona non sceglie */
  sceltaRecapito: SceltaRecapito | null;
  /** sezione 8, caselle 77-84 */
  presso: string;
  provincia: string;
  comune: string;
  indirizzo: string;
  civico: string;
  scala: string;
  interno: string;
  cap: string;
}

export const EMPTY_MODULO: ModuloAnswers = {
  cognome: "",
  nome: "",
  mrz: "",
  residenzaIndirizzo: "",
  sceltaRecapito: null,
  presso: "",
  provincia: "",
  comune: "",
  indirizzo: "",
  civico: "",
  scala: "",
  interno: "",
  cap: "",
};

/**
 * Dati palesemente finti, per la demo: a storage vuoto il Modulo 1 e' gia'
 * compilato. `sceltaRecapito: "stesso"` tiene la sezione 8 vuota (nota q), che
 * e' uno stato valido, non un dato mancante. Nessun dato reale.
 */
export const DEMO_MODULO: ModuloAnswers = {
  cognome: "Di Prova",
  nome: "Esempio",
  mrz: "",
  residenzaIndirizzo: "Via di Prova 12",
  sceltaRecapito: "stesso",
  presso: "",
  provincia: "",
  comune: "",
  indirizzo: "",
  civico: "",
  scala: "",
  interno: "",
  cap: "",
};

export function loadModulo(): ModuloAnswers {
  if (typeof window === "undefined") return EMPTY_MODULO;
  try {
    const raw = window.localStorage.getItem(MODULO_STORAGE_KEY);
    if (!raw) return DEMO_MODULO;
    const parsed = JSON.parse(raw) as Partial<ModuloAnswers>;
    return { ...EMPTY_MODULO, ...parsed };
  } catch {
    // localStorage negato o JSON rotto: si riparte dalla demo, non si rompe la pagina.
    return DEMO_MODULO;
  }
}

export function saveModulo(answers: ModuloAnswers): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MODULO_STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* modalita' privata o quota piena: si continua senza persistenza */
  }
}

/** Disponibili solo dopo il mount: il server non puo' conoscerle. */
export function useModuloAnswers() {
  const [modulo, setModulo] = useState<ModuloAnswers>(EMPTY_MODULO);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setModulo(loadModulo());
    setMounted(true);
  }, []);

  const update = useCallback((patch: Partial<ModuloAnswers>) => {
    setModulo((prev) => {
      const next = { ...prev, ...patch };
      saveModulo(next);
      return next;
    });
  }, []);

  return { modulo, mounted, update };
}

/**
 * La sezione 8 come `Address`. La nota (q) e' una scelta della persona: se
 * riceve la posta dove vive, la sezione 8 resta vuota e qui si ritorna `null`,
 * che e' esattamente cio' che `Answers.communicationAddress` significa.
 */
export function recapitoAddress(m: ModuloAnswers): Address | null {
  if (m.sceltaRecapito !== "altro") return null;
  return {
    presso: m.presso,
    via: m.indirizzo,
    civico: m.civico,
    comune: m.comune,
    cap: m.cap,
    provincia: m.provincia,
  };
}

/**
 * Sezione 7 (caselle 65-72) per quel poco che questo strumento ne chiede:
 * l'indirizzo, casella 68. Le altre caselle della sezione non sono raccolte da
 * nessuna schermata, quindi restano vuote: il dominio le legge come "sezione 7
 * non compilata", che e' la verita'.
 */
export function residenzaAddress(m: ModuloAnswers): Address {
  return { via: m.residenzaIndirizzo, comune: "", cap: "", provincia: "" };
}

/** Le risposte del percorso piu' quelle del modulo, nel tipo del dominio. */
export function toAnswersConModulo(stored: StoredAnswers, m: ModuloAnswers): Answers {
  const base = toDomainAnswers(stored);
  return {
    ...base,
    surname: m.cognome,
    given: m.nome,
    passport: { ...base.passport, mrz: m.mrz.trim() === "" ? undefined : m.mrz },
    residence: residenzaAddress(m),
    communicationAddress: recapitoAddress(m),
  };
}
