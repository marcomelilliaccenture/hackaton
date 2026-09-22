"use client";

import { useT } from "./LanguageProvider";

/** Primo nel DOM, invisibile finche' non riceve il focus (docs/ux-spec.md §3). */
export function SkipLink() {
  const t = useT();
  return (
    <a
      href="#contenuto"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:min-h-[44px] focus:rounded focus:border focus:border-accent focus:bg-paper focus:px-4 focus:py-3 focus:text-ink"
    >
      {t("shell.skip")}
    </a>
  );
}
