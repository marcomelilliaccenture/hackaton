# B0B — `types.ts`, il vocabolario condiviso del dominio

> Blocco 0B · traccia A · 0:10 · solo `builder`
> Chiude il sync **S1** ("firme congelate"). Blocca B2A, B3A, B4A.
> **Spec chiuso.** Non aprire `app-plan.md` né il dossier di dominio.

## Perché esiste

Il contratto di dominio nomina `Answers`, `Address`, `PassportData` e `Step` senza definirli
da nessuna parte: B0 ha dovuto inventarsi uno stub di `Answers` dentro
`app/src/fixtures/sample-answers.ts` per far compilare le fixture. Tre blocchi diversi
(B2A, B3A, B4A) hanno bisogno degli stessi tipi: se li dichiara ognuno per conto suo,
divergono. Questo blocco li scrive una volta sola, prima che partano.

## Criterio da soddisfare

- [ ] **S1** Ogni tipo nominato dal contratto di dominio esiste in un solo file, importabile
      da `domain/`, da `data/` e dalle pagine. Nessun modulo lo ridichiara.

## Contratto — verbatim, questo è il file

```ts
// app/src/domain/types.ts
// Vocabolario condiviso del dominio. Nessun import da React, nessuna stringa leggibile.

// ── instradamento e motivo — R-03…R-06, tabella allegata n. 2 ─────────────────
export type MotivoCode = "16" | "31" | "13" | "altro";
export type Channel = "ufficio-postale" | "questura" | "dichiarazione-di-presenza";

// ── costi — R-15…R-21 ─────────────────────────────────────────────────────────
export type Istanza = "rilascio" | "rinnovo" | "aggiornamento" | "conversione" | "duplicato";
export type Durata = "fino-1-anno" | "1-2-anni" | "lungo-periodo";

// ── esiti di validazione — R-07, R-08, R-13 ───────────────────────────────────
export type Severity = "error" | "warning" | "info";
export interface Issue { field: number; code: string; severity: Severity }  // field = casella

// ── indirizzi — R-08, caselle 76-84 ───────────────────────────────────────────
export interface Address {
  presso?: string;      // nota (r): nome e cognome, o denominazione, presso cui recapitare
  via: string;
  civico?: string;
  comune: string;
  cap: string;          // 5 cifre, come stringa: lo zero iniziale conta
  provincia: string;    // sigla di due lettere, es. "MI"
}

// ── passaporto — caselle 44, 45 ───────────────────────────────────────────────
export interface PassportData {
  number: string;
  expiry: Date | null;
  mrz?: string;         // la riga leggibile a macchina, digitata dalla persona
}

// ── ordine di compilazione — R-12, nota (f) ───────────────────────────────────
export interface Step {
  id: string;           // "modulo-1" | "modulo-2" | "fotocopie" | "sezione-2" | "firma"
  i18nKey: string;
  route: string;
  requires: string[];   // id dei passi che la nota (f) impone prima di questo
}

// ── tutto ciò che la persona ha risposto ──────────────────────────────────────
export interface Answers {
  // dove si presenta — R-03…R-06
  motivo: MotivoCode;
  presentedBy: "interessato" | "terzo-autorizzato" | "minore-non-accompagnato";
  stayLongerThan3Months: boolean;

  // entro quando — R-01, R-02
  entryDate: Date | null;

  // chi è, come sul passaporto — R-07, caselle 3, 4
  surname: string;
  given: string;
  passport: PassportData;

  // dove arriva la raccomandata — R-08
  residence: Address;
  communicationAddress: Address | null;   // nota (q): null = uguale al precedente

  // quanto costa — R-15…R-21
  istanza: Istanza;
  durata: Durata;
  ageYears: number;
  childrenUnder14: number;

  // i moduli — R-11, R-13, R-14
  hasIncome: boolean;            // R-14: il Modulo 2 si compila solo se c'è reddito
  signatureConfirmed: boolean;   // R-13, casella 29
  sheetCountConfirmed: boolean;  // R-11, casella 25
}
```

**Regola di proprietà.** `types.ts` è l'unico posto dove questi nomi nascono. I moduli che il
contratto di dominio nomina come proprietari di un tipo (`fees.ts` per `Istanza` e `Durata`,
`data/motivi.ts` per `MotivoCode`, `validators.ts` per `Issue` e `Severity`, `routing.ts` per
`Channel`) lo **ri-esportano** — `export type { Istanza } from "./types"` — così la superficie
pubblica promessa dagli spec resta identica e non esistono due definizioni dello stesso tipo.
Nessun modulo di questo blocco crea quei file: li creeranno B1A, B2A e B3A.

## Cosa fare, e nient'altro

1. Crea `app/src/domain/types.ts` con **esattamente** il contenuto sopra.
2. Riscrivi `app/src/fixtures/sample-answers.ts`: cancella lo stub locale di `Answers`,
   importa il tipo da `../domain/types`, e rendi `SAMPLE` un `Answers` completo e valido —
   dati **palesemente finti** (nessun nome, numero di documento o indirizzo reale) e una
   `entryDate` costruita a mano, mai `new Date()`.
3. Niente logica, niente validazione, niente funzioni: qui ci sono solo tipi e una fixture.

## File

**Puoi scrivere in:** `app/src/domain/types.ts`, `app/src/fixtures/sample-answers.ts`.
**Non toccare:** `app/src/app/`, `app/src/components/`, `app/src/i18n/`, `app/tests/`.

## Fatto quando

`npx tsc --noEmit` non riporta errori e `npm test` resta verde.

## Restituisci

```
SPEC: B0B
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
