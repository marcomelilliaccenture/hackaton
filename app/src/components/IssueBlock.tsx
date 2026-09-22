"use client";

import type { Issue } from "@/domain/types";
import { useT } from "./LanguageProvider";

/**
 * Un esito di validazione a schermo (docs/ux-spec.md §5, §6).
 * Tre varianti, ognuna con icona + parola + colore: mai il colore da solo.
 * Il testo ha sempre tre parti: cosa abbiamo notato · perche' conta · cosa fare.
 */

const STYLE = {
  error: { box: "border-alert bg-alert-weak", word: "text-alert" },
  warning: { box: "border-warn bg-warn-weak", word: "text-warn" },
  info: { box: "border-accent bg-accent-weak", word: "text-accent" },
} as const;

/** Cinque icone in tutto nel progetto, scritte inline (docs/ux-spec.md §11). */
function Icona({ severity }: { severity: Issue["severity"] }) {
  const common = { width: 20, height: 20, viewBox: "0 0 20 20", "aria-hidden": true, focusable: false } as const;
  if (severity === "error") {
    return (
      <svg {...common} className="mt-[2px] shrink-0 fill-current">
        <path d="M10 1 19 18H1L10 1Zm-1 6v5h2V7H9Zm0 7v2h2v-2H9Z" />
      </svg>
    );
  }
  if (severity === "warning") {
    return (
      <svg {...common} className="mt-[2px] shrink-0 fill-current">
        <path d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM9 5h2v6H9V5Zm0 8h2v2H9v-2Z" />
      </svg>
    );
  }
  return (
    <svg {...common} className="mt-[2px] shrink-0 fill-current">
      <path d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM9 4h2v2H9V4Zm0 4h2v8H9V8Z" />
    </svg>
  );
}

export interface IssueBlockProps {
  issue: Issue;
  id: string;
}

export function IssueBlock({ issue, id }: IssueBlockProps) {
  const t = useT();
  const style = STYLE[issue.severity];
  const live = issue.severity === "error" ? { role: "alert" as const } : { "aria-live": "polite" as const };

  return (
    <div
      id={id}
      {...live}
      className={`flex gap-3 border-l-[3px] ${style.box} px-3 py-3 text-base text-ink`}
    >
      <span className={style.word}>
        <Icona severity={issue.severity} />
      </span>
      <div className="flex flex-col gap-1">
        {/* parola, non solo colore */}
        <p className={`m-0 font-semibold ${style.word}`}>{t(`issue.${issue.severity}`)}</p>
        <p className="m-0">{t(`issue.${issue.code}.noticed`)}</p>
        <p className="m-0">{t(`issue.${issue.code}.why`)}</p>
        <p className="m-0">{t(`issue.${issue.code}.what`)}</p>
      </div>
    </div>
  );
}
