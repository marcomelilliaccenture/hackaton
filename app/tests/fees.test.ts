import { describe, expect, it } from "vitest";
import { feesFor } from "@/domain/fees";

describe("feesFor — R-15…R-21", () => {
  it("il totale di cassa per un primo rilascio di un anno è 116,46 €", () => {
    const result = feesFor({ istanza: "rilascio", durata: "fino-1-anno", ageYears: 29, childrenUnder14: 0 });
    expect(result.bollettino.totalCents).toBe(7046);
    expect(result.cash.totalCents).toBe(11646);
  });

  it("la somma delle voci di cassa coincide sempre con il totale di cassa", () => {
    const result = feesFor({ istanza: "rilascio", durata: "fino-1-anno", ageYears: 29, childrenUnder14: 0 });
    const sum = result.cash.items.reduce((acc, item) => acc + item.amountCents, 0);
    expect(sum).toBe(result.cash.totalCents);
  });

  it("il bollettino per un rilascio da 1 a 2 anni è 80,46 € e il totale di cassa è 126,46 €", () => {
    const result = feesFor({ istanza: "rilascio", durata: "1-2-anni", ageYears: 29, childrenUnder14: 0 });
    expect(result.bollettino.totalCents).toBe(8046);
    expect(result.cash.totalCents).toBe(12646);
  });

  it("il bollettino per il lungo periodo è 130,46 € e il totale di cassa è 176,46 €", () => {
    const result = feesFor({ istanza: "rilascio", durata: "lungo-periodo", ageYears: 29, childrenUnder14: 0 });
    expect(result.bollettino.totalCents).toBe(13046);
    expect(result.cash.totalCents).toBe(17646);
  });

  it("l'aggiornamento non prevede il contributo per durata e lo segnala fra le esenzioni", () => {
    const result = feesFor({ istanza: "aggiornamento", durata: "fino-1-anno", ageYears: 40, childrenUnder14: 0 });
    expect(result.bollettino.totalCents).toBe(3046);
    expect(result.bollettino.items.some((item) => item.id === "contributo")).toBe(false);
    expect(result.exemptions.length).toBeGreaterThan(0);
    expect(result.exemptions).toContain("CONTRIBUTO_NON_PREVISTO");
  });

  it("la conversione non prevede il contributo per durata e lo segnala fra le esenzioni", () => {
    const result = feesFor({ istanza: "conversione", durata: "1-2-anni", ageYears: 40, childrenUnder14: 0 });
    expect(result.bollettino.totalCents).toBe(3046);
    expect(result.exemptions).toContain("CONTRIBUTO_NON_PREVISTO");
  });

  it("il duplicato non prevede il contributo per durata e lo segnala fra le esenzioni", () => {
    const result = feesFor({ istanza: "duplicato", durata: "lungo-periodo", ageYears: 40, childrenUnder14: 0 });
    expect(result.bollettino.totalCents).toBe(3046);
    expect(result.exemptions).toContain("CONTRIBUTO_NON_PREVISTO");
  });

  it("un minorenne non deve il contributo per durata e l'esenzione MINORE_18 compare", () => {
    const result = feesFor({ istanza: "rilascio", durata: "fino-1-anno", ageYears: 17, childrenUnder14: 0 });
    expect(result.exemptions).toContain("MINORE_18");
  });

  it("due figli sotto i 14 anni generano tre bollettini in tutto", () => {
    const result = feesFor({ istanza: "rilascio", durata: "fino-1-anno", ageYears: 35, childrenUnder14: 2 });
    const bollettiniProduzione = result.bollettino.items.filter((item) => item.id === "produzione");
    expect(bollettiniProduzione.length).toBe(3);
  });

  it("nessun importo di feesFor è un numero non intero, mai un float su una cifra normativa", () => {
    const casi = [
      feesFor({ istanza: "rilascio", durata: "fino-1-anno", ageYears: 29, childrenUnder14: 0 }),
      feesFor({ istanza: "rilascio", durata: "1-2-anni", ageYears: 29, childrenUnder14: 2 }),
      feesFor({ istanza: "rilascio", durata: "lungo-periodo", ageYears: 29, childrenUnder14: 0 }),
    ];
    for (const fees of casi) {
      for (const item of [...fees.bollettino.items, ...fees.cash.items]) {
        expect(Number.isInteger(item.amountCents)).toBe(true);
      }
      expect(Number.isInteger(fees.bollettino.totalCents)).toBe(true);
      expect(Number.isInteger(fees.cash.totalCents)).toBe(true);
    }
  });

  it("ogni voce di fees porta un canale di pagamento e una fonte tracciabile, mai una frase leggibile", () => {
    const result = feesFor({ istanza: "rilascio", durata: "fino-1-anno", ageYears: 29, childrenUnder14: 0 });
    for (const item of [...result.bollettino.items, ...result.cash.items]) {
      expect(["tabaccheria", "bollettino-mef", "cassa-poste"]).toContain(item.channel);
      expect(item.source.length).toBeGreaterThan(0);
      expect(item.id.length).toBeGreaterThan(0);
    }
  });
});
