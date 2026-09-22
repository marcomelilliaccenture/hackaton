# Registro di esecuzione

Unico file mutabile dell'orchestratore. Si aggiorna **una riga alla volta**, con `Edit`, mai
riscrivendolo. Chi vuole sapere dove siamo legge questo, non il codice.

Stati: `da fare` · `in corso` · `gate 1` · `gate 2` · `gate 3` · `fatto` · `tagliato`.

| Spec | Cosa | Agente | Stato | Criteri | Mock | Ora |
|---|---|---|---|---|---|---|
| B0 | scaffold Next.js + Tailwind + Vitest + i18n vuoto | `builder` | fatto | A-18 · A-01 parz. | nessuno | 11:57 |
| B0B | `types.ts`: Answers, Address, PassportData, Step | `builder` | fatto | S1 | nessuno | 12:06 |
| B1A | `deadline.ts` + `routing.ts` + test | `test-author`→`builder` | fatto | A-04 A-05 (dominio) | nessuno | 12:41 |
| B1B | shell, `FieldCard`, `ExplainPanel`, it/fr | `builder`+`clarity-guard` | fatto (gate 2 riaperto e chiuso su F9) | A-01 A-10 | `controlloProvvisorio()` in /modulo/4 | 12:52 |
| B2A | `fees.ts` + `requirements.ts` + test | `test-author`→`builder` | fatto | A-06 A-07 (dominio) | nessuno | 12:41 |
| B2B | `/percorso` `/dove` `/scadenza` | `builder` | fatto | A-02 A-03 A-04 A-05 | `stayLongerThan3Months` fisso | 13:05 |
| B3A | `validators.ts` + `form-model.ts` + test | `test-author`→`builder` | fatto | A-08 A-09 A-11 (dominio) | costanti fogli `[da verificare]` | 12:52 |
| B3B | `/costi` `/documenti` + cuciture S2 | `builder` | fatto | A-06 A-07 | nessuno | 13:21 |
| B4A | `/modulo/1` `/modulo/4` + errori spiegati | `builder` | fatto | A-08 A-09 A-10 A-11 | mock B1B rimosso | 13:37 |
| B4B | `/riepilogo` + CSS di stampa + cablaggio rotte | `builder` | fatto | A-12 A-13 A-14 | nessuno | 13:54 |
| B5 | `/limiti` (`/prima` tagliata, D-17) | `builder`+`clarity-guard` | fatto | A-16 | nessuno | 14:07 |
| B8 | percorso end-to-end con Playwright + evidenza | **verifica manuale dell'utente** | fuori dalla catena agenti | S3 | | 14:08 |
| B9 | traduzione inglese completa di `en.json` | `builder`+`clarity-guard` | in corso | A-01 | | 14:08 |
| B6 | audit a11y + meaning-checks + evidenza | `a11y-auditor`+`clarity-guard` | da fare | A-17 A-18 | | |
| B8 | verifica end-to-end con Playwright | `journey-verifier` | da fare | A-12 A-17 | | |
| B7 | deck (demo dal vivo, nessuna clip) | skill `hackathon-pitch` | tagliato: narrativa e deck si costruiscono in sessione (D-19) → `presentation/storytelling.md` | — | | 12:50 |

## Sync point

| | Quando | Verificato |
|---|---|---|
| **S1** | dopo B0 | ☑ scaffold condiviso · ☑ `npm test` gira (1/1) · ☑ firme congelate in `domain/types.ts` (B0B, D-16), `tsc --noEmit` pulito — **chiuso 12:06** |
| **S2** | dopo B2A e B2B | ☑ il dominio alimenta le pagine (68 test, `tsc` pulito, build ok) · ☑ fixture sostituiti · ☑ `/percorso → /dove → /scadenza` si percorre — **ma** `/` non linka `/percorso` e `DeadlineBanner` non è nel layout: cuciture assegnate a B3B |
| **S3** | prima di B6 | ☐ percorso completo da tastiera in francese · ☐ **da qui nessuna feature nuova** |

## Gate che hanno fermato qualcosa

Una riga per volta che un gate ha bloccato. Serve al deck: un gate che non ha mai fermato
niente è decorativo, e va detto.

| Gate | Spec | Cosa ha fermato | Come è stato risolto |
|---|---|---|---|
| S1 | B0 | `Answers` inventato come stub nelle fixture: il contratto di dominio non lo definiva | spec B0B + `domain/types.ts`, D-16 |
| 1 · test | B1A | lo spec datava il termine "martedì 30 settembre 2026": è un mercoledì | corretto nello spec, non nel test |
| 2 · significato | B1B | la casella del campo PRESSO era indicata come **76**: F9 dice **77** (la 76 è l'intestazione della sezione 8). Fatou avrebbe ricopiato il numero sbagliato | scaricati F9 e F11 in `docs/sources/`, corretti spec, codice e i18n |

## Nota di chiusura

_(la scrive l'orchestratore alla fine della sessione: cosa non è stato fatto e perché)_
