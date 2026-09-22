"use client";

import Link from "next/link";
import { useT } from "@/components/LanguageProvider";
import { SourceNote } from "@/components/SourceNote";

/**
 * A-16 — /limiti, terzo deliverable del tema (Autonomia & Limiti).
 * Non e' un disclaimer legale: e' la pagina che dice dove questo strumento
 * smette di aiutare. Nessuna frase scritta a mano qui: solo chiavi i18n, cosi'
 * la pagina cambia lingua insieme al resto (A-01).
 *
 * La sezione 5 elenca i due dati che non siamo riusciti a verificare su una
 * fonte ufficiale: gli intervalli di CAP per provincia (data/province.ts) e i
 * fogli del Modulo 1 e del Modulo 2 per la casella 25 (domain/progress.ts).
 * A schermo, accanto a quei numeri, non compare nessun marcatore: il posto in
 * cui il limite si dichiara e' questo, uno solo. Il commento in testa ai due
 * file dice da dove vengono i numeri. Se ne aggiungi uno nel codice,
 * aggiungilo anche qui.
 */

/**
 * Nomi propri e URL: identici nelle quattro lingue, come SOURCE_LABEL in
 * SourceNote. Provenienza: docs/sources.md (stato HTTP verificato 22/09/2026).
 */
const FONTI: ReadonlyArray<{ href: string; label: string }> = [
  {
    href: "https://questure.poliziadistato.it/statics/29/documenti-da-inserire-nel-kit-postale-per-le-principali-tipologie-di-permesso-di-soggiorno.pdf",
    label: "F1 · Polizia di Stato — Documenti da inserire nel kit postale per tipologia",
  },
  {
    href: "https://www.portaleimmigrazione.it/media/documentazione/Informativa_Generale.pdf",
    label: "F2 · Portale Immigrazione — Informativa Generale",
  },
  {
    href: "https://www.portaleimmigrazione.it/ITA/nuovaProcedura.html",
    label: "F3 · Portale Immigrazione — La procedura",
  },
  {
    href: "https://www.poliziadistato.it/articolo/225",
    label: "F4 · Polizia di Stato — Il rilascio del permesso di soggiorno",
  },
  {
    href: "https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno",
    label: "F5 · Poste Italiane — Guida rilascio e rinnovo",
  },
  {
    href: "https://www.portaleimmigrazione.it/ITA/tabelleCosti.html",
    label: "F6 · Portale Immigrazione — Tabella costi",
  },
];

function Elenco({ voci }: { voci: string[] }) {
  return (
    <ul className="m-0 flex list-disc flex-col gap-3 pl-5">
      {voci.map((voce) => (
        <li key={voce}>{voce}</li>
      ))}
    </ul>
  );
}

export default function LimitiPage() {
  const t = useT();

  return (
    <div className="flex flex-col gap-8">
      <h1
        id="titolo-pagina"
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t("limiti.h1")}
      </h1>
      <p className="m-0">{t("limiti.intro")}</p>

      {/* 1 — cosa non facciamo */}
      <section className="flex flex-col gap-3" aria-labelledby="limiti-non-facciamo">
        <h2 id="limiti-non-facciamo" className="m-0 text-[1.25rem] font-semibold">
          {t("limiti.nonFacciamo.titolo")}
        </h2>
        <Elenco
          voci={[
            t("limiti.nonFacciamo.consulenza"),
            t("limiti.nonFacciamo.invio"),
            t("limiti.nonFacciamo.stato"),
            t("limiti.nonFacciamo.esito"),
            t("limiti.nonFacciamo.valutazioni"),
            t("limiti.nonFacciamo.campi"),
          ]}
        />
        {/* I 60 giorni citati sopra: media dichiarata, non tempo garantito. */}
        <SourceNote source="F4" />
      </section>

      {/* 2 — R-32: l'alternativa gratuita va detta per prima, non nascosta in fondo */}
      <section
        className="flex flex-col gap-2 border-l-[3px] border-accent bg-accent-weak px-4 py-3"
        aria-labelledby="limiti-gratuito"
      >
        <h2 id="limiti-gratuito" className="m-0 text-[1.25rem] font-semibold">
          {t("limiti.gratuito.titolo")}
        </h2>
        <p className="m-0">{t("limiti.gratuito.testo")}</p>
        <p className="m-0">{t("limiti.gratuito.numeroVerde")}</p>
        <p className="m-0">{t("limiti.gratuito.scelta")}</p>
        <SourceNote source="F3" detail="F5" />
      </section>

      {/* 3 — semplificare senza tradire */}
      <section className="flex flex-col gap-3" aria-labelledby="limiti-semplificato">
        <h2 id="limiti-semplificato" className="m-0 text-[1.25rem] font-semibold">
          {t("limiti.semplificato.titolo")}
        </h2>
        <Elenco
          voci={[
            t("limiti.semplificato.parole"),
            t("limiti.semplificato.nomeUfficiale"),
            t("limiti.semplificato.numeri"),
            t("limiti.semplificato.registro"),
          ]}
        />
      </section>

      {/* 4 — i limiti dichiarati */}
      <section className="flex flex-col gap-3" aria-labelledby="limiti-non-sappiamo">
        <h2 id="limiti-non-sappiamo" className="m-0 text-[1.25rem] font-semibold">
          {t("limiti.nonSappiamo.titolo")}
        </h2>
        <Elenco
          voci={[
            t("limiti.nonSappiamo.patronali"),
            t("limiti.nonSappiamo.checklist"),
            t("limiti.nonSappiamo.dueDate"),
            t("limiti.nonSappiamo.copertura"),
            t("limiti.nonSappiamo.lingue"),
          ]}
        />
        <SourceNote source="F1" detail="F3 · F4 · F5 · F8" />
      </section>

      {/* 5 — i due dati senza fonte ufficiale, e cosa succede se sbagliano */}
      <section className="flex flex-col gap-3" aria-labelledby="limiti-non-verificati">
        <h2 id="limiti-non-verificati" className="m-0 text-[1.25rem] font-semibold">
          {t("limiti.nonVerificati.titolo")}
        </h2>
        <p className="m-0">{t("limiti.nonVerificati.intro")}</p>
        <Elenco
          voci={[t("limiti.nonVerificati.cap"), t("limiti.nonVerificati.fogli")]}
        />
        <p className="m-0">{t("limiti.nonVerificati.tuttoIlResto")}</p>
      </section>

      {/* 6 — nessuna AI a runtime */}
      <section className="flex flex-col gap-2" aria-labelledby="limiti-ai">
        <h2 id="limiti-ai" className="m-0 text-[1.25rem] font-semibold">
          {t("limiti.ai.titolo")}
        </h2>
        <p className="m-0 font-semibold">{t("limiti.ai.nessuna")}</p>
        <p className="m-0">{t("limiti.ai.funzioni")}</p>
        <p className="m-0">{t("limiti.ai.perche")}</p>
        <p className="m-0">{t("limiti.ai.costruzione")}</p>
      </section>

      {/* 7 — dove sta la verita' ufficiale */}
      <section className="flex flex-col gap-3" aria-labelledby="limiti-fonti">
        <h2 id="limiti-fonti" className="m-0 text-[1.25rem] font-semibold">
          {t("limiti.fonti.titolo")}
        </h2>
        <p className="m-0">{t("limiti.fonti.intro")}</p>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {FONTI.map((fonte) => (
            <li key={fonte.href}>
              <a
                href={fonte.href}
                lang="it"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center text-accent underline"
              >
                {fonte.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="m-0 font-semibold">{t("limiti.fonti.avviso")}</p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
        >
          {t("limiti.tornaHome")}
        </Link>
        <Link
          href="/riepilogo"
          className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
        >
          {t("limiti.vaiAlRiepilogo")}
        </Link>
      </div>
    </div>
  );
}
