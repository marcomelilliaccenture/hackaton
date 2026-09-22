import type { Metadata } from "next";
import "./globals.css";
import { DeadlineBanner } from "@/components/DeadlineBanner";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { DEFAULT_LANG, t } from "@/i18n";

export const metadata: Metadata = {
  title: t("app.title", DEFAULT_LANG),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // lang iniziale: italiano. Il LanguageProvider aggiorna <html lang> alla scelta.
  return (
    <html lang={DEFAULT_LANG}>
      <body className="flex min-h-screen flex-col">
        <LanguageProvider>
          {/* skip-link: primo nel DOM, visibile al focus */}
          <SkipLink />
          <SiteHeader />
          {/* Una sola volta, su ogni pagina: si disegna solo quando la data
              d'ingresso e' stata risposta (docs/ux-spec.md §3). */}
          {/* <div className="mx-auto w-full max-w-[40rem] px-4">
            <DeadlineBanner />
          </div> */}
          <main id="contenuto" className="mx-auto w-full max-w-[40rem] flex-1 px-4 py-8">
            {children}
          </main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
