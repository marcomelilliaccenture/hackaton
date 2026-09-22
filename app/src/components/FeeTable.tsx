"use client";

import type { FeeItem, Fees } from "@/domain/fees";
import { useLanguage, useT } from "./LanguageProvider";
import { SourceNote, type SourceNoteProps } from "./SourceNote";
import type { Lang } from "@/i18n";

/**
 * A-06 — una `<table>` vera con `<caption>` e `<th scope>`: una riga per voce,
 * con importo, canale di pagamento e fonte. I due totali stanno SOTTO le voci
 * (docs/ux-spec.md §5, principio 3): nessun totale senza le righe che lo
 * compongono.
 *
 * Qui non si calcola niente. Gli importi arrivano in centesimi da
 * `feesFor()` e questa funzione li FORMATTA soltanto: la somma la fa il
 * dominio, che e' testato.
 */

const LOCALE: Record<Lang, string> = { it: "it-IT", en: "en-GB", fr: "fr-FR", es: "es-ES" };

/** Centesimi interi → "16,00 €". Nessun arrotondamento nostro: solo formato. */
export function formatEuro(cents: number, lang: Lang): string {
  return new Intl.NumberFormat(LOCALE[lang], {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

const SOURCE_IDS = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F11", "F12"] as const;

/**
 * La stringa `source` del dominio ("F5 · F6") diventa fonte + precisazione.
 * Se il primo token non e' una fonte nota, `SourceNote` non stampa la riga:
 * un importo senza fonte resta senza riga fonte, non con un marcatore.
 */
export function splitSource(source: string): {
  source: SourceNoteProps["source"];
  detail?: string;
} {
  const [first, ...rest] = source.split("·").map((part) => part.trim());
  const known = (SOURCE_IDS as readonly string[]).includes(first);
  if (!known) return { source: "da-verificare" };
  return {
    source: first as SourceNoteProps["source"],
    detail: rest.length > 0 ? rest.join(" · ") : undefined,
  };
}

export interface FeeTableProps {
  fees: Fees;
}

export function FeeTable({ fees }: FeeTableProps) {
  const t = useT();
  const { lang } = useLanguage();

  const righe: FeeItem[] = fees.cash.items;

  return (
    <div className="flex flex-col gap-4">
      {/* La tabella scorre dentro il suo contenitore: allo zoom 200% la pagina
          non guadagna una barra orizzontale. */}
      <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-rule bg-paper text-left text-base">
        <caption className="mb-2 text-left text-base text-ink-soft">
          {t("fee.tabella.caption")}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="border border-rule px-3 py-2 align-top font-semibold">
              {t("fee.col.voce")}
            </th>
            <th scope="col" className="border border-rule px-3 py-2 align-top font-semibold">
              {t("fee.col.importo")}
            </th>
            <th scope="col" className="border border-rule px-3 py-2 align-top font-semibold">
              {t("fee.col.dove")}
            </th>
            <th scope="col" className="border border-rule px-3 py-2 align-top font-semibold">
              {t("fee.col.fonte")}
            </th>
          </tr>
        </thead>
        <tbody>
          {righe.map((item, index) => {
            const fonte = splitSource(item.source);
            return (
              <tr key={`${item.id}-${index}`}>
                <th scope="row" className="border border-rule px-3 py-3 align-top font-semibold">
                  {t(`fee.voce.${item.id}`)}
                </th>
                <td className="border border-rule px-3 py-3 align-top text-[1.25rem] font-semibold [font-variant-numeric:tabular-nums]">
                  {formatEuro(item.amountCents, lang)}
                </td>
                <td className="border border-rule px-3 py-3 align-top">
                  {t(`fee.dove.${item.id}`)}
                </td>
                <td className="border border-rule px-3 py-3 align-top">
                  <SourceNote source={fonte.source} detail={fonte.detail} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {/* Due totali separati ed etichettati, mai uno solo. */}
      <div className="flex flex-col gap-4">
        <section
          className="flex flex-col gap-1 border-l-[3px] border-accent bg-accent-weak px-4 py-3"
          aria-labelledby="totale-bollettino"
        >
          <h3 id="totale-bollettino" className="m-0 text-base font-semibold">
            {t("fee.bollettino.titolo")}
          </h3>
          <p className="m-0 text-[1.25rem] font-semibold [font-variant-numeric:tabular-nums]">
            {formatEuro(fees.bollettino.totalCents, lang)}
          </p>
          <p className="m-0">{t("fee.bollettino.spiega")}</p>
          <p className="m-0">{t("fee.bollettino.causale")}</p>
          <p className="m-0">{t("fee.bollettino.dove")}</p>
          <SourceNote source="F6" detail="F5" />
        </section>

        <section
          className="flex flex-col gap-1 border border-rule bg-paper px-4 py-3"
          aria-labelledby="totale-cassa"
        >
          <h3 id="totale-cassa" className="m-0 text-base font-semibold">
            {t("fee.cassa.titolo")}
          </h3>
          <p className="m-0 text-[1.25rem] font-semibold [font-variant-numeric:tabular-nums]">
            {formatEuro(fees.cash.totalCents, lang)}
          </p>
          <p className="m-0">{t("fee.cassa.spiega")}</p>
          <SourceNote source="F6" detail="F1 · F5" />
        </section>
      </div>
    </div>
  );
}
