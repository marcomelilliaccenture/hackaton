"use client";

import { SEZIONI_MODULO_1, sezioneDiCasella } from "@/data/modulo-209-sezioni";
import { fill } from "@/app/percorso/answers";
import { useLangAttr, useT } from "./LanguageProvider";
import { SourceNote } from "./SourceNote";

/**
 * A-12 — i valori della persona nella forma del MOD. 209 Modulo 1, per la stampa.
 *
 * Non e' l'istanza e non lo dice: il kit si ritira all'ufficio postale (F2), si compila a
 * mano in stampatello e si consegna in busta aperta. Questo foglio serve a trascrivere
 * senza cercare, ed e' per questo che ogni valore sta sotto il suo numero di casella e
 * dentro la sua sezione, come sul cartaceo (D-11).
 *
 * Le caselle che l'app non chiede NON compaiono inventate: compaiono come sezioni assenti,
 * dichiarate in fondo. Le caselle chieste e lasciate vuote restano visibili e numerate.
 */

/** Ancora del facsimile nella pagina (usata dalla stampa e dalle verifiche). */
export const FACSIMILE_ID = "facsimile";

export interface FacsimileRiga {
  /** numero di casella del modulo, da 1 a 173 */
  casella: number;
  /** chiave i18n dell'etichetta ufficiale della casella */
  officialKey?: string;
  /** cosa va scritto nella casella; stringa vuota = da compilare a mano */
  value: string;
  /** il valore in parole, quando in casella va un codice o una data in cifre */
  spiegazione?: string;
}

/**
 * Una sezione puo' dover restare vuota per scelta, non per dimenticanza: la nota (q) dice
 * di non compilare la sezione 8 se il recapito e' quello dove la persona vive. In quel caso
 * la sezione compare col suo numero di casella e con il motivo, senza caselle da riempire —
 * scrivere "da compilare" sarebbe far fare l'errore che l'app evita.
 */
export interface FacsimileNota {
  sezione: number;
  testo: string;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-rule bg-paper-warm px-2 py-1 font-mono text-[0.8125rem] text-ink-soft">
      {children}
    </span>
  );
}

export function ModuloFacsimile({
  righe,
  note = [],
  className,
}: {
  righe: FacsimileRiga[];
  note?: FacsimileNota[];
  className?: string;
}) {
  const t = useT();
  const langIt = useLangAttr();

  const conRighe = SEZIONI_MODULO_1.map((sezione) => ({
    sezione,
    righe: righe.filter((r) => sezioneDiCasella(r.casella)?.numero === sezione.numero),
    nota: note.find((n) => n.sezione === sezione.numero)?.testo,
  })).filter((gruppo) => gruppo.righe.length > 0 || gruppo.nota !== undefined);

  return (
    <section id={FACSIMILE_ID} className={className} aria-labelledby="facsimile-titolo">
      <h2 id="facsimile-titolo" className="m-0 text-[1.25rem] font-semibold">
        {t("facsimile.titolo")}
      </h2>

      <p className="m-0 mt-2 font-semibold">{t("facsimile.intro")}</p>

      <p className="m-0 mt-2">{t("facsimile.regole")}</p>
      {/* Casella 1 del modulo, alla lettera: resta in italiano in tutte le lingue. */}
      <blockquote
        lang="it"
        className="m-0 mt-1 border-l-2 border-rule pl-3 font-mono text-[0.9375rem] text-ink-soft"
      >
        «{t("facsimile.regole.citazione")}»
      </blockquote>

      {conRighe.map(({ sezione, righe: righeSezione, nota }) => (
        <section key={sezione.numero} className="mt-5">
          <h3 className="m-0 flex flex-wrap items-baseline gap-2 text-[1rem] font-semibold">
            <Chip>
              {t("campo.casella")} {sezione.casellaTitolo}
            </Chip>
            <span lang="it" className="font-mono">
              {sezione.titolo}
            </span>
          </h3>

          {nota !== undefined ? <p className="m-0 mt-2">{nota}</p> : null}

          <ul className="m-0 mt-2 flex list-none flex-col gap-2 p-0">
            {righeSezione.map((riga) => (
              <li key={riga.casella} className="flex flex-col gap-1">
                <p className="m-0 flex flex-wrap items-baseline gap-2">
                  <Chip>
                    {t("campo.casella")} {riga.casella}
                  </Chip>
                  {riga.officialKey ? (
                    <span
                      lang={langIt(riga.officialKey)}
                      className="font-mono text-[0.875rem] text-ink-soft"
                    >
                      {t(riga.officialKey)}
                    </span>
                  ) : null}
                </p>

                {/* La casella come sul modulo: bordo pieno, valore in stampatello. */}
                <p className="m-0 border border-rule bg-paper px-3 py-2 text-[1.125rem] font-semibold uppercase [font-variant-numeric:tabular-nums]">
                  {riga.value !== "" ? (
                    riga.value
                  ) : (
                    <span className="font-normal normal-case italic text-ink-soft">
                      {t("facsimile.vuota")}
                    </span>
                  )}
                </p>

                {riga.spiegazione && riga.value !== "" ? (
                  <p className="m-0 text-[0.875rem] text-ink-soft">
                    {fill(t("facsimile.cioe"), { valore: riga.spiegazione })}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="m-0 mt-5">{t("facsimile.altreSezioni")}</p>
      <SourceNote source="F9" detail="MOD. 209 Modulo 1 · F2, regole per la compilazione" />
    </section>
  );
}
