"use client";

/**
 * Le spunte della checklist degli allegati, in localStorage.
 * Chiave versionata `kit209.documenti.v1`. Vive qui, in un modulo solo, perche'
 * la leggono due schermate: `/documenti` (dove si spunta) e `/riepilogo` (dove
 * il conteggio dei fogli della casella 25 la usa). Nessun dato duplicato.
 */

export const CHECKED_DOCS_KEY = "kit209.documenti.v1";

/**
 * `defaultIds`: per la demo, a storage vuoto si spuntano gia' gli allegati
 * richiesti (chi chiama passa gli id di `requirementsFor()`), cosi' si puo'
 * sempre proseguire fino al riepilogo compilato.
 */
export function loadCheckedDocs(defaultIds: string[] = []): string[] {
  if (typeof window === "undefined") return defaultIds;
  try {
    const raw = window.localStorage.getItem(CHECKED_DOCS_KEY);
    if (!raw) return defaultIds;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    // localStorage negato o JSON rotto: si riparte dalla demo, non si rompe la pagina.
    return defaultIds;
  }
}

export function saveCheckedDocs(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHECKED_DOCS_KEY, JSON.stringify(ids));
  } catch {
    /* modalita' privata o quota piena: si continua senza persistenza */
  }
}
