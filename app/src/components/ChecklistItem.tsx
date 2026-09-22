"use client";

import { useState } from "react";
import type { DocumentRequirement } from "@/domain/requirements";
import { ExplainPanel } from "./ExplainPanel";
import { useT } from "./LanguageProvider";
import type { SourceNoteProps } from "./SourceNote";

/**
 * A-07 — una voce della checklist (docs/ux-spec.md §5).
 * Quattro informazioni, sempre tutte e quattro: nome semplice (grassetto) ·
 * nome burocratico (mono, dal DOMINIO: e' F1 alla lettera e non passa da i18n) ·
 * com'e' fatto · dove si trova. Piu' un badge testuale che distingue la
 * fotocopia nella busta dall'originale alla convocazione (R-25).
 *
 * Checkbox nativa da 24px: l'area cliccabile e' l'etichetta intera, alta
 * almeno 44px.
 */

export interface ChecklistItemExplain {
  meaningKey: string;
  officialQuoteKey: string;
  actionKey: string;
  source: SourceNoteProps["source"];
  sourceDetail?: string;
}

export interface ChecklistItemProps {
  requirement: DocumentRequirement;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  explain?: ChecklistItemExplain;
}

export function ChecklistItem({ requirement, checked, onToggle, explain }: ChecklistItemProps) {
  const t = useT();
  const [explainOpen, setExplainOpen] = useState(false);

  const base = `doc.${requirement.id}`;
  const inputId = `doc-${requirement.id}`;
  const condizioneKey = `${base}.condizione`;
  const condizione = t(condizioneKey);
  const haCondizione = condizione !== "" && condizione !== condizioneKey;

  return (
    <li className="flex flex-col gap-2 border border-rule bg-paper px-3 py-3">
      {/* L'etichetta contiene la checkbox: si preme anche sul testo. */}
      <label
        htmlFor={inputId}
        className="flex min-h-[44px] cursor-pointer items-start gap-3 py-1"
      >
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(event) => onToggle(event.target.checked)}
          className="mt-1 h-6 w-6 shrink-0 accent-[#0F5D5A]"
        />
        <span className="text-base font-semibold">{t(`${base}.semplice`)}</span>
      </label>

      <dl className="m-0 flex flex-col gap-2 pl-9">
        <div className="flex flex-col gap-0.5">
          <dt className="m-0 text-[0.9375rem] text-ink-soft">{t("doc.label.ufficiale")}</dt>
          {/* Il nome burocratico non si toglie mai, e resta in italiano. */}
          <dd className="m-0 font-mono text-[0.9375rem] font-medium text-ink-soft" lang="it">
            {requirement.official}
          </dd>
        </div>

        <div className="flex flex-col gap-0.5">
          <dt className="m-0 text-[0.9375rem] text-ink-soft">{t("doc.label.comEfatto")}</dt>
          <dd className="m-0">{t(`${base}.comEfatto`)}</dd>
        </div>

        <div className="flex flex-col gap-0.5">
          <dt className="m-0 text-[0.9375rem] text-ink-soft">{t("doc.label.dove")}</dt>
          <dd className="m-0">{t(`${base}.dove`)}</dd>
        </div>

        {/* Un obbligo condizionato si dice condizionato, mai assoluto. */}
        {haCondizione ? (
          <div className="flex flex-col gap-0.5">
            <dt className="m-0 text-[0.9375rem] text-ink-soft">{t("doc.label.quando")}</dt>
            <dd className="m-0">{condizione}</dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-wrap items-center gap-2 pl-9">
        {requirement.copyInEnvelope ? (
          <span className="border border-rule bg-paper-warm px-2 py-1 text-[0.9375rem] text-ink">
            {t("doc.badge.fotocopia")}
          </span>
        ) : null}
        {requirement.originalAtAppointment ? (
          <span className="border border-rule bg-paper-warm px-2 py-1 text-[0.9375rem] text-ink">
            {t("doc.badge.originale")}
          </span>
        ) : null}
        {/* La fonte della voce arriva dal dominio, non da i18n. */}
        <span className="text-[0.875rem] text-ink-soft">
          {t("fonte.label")} <span lang="it">{requirement.source}</span>
        </span>
      </div>

      {explain ? (
        <div className="pl-9">
          <ExplainPanel
            id={`explain-${requirement.id}`}
            open={explainOpen}
            onOpenChange={setExplainOpen}
            meaningKey={explain.meaningKey}
            officialQuoteKey={explain.officialQuoteKey}
            actionKey={explain.actionKey}
            source={explain.source}
            sourceDetail={explain.sourceDetail}
          />
        </div>
      ) : null}
    </li>
  );
}
