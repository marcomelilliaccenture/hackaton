# B6 — Audit e evidenza

> Blocco 6 · comune · 0:30 · `a11y-auditor`, `clarity-guard` e `journey-verifier`
> (parallelizzabili: scrivono file diversi).
> Dopo il sync **S3**: da qui **nessuna feature nuova**. Si tocca solo ciò che un gate segnala.
> **Spec chiuso.**

## Obiettivo

Trasformare "abbiamo fatto attenzione" in tre artifact che una giuria può leggere. Nessuno
dei tre è scritto a mano a posteriori: è il punto.

## Criteri da soddisfare

- [ ] **A-17** Il percorso `/` → `/riepilogo` si completa **da tastiera**, **in francese**,
      **senza errori in console**.
- [ ] **A-18** `npm test` verde e `npm run build` che passa.

## Tre esecuzioni, in parallelo: scrivono file diversi

### 1 · `a11y-auditor` → `docs/evidence/a11y-report.md`

Verifica la tabella di `docs/ux-spec.md` §10 su tutte le rotte costruite. Il criterio più
grave apre il report: **se il percorso da tastiera si rompe, è la prima riga**.

Tre esiti, nessun quarto: **VERDE** · **ROSSO** · **DA VERIFICARE A MANO**. Non esiste
"parzialmente". Ogni ROSSO porta file, riga e la modifica proposta in una riga — la applica
`builder`, non l'auditor.

I contrasti dei token di `ux-spec.md` §2 vanno **misurati**, con il rapporto nel report. Un
numero stimato a occhio da un esadecimale è un numero inventato.

### 2 · `clarity-guard` → `docs/evidence/meaning-checks.md`

Passata finale su **tutte** le chiavi i18n, non solo quelle nuove. Una riga per controllo, con
il testo originale accanto anche quando il verdetto è OK: senza l'originale la tabella non
dimostra niente.

```markdown
| id | chiave i18n | fonte | testo ufficiale (estratto) | nostro testo | tolto | verdetto |
```

I cinque controlli, in ordine di gravità: **obbligo alterato** (una condizione presentata come
assoluta — il difetto più frequente e più dannoso) · **numero che non torna** ·
**nome burocratico sparito** · **consiglio mascherato** · **traduzione che ha perso un pezzo**
(en · fr · es confrontati con l'**italiano nostro**, non con l'originale ufficiale).

La colonna **"tolto"** deve restare onesta: se una condizione è stata omessa perché non
riguarda Fatou, si scrive ("solo al rinnovo: non riguarda il primo rilascio"). È esattamente
ciò che la giuria chiederà.

**Nessuna DERIVA può restare aperta.** Se resta, la stringa torna al nome burocratico +
`[in revisione]`: burocratese visibile è meglio di senso alterato.

### 3 · `journey-verifier` → il percorso in un browser

Questo è lo spec [B8](./B8-journey-playwright.md), e qui si incastra: A-17 e A-12 non li può
chiudere `a11y-auditor`, che non ha un browser. Lanciali insieme — scrivono file diversi.

```bash
cd e2e && npm test
cd e2e && npm run evidence
```

Senza clip registrata, la demo è dal vivo: questo è l'unico controllo che dice, prima di
salire, che il percorso tiene.

## Poi: gli screenshot prima/dopo

`docs/evidence/before-after/`, due coppie, nomi in kebab-case:

| File | Cosa mostra |
|---|---|
| `recapito-prima.png` | lo screenshot annotato del modulo ufficiale (`/prima` tagliata, D-17), casella 76 annotata: il campo che nessuno capisce |
| `recapito-dopo.png` | `/modulo/4`: "Dove ricevi la posta?" con la spiegazione |
| `nome-prima.png` | lo screenshot annotato del modulo ufficiale (`/prima` tagliata, D-17), caselle 3–4 annotate |
| `nome-dopo.png` | `/modulo/1` con l'esempio della MRZ |
| `costi-dopo.png` | `/costi`: le voci accanto al totale |
| `riepilogo-stampa.png` | `/riepilogo` in anteprima di stampa |

Le produce `journey-verifier` con `cd e2e && npm run evidence`: stesso crop, stessa lingua,
rifacibili con un comando quando cambia un testo. Non si scattano a mano alle 16:40.

Nessun dato reale. Se in uno screenshot compare un nome, è inventato e palesemente tale.

## Poi: chiudere i registri

1. `docs/specs/status.md` — la **Nota di chiusura**: cosa non è stato fatto e perché. E la
   tabella "Gate che hanno fermato qualcosa": è l'**unica** traccia del flusso che resta, la
   registrazione automatica è stata rimossa (D-17). Se un gate non ha mai fermato niente, va
   dichiarato come decorativo: è più credibile di tre gate tutti verdi.
2. `docs/ai-contributions.md` — la tabella "cosa è simulato": ogni mock riportato dagli
   agenti nei loro report diventa una riga. Un mock scoperto in Q&A costa il punteggio di
   fattibilità; dichiararlo costa tre secondi.
3. `docs/decision-log.md` — le decisioni prese durante la build che non erano nel piano.

## File

**`a11y-auditor` scrive solo in:** `docs/evidence/a11y-report.md`.
**`clarity-guard` scrive solo in:** `docs/evidence/meaning-checks.md`.
**`journey-verifier` scrive solo in:** `e2e/**` e `docs/evidence/before-after/`.
**L'orchestratore scrive solo in:** `docs/specs/status.md`.
**Le correzioni ai file di `app/` le fa `builder`**, su indicazione dei report.

## Fatto quando

1. `npm test` verde, `npm run build` passa.
2. Il percorso `/` → `/riepilogo` completato **solo da tastiera**, **in francese**, con la
   console aperta e vuota. Questo si fa **a mano**, guardando: è il criterio A-17 e non lo
   verifica nessuno script.
3. `a11y-report.md` esiste, nessun criterio ROSSO aperto.
4. `meaning-checks.md` esiste, nessuna DERIVA aperta.
5. `cd e2e && npm test` lanciato, con gli esiti riportati (B8).
6. `before-after/` con le sei immagini.
7. `status.md` chiuso — tabella dei gate compilata — e `ai-contributions.md` con i mock
   dichiarati.

## Restituisci

```
SPEC: B6
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
