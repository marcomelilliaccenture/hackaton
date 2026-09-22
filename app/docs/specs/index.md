# Spec di costruzione

Uno spec = **una invocazione di un subagente**. È il payload che l'orchestratore passa, e
l'unica cosa che l'agente deve leggere per lavorare.

## Perché non basta il piano

[`app-plan.md`](../app-plan.md) è scritto per una persona che deve capire il progetto: ~24 KB,
16 sezioni, 34 requisiti, 18 criteri. Serve, ed è la fonte da cui questi spec sono derivati.

Ma se un subagente legge il piano per implementare un campo, paga ~7.000 token di contesto
per usarne 200 — e ne legge 34 requisiti quando gliene servono due. Con dodici invocazioni
il conto si moltiplica per dodici. Peggio: un agente che ha letto tutto il piano **trova
sempre qualcosa in più da fare**, e allarga lo scope senza accorgersene.

Quindi:

| | `app-plan.md` | uno spec |
|---|---|---|
| Per chi | il team, la giuria, l'orchestratore | un subagente, una volta |
| Dimensione | ~24 KB | ~2–3 KB |
| Requisiti | tutti e 34 | i due o tre che servono, **verbatim con la fonte** |
| Firme | tutto il contratto §8 | solo quelle del blocco, **copiate** |
| Rimandi | molti | **nessuno** |

## La regola: uno spec è chiuso

Un agente che lavora su uno spec **non deve aprire altro**. Se uno spec dice "vedi §8 del
piano", è rotto: quella riga va copiata dentro.

Chiuso significa che lo spec contiene, verbatim:
- i **criteri A-nn** che deve soddisfare, parola per parola;
- i **requisiti R-nn** che li giustificano, con la **fonte** (F-nn);
- le **firme** delle funzioni che tocca;
- i **file su cui può scrivere** e quelli che non deve toccare;
- il **formato del report** che deve restituire.

Unica eccezione ammessa: `docs/ux-spec.md` §4–§6, che gli spec di interfaccia citano per
riferimento. È la specifica di comportamento dei componenti, si legge una volta per sessione
e non si può duplicare in cinque spec senza che le cinque copie divergano.

**Nessuno spec rimanda a `dominio-permesso-di-soggiorno.md`** (45 KB): i requisiti sono già
estratti qui, con la fonte. Quel dossier è per gli umani.

## La mappa

Stato corrente in [`status.md`](./status.md). Budget e sync point in `app-plan.md` §11.

| Spec | Blocco | Traccia | Agente | Ore | Dipende da |
|---|---|---|---|---|---|
| [B0-scaffold](./B0-scaffold.md) | 0 | comune | `builder` | 0:30 | — |
| [B0B-domain-types](./B0B-domain-types.md) | 0B | comune | `builder` | 0:10 | B0 |
| [B1A-deadline-routing](./B1A-deadline-routing.md) | 1A | A | `test-author` → `builder` | 0:40 | B0B · **S1** |
| [B1B-shell-fieldcard](./B1B-shell-fieldcard.md) | 1B | B | `builder` + `clarity-guard` | 0:40 | B0 · **S1** |
| [B2A-fees-requirements](./B2A-fees-requirements.md) | 2A | A | `test-author` → `builder` | 0:40 | B1A |
| [B2B-percorso-dove-scadenza](./B2B-percorso-dove-scadenza.md) | 2B | B | `builder` | 0:40 | B1B |
| [B3A-validators](./B3A-validators.md) | 3A | A | `test-author` → `builder` | 0:40 | B2A · **S2** |
| [B3B-costi-documenti](./B3B-costi-documenti.md) | 3B | B | `builder` | 0:35 | B2B · **S2** |
| [B4A-modulo-1-4](./B4A-modulo-1-4.md) | 4A | A | `builder` | 0:45 | B3A |
| [B4B-riepilogo-stampa](./B4B-riepilogo-stampa.md) | 4B | B | `builder` | 0:35 | B3B |
| [B5-prima-limiti](./B5-prima-limiti.md) | 5 | comune | `builder` + `clarity-guard` | 0:25 | B4A · B4B |
| [B6-audit-evidenza](./B6-audit-evidenza.md) | 6 | comune | `a11y-auditor` + `clarity-guard` | 0:30 | B5 · **S3** |
| [B8-journey-playwright](./B8-journey-playwright.md) | 8 | comune | `journey-verifier` | 0:30 | B4B |
| [B7-deck](./B7-deck.md) | 7 | comune | skill `hackathon-pitch` | 0:35 | B6 · B8 |

Parallelizzabili nello stesso messaggio, perché non condividono file:
`B1A‖B1B` · `B2A‖B2B` · `B3A‖B3B` · `B4A‖B4B`.

## La frontiera dei file

Non negoziabile: è ciò che rende il parallelismo sicuro.

| Traccia | Scrive in |
|---|---|
| **A** — dominio e regole | `app/src/domain/`, `app/src/data/`, `app/tests/` |
| **B** — interfaccia e testi | `app/src/app/`, `app/src/components/`, `app/src/i18n/` |
| comune (B0, B5, B6, B7) | tutto, ma **da solo**: nessun altro spec in corso |
| **B8** — verifica end-to-end | `e2e/**` e `docs/evidence/before-after/`. **Mai** `app/**` |

Due agenti non scrivono mai lo stesso file. La traccia B programma contro le firme anche
prima che siano implementate, usando `app/src/fixtures/sample-answers.ts`.

## Il report che ogni agente restituisce

Formato fisso, massimo ~15 righe, **mai codice**:

```
SPEC: B3A
CRITERI ORA VERIFICABILI: A-08, A-09
FILE TOCCATI: app/src/domain/validators.ts, app/tests/validators.test.ts
TEST: 14 passati, 0 falliti
MOCK: nessuno
FUORI: NAME_NON_LATIN solo per l'alfabeto latino esteso — serve una tabella di traslitterazione
COMANDO: cd app && npm test
```

Se un agente restituisce un file intero o un racconto, il report va rimandato indietro. Un
return contract non rispettato una volta diventa la norma dieci minuti dopo.

## Scrivere un nuovo spec

Copia [`_template.md`](./_template.md). Nell'ordine: il requisito esiste in `app-plan.md` §4
con la fonte → la firma in §8 → il criterio A-nn in §11 → **poi** lo spec. Uno spec che
nasce prima del suo requisito è un numero senza fonte a schermo.
