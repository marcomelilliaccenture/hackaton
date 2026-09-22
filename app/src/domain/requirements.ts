// app/src/domain/requirements.ts
// Quali fotocopie servono, per tipologia — R-22…R-26, R-33.
// Puro: nessun import da React. `official` e' il nome burocratico di F1 ALLA LETTERA;
// il testo semplice sta in i18n, qui si dichiara solo la chiave (i18nKey, mai una frase).
// R-25: tutto in fotocopia A4 nella busta, originali da esibire alla convocazione.
// R-26: niente autocertificazione — i certificati vanno chiesti all'Amministrazione competente.
// R-33: F1 §B e' il documento di una singola Questura: e' una checklist TIPO, non vincolante.

import type { Istanza, MotivoCode } from "@/domain/types";

export interface DocumentRequirement {
  id: string;
  /** nome burocratico di F1, alla lettera */
  official: string;
  /** nome semplice + com'e' fatto + dove si trova: i testi stanno in i18n */
  i18nKey: string;
  motivi: MotivoCode[];
  /** il contratto di soggiorno e' SOLO primo rilascio — R-23 */
  onlyFor?: Istanza[];
  copyInEnvelope: boolean;
  originalAtAppointment: boolean;
  source: string;
}

const TUTTI_I_MOTIVI: MotivoCode[] = ["16", "31", "13", "altro"];

/** R-22 — documenti comuni a tutti i titoli. Fonte: F1 §A */
const COMUNI: DocumentRequirement[] = [
  {
    id: "bollo",
    official: "marca da bollo da € 16,00",
    i18nKey: "documenti.bollo",
    motivi: TUTTI_I_MOTIVI,
    copyInEnvelope: false,
    originalAtAppointment: true,
    source: "F1 §A · F6",
  },
  {
    id: "copia-passaporto",
    official:
      "fotocopia del passaporto o altro documento equipollente in corso di validità (pagine con i dati anagrafici, la scadenza, i visti e i timbri)",
    i18nKey: "documenti.copia-passaporto",
    motivi: TUTTI_I_MOTIVI,
    copyInEnvelope: true,
    originalAtAppointment: true,
    source: "F1 §A",
  },
  {
    id: "copia-permesso",
    official: "fotocopia del permesso di soggiorno, se in possesso",
    i18nKey: "documenti.copia-permesso",
    motivi: TUTTI_I_MOTIVI,
    copyInEnvelope: true,
    originalAtAppointment: true,
    source: "F1 §A",
  },
  {
    id: "copia-codice-fiscale",
    official: "fotocopia del codice fiscale, se in possesso",
    i18nKey: "documenti.copia-codice-fiscale",
    motivi: TUTTI_I_MOTIVI,
    copyInEnvelope: true,
    originalAtAppointment: true,
    source: "F1 §A",
  },
  {
    id: "certificazione-dimora",
    official:
      "certificazione dell'attuale dimora: certificato di residenza oppure dichiarazione di ospitalità o cessione di fabbricato vidimata",
    i18nKey: "documenti.certificazione-dimora",
    motivi: TUTTI_I_MOTIVI,
    copyInEnvelope: true,
    originalAtAppointment: true,
    source: "F1 §A",
  },
];

/** R-23 — lavoro subordinato (motivo 16). Fonte: F1 */
const LAVORO_SUBORDINATO: DocumentRequirement[] = [
  {
    id: "contratto-di-soggiorno",
    official: "contratto di soggiorno rilasciato dallo Sportello Unico per l'immigrazione",
    i18nKey: "documenti.contratto-di-soggiorno",
    motivi: ["16"],
    onlyFor: ["rilascio"],
    copyInEnvelope: true,
    originalAtAppointment: true,
    source: "F1",
  },
  {
    id: "modello-unilav",
    official: "modello UNILAV (comunicazione obbligatoria di assunzione)",
    i18nKey: "documenti.modello-unilav",
    motivi: ["16"],
    copyInEnvelope: true,
    originalAtAppointment: true,
    source: "F1",
  },
  {
    id: "dichiarazione-redditi",
    official: "dichiarazione dei redditi o CUD",
    i18nKey: "documenti.dichiarazione-redditi",
    motivi: ["16"],
    copyInEnvelope: true,
    originalAtAppointment: true,
    source: "F1",
  },
  {
    id: "ultima-busta-paga",
    official: "ultima busta paga",
    i18nKey: "documenti.ultima-busta-paga",
    motivi: ["16"],
    copyInEnvelope: true,
    originalAtAppointment: true,
    source: "F1",
  },
];

const PER_MOTIVO: Record<string, DocumentRequirement[]> = {
  "16": LAVORO_SUBORDINATO,
};

/**
 * Checklist tipo per motivo e tipologia di istanza (R-33: le Questure variano).
 * Un motivo sconosciuto non lancia: restituisce almeno il blocco comune (R-22).
 */
export function requirementsFor(motivo: MotivoCode, istanza: Istanza): DocumentRequirement[] {
  const specifici = PER_MOTIVO[motivo] ?? [];
  const tutti = [...COMUNI, ...specifici];

  const visti = new Set<string>();
  return tutti.filter((req) => {
    if (req.onlyFor && !req.onlyFor.includes(istanza)) return false;
    if (visti.has(req.id)) return false;
    visti.add(req.id);
    return true;
  });
}
