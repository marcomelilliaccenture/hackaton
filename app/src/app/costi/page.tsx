"use client";

import { useState } from "react";
import Link from "next/link";
import { FeeTable } from "@/components/FeeTable";
import { JourneyProgress } from "@/components/JourneyProgress";
import { useT } from "@/components/LanguageProvider";
import { SourceNote } from "@/components/SourceNote";
import { feesFor } from "@/domain/fees";
import type { Durata } from "@/domain/types";
import { toDomainAnswers, useStoredAnswers } from "../percorso/answers";

/**
 * A-06 — quanto paghi e dove. Il conto lo fa `feesFor()` in `@/domain/fees`:
 * questa pagina sceglie gli ingressi, mostra le voci una per una e formatta
 * gli importi. Nessuna somma scritta a mano, nessun importo senza fonte.
 *
 * La durata non e' fra le cinque domande del percorso: si sceglie qui, e parte
 * da «fino a 1 anno» (il caso che stiamo seguendo).
 */

const DURATE: Durata[] = ["fino-1-anno", "1-2-anni", "lungo-periodo"];

export default function CostiPage() {
  const t = useT();
  const { answers } = useStoredAnswers();
  const [durata, setDurata] = useState<Durata>("fino-1-anno");

  const domain = toDomainAnswers(answers);
  const fees = feesFor({
    istanza: domain.istanza,
    durata,
    ageYears: domain.ageYears,
    childrenUnder14: domain.childrenUnder14,
  });

  return (
    <div className="flex flex-col gap-6">
      <JourneyProgress route="/costi" />

      <h1
        id="titolo-pagina"
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t("fee.h1")}
      </h1>

      <p className="m-0">{t("fee.intro")}</p>

      {/* La durata cambia il contributo: si sceglie, non si indovina. */}
      <div className="flex flex-col gap-2">
        <label htmlFor="durata" className="text-base font-semibold">
          {t("fee.durata.label")}
        </label>
        <p id="durata-aiuto" className="m-0 text-[1rem] text-ink-soft">
          {t("fee.durata.aiuto")}
        </p>
        <select
          id="durata"
          value={durata}
          aria-describedby="durata-aiuto"
          onChange={(event) => setDurata(event.target.value as Durata)}
          className="min-h-[48px] w-full rounded border border-rule bg-paper px-3 text-base"
        >
          {DURATE.map((value) => (
            <option key={value} value={value}>
              {t(`fee.durata.${value}`)}
            </option>
          ))}
        </select>
      </div>

      <FeeTable fees={fees} />

      {/* Le due ricevute: un errore frequente, e costa un appuntamento. */}
      <section
        className="flex flex-col gap-1 border-l-[3px] border-warn bg-warn-weak px-4 py-3"
        aria-labelledby="ricevute-titolo"
      >
        <h2 id="ricevute-titolo" className="m-0 text-[1.25rem] font-semibold text-warn">
          {t("fee.ricevute.titolo")}
        </h2>
        <p className="m-0">{t("fee.ricevute.testo")}</p>
        <SourceNote source="F3" detail="F5" />
      </section>

      {/* Le fonti non concordano sulla durata massima: si dice, con tutte e due. */}
      <section className="flex flex-col gap-1" aria-labelledby="conflitto-titolo">
        <h2 id="conflitto-titolo" className="m-0 text-[1.25rem] font-semibold">
          {t("fee.durata.conflitto.titolo")}
        </h2>
        <p className="m-0">{t("fee.durata.conflitto.testo")}</p>
        <SourceNote source="F4" detail="F2 · F3 · circ. 50432/2023" />
      </section>

      {/* Le esenzioni sono una nota sotto la tabella, non una riga fantasma. */}
      <section className="flex flex-col gap-2" aria-labelledby="esenzioni-titolo">
        <h2 id="esenzioni-titolo" className="m-0 text-[1.25rem] font-semibold">
          {t("fee.esenzioni.titolo")}
        </h2>
        <p className="m-0">{t("fee.esenzioni.intro")}</p>
        <ul className="m-0 flex list-disc flex-col gap-1 pl-6">
          <li>{t("fee.esenzioni.minori")}</li>
          <li>{t("fee.esenzioni.asilo")}</li>
          <li>{t("fee.esenzioni.apolidi")}</li>
          <li>{t("fee.esenzioni.cure")}</li>
          <li>{t("fee.esenzioni.permessoValido")}</li>
        </ul>
        <SourceNote source="F4" detail="DM MEF/Interno 5.5.2017" />

        {fees.exemptions.length > 0 ? (
          <div className="flex flex-col gap-1 border-l-[3px] border-accent bg-accent-weak px-4 py-3">
            <h3 className="m-0 text-base font-semibold">{t("fee.esenzioni.tuoCaso")}</h3>
            {fees.exemptions.map((code) => (
              <p key={code} className="m-0">
                {t(`fee.esenzione.${code}`)}
              </p>
            ))}
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/modulo/1"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("fee.vaiAlModulo")}
        </Link>
        <Link
          href="/scadenza"
          className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
        >
          {t("fee.indietro")}
        </Link>
      </div>
    </div>
  );
}
