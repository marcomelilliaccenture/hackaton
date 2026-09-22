"use client";

import { t } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";

export function SiteHeader() {
  const { lang } = useLanguage();

  return (
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto w-full max-w-[40rem] px-4 py-4 flex flex-col gap-4">
        {/* Testo, non logo (docs/ux-spec.md §3). Cambia con la lingua scelta. */}
        <p className="m-0 font-mono text-[0.9375rem] text-ink-soft">{t("app.title", lang)}</p>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
