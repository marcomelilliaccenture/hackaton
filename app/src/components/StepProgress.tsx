"use client";

import { useT } from "./LanguageProvider";
import { fill } from "@/app/percorso/answers";

/**
 * "Passo 4 di 5 · circa 3 minuti" (docs/ux-spec.md §5).
 * Nessuna barra animata: il testo si legge anche allo zoom 200%.
 * `<nav>` + `<ol>`, il passo corrente con `aria-current="step"`.
 *
 * I minuti sono una stima d'uso dell'interfaccia, non un dato normativo.
 */
export interface StepProgressProps {
  /** 1-based */
  current: number;
  total: number;
  /** chiavi i18n dei titoli brevi, una per passo */
  labelKeys: string[];
  minutes: number;
}

export function StepProgress({ current, total, labelKeys, minutes }: StepProgressProps) {
  const t = useT();

  return (
    <nav aria-label={t("percorso.progresso.label")} className="flex flex-col gap-2">
      <p className="m-0 text-[0.9375rem] text-ink-soft">
        {fill(t("percorso.progresso.testo"), { n: current, tot: total, min: minutes })}
      </p>
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
        {labelKeys.map((key, i) => {
          const passo = i + 1;
          const corrente = passo === current;
          return (
            <li
              key={key}
              aria-current={corrente ? "step" : undefined}
              className={[
                "rounded border px-2 py-1 text-[0.8125rem]",
                corrente
                  ? "border-accent bg-accent-weak font-semibold text-accent"
                  : "border-rule text-ink-soft",
              ].join(" ")}
            >
              <span className="sr-only">
                {fill(t("percorso.progresso.passo"), { n: passo })}{" "}
              </span>
              {t(key)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
