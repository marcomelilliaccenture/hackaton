import { describe, expect, it } from "vitest";
import { t } from "../src/i18n";

describe("t(key, lang)", () => {
  it("ritorna la chiave quando la traduzione manca", () => {
    expect(t("chiave.che.non.esiste", "fr")).toBe("chiave.che.non.esiste");
  });
});
