# B0 — Scaffold

> Blocco 0 · comune · 0:30 · agente: `builder` · **da solo**: nessun altro spec in corso
> **Spec chiuso.** Non aprire `app-plan.md` né il dossier di dominio.

## Obiettivo

`npm run dev` apre `/` con la shell e il selettore di lingua; `npm test` gira (anche a vuoto);
`npm run build` passa. Da qui in avanti due tracce lavorano in parallelo senza toccarsi.

## Criteri da soddisfare

- [ ] **A-18** `npm test` verde e `npm run build` che passa.
- [ ] **A-01** (parziale) La scelta della lingua in `/` cambia immediatamente tutta
      l'interfaccia e aggiorna `<html lang>`. In questo blocco basta che cambi il titolo e
      l'attributo `lang`: i testi arrivano in B1B.

## Cosa installi, e nient'altro

Next.js (App Router) + TypeScript + Tailwind CSS + Vitest. **Nessuna** libreria di UI,
**nessun** icon set, **nessun** webfont, nessuna libreria di date, nessuna di i18n.

Ogni dipendenza in più costa setup su un'altra macchina e la demo deve partire da zero con un
comando. Se credi che serva qualcosa, dillo e fermati: la motivazione va in
`docs/decision-log.md`, non in `package.json`.

## Struttura da creare

```
app/
  package.json          script: dev, build, test
  tsconfig.json
  tailwind.config.ts    i token di colore qui sotto
  vitest.config.ts      environment: node  (il dominio è puro: niente jsdom)
  src/
    app/layout.tsx      shell: <html lang>, skip-link, header, footer, main
    app/page.tsx        /  → LanguageSwitcher + bottone "Ho ricevuto il kit postale"
    app/globals.css     token, @media print vuoto ma presente
    components/LanguageSwitcher.tsx
    domain/.gitkeep
    data/.gitkeep
    i18n/index.ts       t(key, lang); chiave mancante → ritorna la chiave
    i18n/it.json en.json fr.json es.json    { "app.title": "..." } e nient'altro
    fixtures/sample-answers.ts              export const SAMPLE: Answers stub
  tests/smoke.test.ts   un test che verifica che t() ritorni la chiave se manca
```

## Token di colore (in `tailwind.config.ts`)

```
ink #1A1A1A · ink-soft #4A4A4A · paper #FFFFFF · paper-warm #F5F2EC · rule #D8D2C7
accent #0F5D5A · accent-weak #E3EFEE · alert #B3261E · alert-weak #FCEFEE
warn #7A4B00 · warn-weak #FFF4E0 · ok #1E6B3A · focus #0B4F8A
```

Font: stack di sistema, nessun webfont. Testo corrente 17px, **mai sotto 16px**. Misura di
riga `max-w-[34rem]`. Target tattili ≥ 44px. Dettagli in `docs/ux-spec.md` §2.

## La shell

- Un solo `<h1>` per pagina.
- `skip-link` **primo nel DOM**, visibile al focus.
- `<html lang>` legge la lingua scelta.
- Footer con il link a `/limiti` (la pagina arriva in B5: per ora un link a una rotta che
  risponde 404 è accettabile, un link finto no).
- `@media print` esiste già in `globals.css`, anche se vuoto: così in B4B non va inventato.

## `t(key, lang)`

```ts
export type Lang = "it" | "en" | "fr" | "es";
export function t(key: string, lang: Lang): string;  // chiave mancante → ritorna `key`
```

**Una chiave mancante ritorna la chiave**, non l'italiano. Gli errori di traduzione devono
essere visibili in demo, non nascosti: è una decisione, non una svista.

## File

**Puoi scrivere in:** tutto sotto `app/`.
**Non toccare:** `docs/`, `agents/`, `.claude/`.

## Fatto quando

1. `cd app && npm install && npm run dev` → `/` si apre, quattro bottoni di lingua, uno grande.
2. Premere `FR` cambia `<html lang="fr">` e il titolo.
3. `npm test` → 1 test verde.
4. `npm run build` → passa.
5. Da tastiera: `Tab` porta prima allo skip-link, e si vede.

## Restituisci

```
SPEC: B0
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
