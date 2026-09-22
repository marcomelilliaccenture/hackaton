# B2B — `/percorso` · `/dove` · `/scadenza`

> Blocco 2B · traccia B · 0:40 · `builder`
> Parallelizzabile con B2A. Dipende da B1B (componenti) e dalle firme di B1A.
> **Spec chiuso.** Riferimento di comportamento: `docs/ux-spec.md` §3, §4, §6, §7.

## Obiettivo

Le tre schermate che danno il primo valore: cinque domande, la risposta "Poste o Questura", e
la data entro cui spedire con il conteggio aperto.

## Criteri da soddisfare

- [ ] **A-02** `/percorso` fa **una domanda per schermata**, con il passo indietro sempre
      disponibile e le risposte che sopravvivono a un refresh.
- [ ] **A-03** La data di ingresso rifiuta una data futura e avvisa (non blocca) oltre 90
      giorni nel passato, **spiegando** invece di mostrare un errore muto.
- [ ] **A-04** `/dove` dice "Ufficio Postale" per il codice `16` presentato dall'interessata,
      e dice "Questura, perché…" se si dichiara di presentare tramite avvocato o tutore.
- [ ] **A-05** `/scadenza` mostra la data limite a **8 giorni lavorativi**, **l'elenco dei
      giorni contati** e quelli saltati con il motivo (weekend / festività), più la data a 8
      giorni di calendario come limite prudente, con la fonte di entrambe.

## Le cinque domande di `/percorso`

Una per schermata, in quest'ordine. Ognuna è un `FieldCard` o un gruppo di radio da 44px.

| # | Domanda (nostra) | Alimenta | Casella 209 |
|---|---|---|---|
| 1 | "Perché sei in Italia?" → lavoro dipendente · studio · famiglia · un altro motivo | `motivo` | **16** |
| 2 | "Chi presenta la domanda?" → io stessa · un avvocato o un tutore per me · sono un minore non accompagnato | `presentedBy` | — |
| 3 | "Quando sei entrata in Italia?" | `entryDate` | **48** |
| 4 | "In quale provincia soggiorni?" | `province` | **5** |
| 5 | "Percepisci un reddito?" (sì → servirà anche il Modulo 2) | `hasIncome` | — |

La domanda 1 precompila la **casella 16** con il codice: mostralo ("il tuo codice è `16`"),
perché è uno dei punti in cui la gente sbaglia e perché è un dato che finisce sul cartaceo.

La domanda 5 decide se il Modulo 2 (68 caselle) esiste o no per questa persona: si compila
solo "qualora si percepisca un reddito" (F3). Se la risposta è no, quelle caselle **non
compaiono mai**.

Validazione della data (A-03): data futura → `error` `ENTRY_DATE_FUTURE`; oltre 90 giorni nel
passato → `warning` `ENTRY_DATE_TOO_OLD`, che **non blocca** e spiega che il termine è
passato e serve un'altra strada. Il testo ha tre parti (`ux-spec.md` §6).

Persistenza (`ux-spec.md` §7): `localStorage`, chiave `kit209.v1`, scritta a ogni `blur`. Un
passo = una URL, il tasto Indietro del browser fa il passo indietro. Una volta, su
`/percorso`, il badge "le tue risposte restano su questo telefono".

## `/dove`

Chiama `channelFor({ motivo, presentedBy, stayLongerThan3Months })` e rende l'esito. Tre
uscite possibili, ognuna con **il motivo scritto**:

- **Ufficio Postale** → "Puoi usare il kit postale." + cosa portare allo Sportello Amico +
  il link a `/scadenza`.
- **Questura** → "Questa domanda si presenta in Questura, non alla posta, perché…" con il
  motivo tradotto da `reasons[]`. Se le ragioni sono più di una, **le elenca tutte**.
- **Dichiarazione di presenza** → "Per un soggiorno fino a tre mesi non si chiede il permesso".

`reasons[]` → chiavi i18n:

| Codice | Testo (senso, non parola per parola) |
|---|---|
| `MOTIVO_SOLO_QUESTURA` | per questo motivo la domanda si presenta solo in Questura |
| `PRESENTATO_DA_TERZO` | avvocati, tutori e amministratori di sostegno presentano in Questura |
| `MINORE_NON_ACCOMPAGNATO` | un minore di 14–18 anni non accompagnato dal genitore va in Questura |
| `SOGGIORNO_BREVE` | fino a tre mesi si fa la dichiarazione di presenza, non il permesso |
| `MOTIVO_NON_RICONOSCIUTO` | non possiamo dirlo per il tuo caso: ecco dove chiedere (patronato, numero verde Poste 800.200.309) |

`MOTIVO_NON_RICONOSCIUTO` **non è un errore dell'utente**: è un limite dichiarato dello
strumento, e il testo deve dirlo così. Ogni esito porta il `SourceNote` (F7 · F8 · F3 · F5).

## `/scadenza`

Chiama `workingDaysDeadline(entryDate)`, `calendarDaysDeadline(entryDate)`,
`daysRemaining(deadline, today)`.

Mostra, in quest'ordine:

1. **La data**, in formato lungo e locale: "martedì 30 settembre 2026". Mai `30/09`.
2. **I giorni rimanenti**, in parole. Sotto i 2 giorni cambia la frase ("oggi è l'ultimo
   giorno utile"), **non** il colore: non è un countdown, è un'informazione.
3. **L'elenco dei giorni contati**, uno per uno, con i saltati barrati e il motivo accanto
   (sabato · domenica · festività). È il punto in cui lo strumento si rende verificabile: se
   la persona non può controllare il conto, deve fidarsi, e non ha motivo di farlo.
4. **La data a 8 giorni di calendario** come limite prudente, con la spiegazione del perché
   ci sono due date: F4 e F3 dicono "8 giorni lavorativi", F5 (Poste) dice "8 giorni".
   Il testo **non sceglie per lei**: dice quale è la più cauta e perché ce ne sono due.
5. **La fonte di entrambe** (`SourceNote`: F12 art. 5 c. 2 D.lgs 286/1998 · F3 · F4 · F5).
6. Cosa succede se si supera, **in una frase, senza catastrofismo** e senza previsioni: la
   domanda tardiva può essere rifiutata, e lì si va dal patronato.

Da qui in avanti il `DeadlineBanner` compare su **ogni** pagina (`ux-spec.md` §3).

## File

**Puoi scrivere in:** `app/src/app/percorso/`, `app/src/app/dove/`, `app/src/app/scadenza/`,
`app/src/components/DeadlineBanner.tsx`, `app/src/components/StepProgress.tsx`,
`app/src/i18n/`.
**Non toccare:** `app/src/domain/`, `app/src/data/`, `app/tests/`.

Se le funzioni di B1A non sono ancora pronte, importa le firme e usa
`app/src/fixtures/sample-answers.ts`. **Non reimplementare una regola di dominio in una
pagina**: se manca, dillo nel report.

## Fatto quando

1. `/percorso`: cinque schermate, una domanda ciascuna, indietro sempre disponibile. Refresh
   al passo 4 → le risposte ci sono ancora.
2. Data di ingresso domani → errore spiegato. Data di 6 mesi fa → avviso, e si continua.
3. `/dove` con "lavoro dipendente" + "io stessa" → **Ufficio Postale**. Cambia in "un avvocato
   per me" → **Questura**, con il motivo scritto.
4. `/scadenza` con ingresso 18/09/2026 → **martedì 30 settembre 2026**, 8 giorni elencati, i
   weekend barrati col motivo, la seconda data e le fonti.
5. Solo tastiera, in francese, senza errori in console.

## Restituisci

```
SPEC: B2B
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
