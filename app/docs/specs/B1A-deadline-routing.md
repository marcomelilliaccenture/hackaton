# B1A — `deadline.ts` + `routing.ts`

> Blocco 1A · traccia A · 0:40 · `test-author` **prima**, poi `builder`
> Parallelizzabile con B1B (file disgiunti).
> **Spec chiuso.** Non aprire `app-plan.md` né il dossier di dominio.

## Obiettivo

Le due regole che aprono il percorso: **entro quando** si presenta la domanda, e **dove** si
presenta. Funzioni pure, testate, senza React e senza lingua.

## Criteri da soddisfare

- [ ] **A-04** `/dove` dice "Ufficio Postale" per il codice `16` presentato dall'interessata, e
      dice "Questura, perché…" se si dichiara di presentare tramite avvocato o tutore.
- [ ] **A-05** `/scadenza` mostra la data limite a **8 giorni lavorativi**, **l'elenco dei
      giorni contati** e quelli saltati con il motivo (weekend / festività), più la data a 8
      giorni di calendario come limite prudente, con la fonte di entrambe.

In questo blocco i criteri sono soddisfatti **a livello di dominio** (verificabili
dall'output dei test). Le pagine arrivano in B2B.

## Requisiti di legge (con fonte)

| # | Requisito | Il dato | Fonte |
|---|---|---|---|
| R-01 | Termine per la prima domanda | **8 giorni lavorativi** dall'ingresso (casella 48), al Questore della provincia in cui si trova | F12 = art. 5 c. 2 D.lgs 286/1998; confermato da F3 e F4 |
| R-02 | Conflitto sul termine | F5 (Poste) scrive "8 giorni" senza "lavorativi" | F5 vs F3/F4 → mostriamo **entrambe** le date |
| R-03 | Tipologie che passano dal kit postale | 33 codici motivo ammessi; le quattro esposte sono `16` lavoro subordinato, `31` studente, `13` famiglia, `altro` | F2 tab. 2, F7 |
| R-04 | Tipologie solo in Questura | 14 motivi: asilo politico (primo rilascio), cure mediche, minore età, protezione internazionale, protezione speciale, protezione sussidiaria, motivi umanitari, affari, gara sportiva, giustizia, status apolide (primo rilascio), integrazione minore, invito, casi speciali | F8 |
| R-05 | Chi va in Questura comunque | avvocati, tutori legali, amministratori di sostegno, incaricati dal Tribunale; minori ultraquattordicenni non accompagnati dal genitore | F3, F5 |
| R-06 | Soggiorni ≤ 3 mesi | non si chiede il permesso: si fa la **dichiarazione di presenza** | F4 |

## Contratto

```ts
// data/motivi.ts — tabella allegata n. 2 (F2 · F7), verificata 22/09/2026
export type MotivoCode = "16" | "31" | "13" | "altro";
export interface Motivo {
  code: MotivoCode;
  official: string;   // nome della tabella allegata n. 2, alla lettera
  i18nKey: string;
  channel: "ufficio-postale" | "questura";
  source: string;     // "F2 · F7"
}

// routing.ts — R-03…R-06
export type Channel = "ufficio-postale" | "questura" | "dichiarazione-di-presenza";
export type RoutingReason =
  | "MOTIVO_SOLO_QUESTURA"
  | "PRESENTATO_DA_TERZO"
  | "MINORE_NON_ACCOMPAGNATO"
  | "SOGGIORNO_BREVE"
  | "MOTIVO_NON_RICONOSCIUTO";
export function channelFor(input: {
  motivo: MotivoCode;
  presentedBy: "interessato" | "terzo-autorizzato" | "minore-non-accompagnato";
  stayLongerThan3Months: boolean;
}): { channel: Channel; reasons: RoutingReason[] };

// deadline.ts — R-01, R-02
export function workingDaysDeadline(
  entryDate: Date, days?: number, holidays?: Date[]   // default: 8, FESTIVITA_NAZIONALI
): {
  deadline: Date;
  countedDays: Date[];
  skipped: { date: Date; reason: "weekend" | "holiday" }[];
};
export function calendarDaysDeadline(entryDate: Date, days?: number): Date;
export function daysRemaining(deadline: Date, today: Date): number;  // può essere negativo
```

Regola di conteggio: **il giorno di ingresso non conta**; si contano gli 8 giorni lavorativi
successivi. Sabato e domenica esclusi, più le festività nazionali.

`data/festivita.ts` — festività nazionali italiane 2026 e 2027, costante nel codice, con in
testa il commento `[da verificare: manca una fonte citabile in docs/sources.md]`. Le
festività **patronali locali non sono gestite**: è un limite dichiarato, non un bug.

Ogni file di `data/` comincia con un commento che cita la fonte (`F2`, `F7`…) e la data di
verifica. Un dato senza quel commento non entra.

## `test-author` — casi obbligatori

Nomi in italiano che enunciano la regola. **Date reali, mai `new Date()`.** Asserzioni sui
**codici**, non su frasi.

`deadline`:
- ingresso **venerdì 18 settembre 2026** → la scadenza cade il **mercoledì 30 settembre 2026**
  (il caso di Fatou: è il numero che finisce in demo, deve essere il primo test);
- `countedDays` ha esattamente 8 elementi;
- `skipped` riporta il motivo `"weekend"` per sabato e domenica e `"holiday"` per una festività;
- ingresso a ridosso di una festività (es. prima del 1 novembre) → i giorni saltati la includono;
- `daysRemaining` è **negativo** quando il termine è già passato;
- `calendarDaysDeadline` sullo stesso ingresso dà una data **anteriore o uguale** a quella dei
  giorni lavorativi (è il limite prudente: se così non fosse, la regola è invertita).

`routing`:
- `16` + `interessato` + soggiorno lungo → `ufficio-postale`, `reasons` vuoto;
- `16` + `terzo-autorizzato` → `questura`, `reasons` contiene `PRESENTATO_DA_TERZO`;
- `minore-non-accompagnato` → `questura` con `MINORE_NON_ACCOMPAGNATO`;
- `stayLongerThan3Months: false` → `dichiarazione-di-presenza` con `SOGGIORNO_BREVE`;
- `"altro"` → `questura` con `MOTIVO_NON_RICONOSCIUTO` (non sappiamo dirlo: si manda a chiedere);
- più condizioni insieme → `reasons` **le contiene tutte**, non solo la prima.

## File

**Puoi scrivere in:** `app/src/domain/deadline.ts`, `app/src/domain/routing.ts`,
`app/src/data/motivi.ts`, `app/src/data/festivita.ts`, `app/tests/`.
**Non toccare:** `app/src/app/`, `app/src/components/`, `app/src/i18n/` (traccia B).

`test-author` scrive **solo** in `app/tests/`. Se un test è rosso perché l'implementazione
sbaglia, riporta input / atteso / ottenuto e si ferma: non ripara.

## Fatto quando

`cd app && npm test` → tutti verdi, e fra i nomi dei test si legge
*"un ingresso venerdì 18 settembre 2026 fa scadere il termine mercoledì 30 settembre 2026"*.

## Restituisci

```
SPEC: B1A
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
