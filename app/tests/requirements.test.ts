import { describe, expect, it } from "vitest";
import { requirementsFor } from "@/domain/requirements";

describe("requirementsFor — R-22…R-26, R-33", () => {
  it("il primo rilascio per lavoro subordinato richiede il contratto di soggiorno", () => {
    const result = requirementsFor("16", "rilascio");
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((r) => r.id === "contratto-di-soggiorno")).toBe(true);
  });

  it("al rinnovo il contratto di soggiorno non è richiesto", () => {
    const result = requirementsFor("16", "rinnovo");
    expect(result.some((r) => r.id === "contratto-di-soggiorno")).toBe(false);
  });

  it("la lista dei documenti non contiene id duplicati", () => {
    const result = requirementsFor("16", "rilascio");
    const ids = result.map((r) => r.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it("ogni documento ha il nome burocratico esatto e la fonte, mai vuoti", () => {
    const result = requirementsFor("16", "rilascio");
    for (const req of result) {
      expect(req.official.length).toBeGreaterThan(0);
      expect(req.source.length).toBeGreaterThan(0);
    }
  });

  it("ogni documento dichiara se va in busta come fotocopia e se l'originale va esibito alla convocazione", () => {
    const result = requirementsFor("16", "rilascio");
    for (const req of result) {
      expect(typeof req.copyInEnvelope).toBe("boolean");
      expect(typeof req.originalAtAppointment).toBe("boolean");
    }
  });

  it("una tipologia di motivo sconosciuta non lancia e ritorna almeno il blocco comune a tutti i titoli", () => {
    const result = requirementsFor("altro", "rilascio");
    expect(() => requirementsFor("altro", "rilascio")).not.toThrow();
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((r) => r.id === "bollo")).toBe(true);
  });

  it("il blocco comune a tutti i titoli compare anche per il motivo 16", () => {
    const result = requirementsFor("16", "rilascio");
    expect(result.some((r) => r.id === "bollo")).toBe(true);
    expect(result.some((r) => r.id === "copia-passaporto")).toBe(true);
  });

  it("nessun requisito restituisce una frase leggibile al posto di un codice: i18nKey è una chiave, non un testo con spazi", () => {
    const result = requirementsFor("16", "rilascio");
    for (const req of result) {
      expect(req.i18nKey).not.toMatch(/\s/);
    }
  });
});
