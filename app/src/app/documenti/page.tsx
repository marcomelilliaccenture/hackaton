"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChecklistItem, type ChecklistItemExplain } from "@/components/ChecklistItem";
import { JourneyProgress } from "@/components/JourneyProgress";
import { useT } from "@/components/LanguageProvider";
import { SourceNote } from "@/components/SourceNote";
import { requirementsFor } from "@/domain/requirements";
import { fill, useStoredAnswers } from "../percorso/answers";
import { loadCheckedDocs, saveCheckedDocs } from "./checked-docs";

/**
 * A-07 — cosa metti nella busta. L'elenco lo decide `requirementsFor()` in
 * `@/domain/requirements`: qui si mostrano le quattro informazioni di ogni
 * voce, si spunta, e si contano le voci pronte.
 *
 * Le spunte stanno in localStorage, con una chiave propria: le risposte del
 * percorso (`kit209.v1`) non c'entrano e non vanno sporcate. La chiave e le
 * due funzioni vivono in `./checked-docs`, perche' anche /riepilogo le legge
 * (la casella 25 conta i fogli delle fotocopie spuntate qui).
 */

/** Le voci che nominano un certificato portano il pannello «dove si chiede». */
const EXPLAIN: Record<string, ChecklistItemExplain> = {
  "certificazione-dimora": {
    meaningKey: "doc.certificazione-dimora.explain.meaning",
    officialQuoteKey: "doc.certificazione-dimora.explain.official",
    actionKey: "doc.certificazione-dimora.explain.action",
    source: "F1",
    sourceDetail: "art. 7 D.lgs 286/1998 (F13)",
  },
};

export default function DocumentiPage() {
  const t = useT();
  const { answers, ready } = useStoredAnswers();
  const [checked, setChecked] = useState<string[]>([]);
  const [checkedReady, setCheckedReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const defaultIds = requirementsFor(answers.motivo ?? "altro", "rilascio").map((r) => r.id);
    setChecked(loadCheckedDocs(defaultIds));
    setCheckedReady(true);
  }, [ready, answers.motivo]);

  const toggle = useCallback((id: string, value: boolean) => {
    setChecked((prev) => {
      const next = value ? [...new Set([...prev, id])] : prev.filter((x) => x !== id);
      saveCheckedDocs(next);
      return next;
    });
  }, []);

  if (!ready || !checkedReady) {
    return (
      <div className="flex flex-col gap-6">
        <h1 id="titolo-pagina" tabIndex={-1} className="m-0 text-[1.5rem] font-semibold">
          {t("doc.h1")}
        </h1>
        <p className="m-0">{t("doc.caricamento")}</p>
      </div>
    );
  }

  // Entrare qui senza aver risposto non e' un errore: si dice cosa manca.
  if (!answers.motivo) {
    return (
      <div className="flex flex-col gap-6">
        <h1 id="titolo-pagina" tabIndex={-1} className="m-0 text-[1.5rem] font-semibold">
          {t("doc.h1")}
        </h1>
        <p className="m-0">{t("doc.mancaMotivo")}</p>
        <Link
          href="/percorso/1"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("doc.vaiAlPercorso")}
        </Link>
      </div>
    );
  }

  const requisiti = requirementsFor(answers.motivo, "rilascio");
  const pronti = requisiti.filter((r) => checked.includes(r.id)).length;

  return (
    <div className="flex flex-col gap-6">
      <JourneyProgress route="/documenti" />

      <h1
        id="titolo-pagina"
        tabIndex={-1}
        className="m-0 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-tight"
      >
        {t("doc.h1")}
      </h1>

      <p className="m-0">{t("doc.intro")}</p>
      <p className="m-0 text-[1rem] text-ink-soft">
        {fill(t("doc.motivoScelto"), { motivo: t(`motivo.${answers.motivo}`) })}
      </p>

      {/* Banner 1 — checklist tipo: e' un requisito di Autonomia & Limiti. */}
      <section
        className="flex flex-col gap-1 border-l-[3px] border-warn bg-warn-weak px-4 py-3"
        aria-labelledby="banner-tipo"
      >
        <h2 id="banner-tipo" className="m-0 text-[1.25rem] font-semibold text-warn">
          {t("doc.banner.tipo.titolo")}
        </h2>
        <p className="m-0">{t("doc.banner.tipo.testo")}</p>
        <SourceNote source="F1" />
      </section>

      {/* Banner 2 — niente autocertificazione: manda indietro le pratiche. */}
      <section
        className="flex flex-col gap-1 border-l-[3px] border-accent bg-accent-weak px-4 py-3"
        aria-labelledby="banner-autocert"
      >
        <h2 id="banner-autocert" className="m-0 text-[1.25rem] font-semibold">
          {t("doc.banner.autocert.titolo")}
        </h2>
        <p className="m-0">{t("doc.banner.autocert.testo")}</p>
        <SourceNote source="F1" detail="D.lgs 286/1998 · DPR 394/1999" />
      </section>

      {/* Il contatore si annuncia da solo a ogni spunta. */}
      <div className="flex flex-col gap-1">
        <p aria-live="polite" className="m-0 text-[1.25rem] font-semibold">
          {fill(t("doc.contatore"), { fatti: pronti, totale: requisiti.length })}
        </p>
        <p className="m-0 text-[1rem] text-ink-soft">{t("doc.contatore.aiuto")}</p>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {requisiti.map((requirement) => (
          <ChecklistItem
            key={requirement.id}
            requirement={requirement}
            checked={checked.includes(requirement.id)}
            onToggle={(value) => toggle(requirement.id, value)}
            explain={EXPLAIN[requirement.id]}
          />
        ))}
      </ul>

      {/* Adempimento a valle, non un allegato: si dice come tale. */}
      {answers.motivo === "16" ? (
        <section className="flex flex-col gap-1 border border-rule bg-paper px-4 py-3" aria-labelledby="accordo-titolo">
          <h2 id="accordo-titolo" className="m-0 text-[1.25rem] font-semibold">
            {t("doc.accordo.titolo")}
          </h2>
          <p className="m-0">{t("doc.accordo.testo")}</p>
          <p className="m-0 text-[0.875rem] text-ink-soft">
            {t("fonte.label")} <span lang="it">{t("doc.accordo.fonte")}</span>
          </p>
        </section>
      ) : null}

      {/* Il passo dopo nella catena: il riepilogo da stampare. */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/riepilogo"
          className="inline-flex min-h-[48px] items-center rounded bg-accent px-6 py-3 text-base font-semibold text-paper"
        >
          {t("doc.vaiAlRiepilogo")}
        </Link>
        <Link
          href="/modulo/4"
          className="inline-flex min-h-[48px] items-center rounded border border-accent px-5 py-3 text-base font-semibold text-accent"
        >
          {t("doc.indietroModulo")}
        </Link>
      </div>
    </div>
  );
}
