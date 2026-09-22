import { describe, expect, it } from "vitest";
import { channelFor, type RoutingReason } from "@/domain/routing";

describe("channelFor — R-03…R-06", () => {
  it("il motivo 16 presentato dall'interessata con soggiorno lungo instrada all'ufficio postale senza motivi", () => {
    const result = channelFor({
      motivo: "16",
      presentedBy: "interessato",
      stayLongerThan3Months: true,
    });
    expect(result.channel).toBe("ufficio-postale");
    expect(result.reasons).toEqual([]);
  });

  it("il motivo 16 presentato da un terzo autorizzato instrada in questura per PRESENTATO_DA_TERZO", () => {
    const result = channelFor({
      motivo: "16",
      presentedBy: "terzo-autorizzato",
      stayLongerThan3Months: true,
    });
    expect(result.channel).toBe("questura");
    expect(result.reasons).toContain("PRESENTATO_DA_TERZO");
  });

  it("un minore non accompagnato instrada sempre in questura per MINORE_NON_ACCOMPAGNATO", () => {
    const result = channelFor({
      motivo: "16",
      presentedBy: "minore-non-accompagnato",
      stayLongerThan3Months: true,
    });
    expect(result.channel).toBe("questura");
    expect(result.reasons).toContain("MINORE_NON_ACCOMPAGNATO");
  });

  it("un soggiorno di 3 mesi o meno instrada alla dichiarazione di presenza per SOGGIORNO_BREVE", () => {
    const result = channelFor({
      motivo: "16",
      presentedBy: "interessato",
      stayLongerThan3Months: false,
    });
    expect(result.channel).toBe("dichiarazione-di-presenza");
    expect(result.reasons).toContain("SOGGIORNO_BREVE");
  });

  it("il motivo altro instrada in questura per MOTIVO_NON_RICONOSCIUTO, non essendo tra i 4 esposti", () => {
    const result = channelFor({
      motivo: "altro",
      presentedBy: "interessato",
      stayLongerThan3Months: true,
    });
    expect(result.channel).toBe("questura");
    expect(result.reasons).toContain("MOTIVO_NON_RICONOSCIUTO");
  });

  it("più condizioni contemporanee producono tutti i motivi, non solo il primo", () => {
    const result = channelFor({
      motivo: "altro",
      presentedBy: "terzo-autorizzato",
      stayLongerThan3Months: false,
    });
    const expected: RoutingReason[] = [
      "MOTIVO_NON_RICONOSCIUTO",
      "PRESENTATO_DA_TERZO",
      "SOGGIORNO_BREVE",
    ];
    expect(result.reasons).toHaveLength(3);
    expect(result.reasons).toEqual(expect.arrayContaining(expected));
  });

  it("i motivi di instradamento sono codici in maiuscolo, non frasi leggibili (contratto con l'i18n)", () => {
    const result = channelFor({
      motivo: "altro",
      presentedBy: "terzo-autorizzato",
      stayLongerThan3Months: false,
    });
    for (const reason of result.reasons) {
      expect(reason).toMatch(/^[A-Z_]+$/);
    }
  });
});
