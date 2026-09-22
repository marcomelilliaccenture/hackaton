# Workflow di costruzione — chi fa cosa, in che ordine, con quali prove

L'hackathon si chiama **Agentic Coding**: il modo in cui il prototipo è stato costruito è
materiale valutabile, non un retroscena. Questo file è il metodo. Non descrive intenzioni:
descrive ruoli con confini, handoff con contratti, e gate che si possono vedere passare o
fallire.

Regola che tiene tutto insieme: **l'AI ha costruito lo strumento, non gira dentro lo
strumento** (D-03). Nel prodotto non c'è nessuna chiamata a un modello.

Prerequisiti di lettura per chiunque entri: [`app-plan.md`](./app-plan.md) (cosa e con quali
criteri), [`persona.md`](./persona.md) (per chi), [`ux-spec.md`](./ux-spec.md) (com'è fatto),
[`sources.md`](./sources.md) (da dove viene ogni numero).

---

## 1. Tre livelli, tre mestieri

```
skill      cosa sappiamo fare        procedure riutilizzabili     .claude/skills/
subagent   chi lo fa e cosa rifiuta  ruoli con confini            .claude/agents/
hook       cosa succede da solo      automatismi                  .claude/hooks/
```

Il valore dei subagent non è il numero: è che **ognuno rifiuta qualcosa**, e il rifiuto è
scritto nella sua definizione. Un agente che accetta qualsiasi richiesta non è un ruolo, è
una scorciatoia.

| Agente | Fa | Rifiuta | Scrive solo in |
|---|---|---|---|
| `slice-planner` | Decide cosa entra nelle 5 ore e cosa si taglia; criteri e budget | Slice non dimostrabili end-to-end; criteri verificabili solo leggendo il codice | `docs/app-plan.md` §11–§14 |
| `test-author` | Vitest sul dominio, nomi che enunciano la regola in italiano | Toccare `app/src/**`; testare la UI; adeguare un test a un bug | `app/tests/**` |
| `builder` | Implementa uno slice contro criteri scritti | Allargare lo scope; lasciare rotto lo schermo della demo; dipendenze senza motivo | `app/**`, `agents/**` |
| `clarity-guard` | Confronta ogni testo utente con la fonte ufficiale | Riscrivere le stringhe dell'app: propone, non applica | `docs/evidence/meaning-checks.md` |
| `a11y-auditor` | Verifica i criteri di §10 del piano e §10 della spec UX | Riscrivere componenti; dichiarare conforme ciò che non ha verificato | `docs/evidence/a11y-report.md` |
| `journey-verifier` | Guida l'app vera in un browser: tastiera, stampa, contrasto, screenshot | Riparare l'app; scrivere test di regressione sui componenti | `e2e/**`, `docs/evidence/before-after/` |

Il confine fra `test-author` e `builder` è la scelta di progetto più importante (D-09):
quando lo stesso agente scrive test e implementazione, il test smette di essere una prova e
diventa la descrizione del bug.

| Skill | Quando |
|---|---|
| `frontend-design` | Decisione estetica non coperta da `ux-spec.md` |
| `hackathon-pitch` | Blocco 7: deck, speaker notes, audit contro i criteri di giuria |
| `skill-creator` | Solo se serve una nuova skill: non durante le 5 ore |

## 2. Il ciclo di uno slice

Ogni blocco del budget (§11 del piano) passa da qui. Il ciclo è sempre lo stesso, ed è
l'ordine che conta: **il test prima dell'implementazione, la fonte prima del testo,
l'accessibilità prima del "finito"**.

```
        ┌──────────────┐
        │ criterio A-nn│  da app-plan.md §11 — se non c'è, non si costruisce
        └──────┬───────┘
               │
   ┌───────────┴────────────┐
   │ blocco di dominio?     │
   └───┬────────────────┬───┘
       │ sì             │ no (interfaccia/testo)
       ▼                ▼
 ┌───────────┐    ┌───────────────┐
 │test-author│    │ clarity-guard │  il testo passa dalla fonte prima di essere scritto
 │ test rossi│    │ verdetto      │
 └─────┬─────┘    └───────┬───────┘
       │                  │
       └────────┬─────────┘
                ▼
          ┌──────────┐
          │ builder  │  implementa fino al criterio, non oltre
          └─────┬────┘
                │  hook run_tests.py  ← automatico a ogni Write/Edit
                ▼
          ┌──────────┐      rosso
          │  gate 1  │ ──────────────> torna a builder (test-author non ripara)
          │ npm test │
          └─────┬────┘
                │ verde
                ▼
          ┌──────────────┐    DERIVA
          │  gate 2      │ ───────────> la stringa torna al nome burocratico + [in revisione]
          │ clarity-guard│
          └─────┬────────┘
                │ OK / DA VERIFICARE con marcatore
                ▼
          ┌──────────────────┐   criterio rosso
          │  gate 3          │ ───────────> builder, con il criterio citato
          │ a11y-auditor     │
          │ + journey-verifier│  (B8: cio' che serve un browser)
          └─────┬────────────┘
                │
                ▼
        criterio A-nn spuntato nel piano
        + riga in docs/specs/status.md  ← la scrive l'orchestratore, a mano
```

L'ultima riga e' l'unico passo che **non accade da solo**. Prima c'erano due hook che
registravano tutto; sono stati rimossi (D-17). Se l'orchestratore non scrive quella riga, di
quel blocco non resta traccia.

I tre gate non sono facoltativi e non sono negoziabili al minuto 280. Il gate che salta è il
gate che si racconta in Q&A.

## 3. Contratti di handoff

Un agente invocato senza il suo contratto restituisce lavoro che va rifatto. Questa tabella è
il contratto: **cosa riceve** (nel prompt, non "nel contesto") e **cosa restituisce**.

| Agente | Riceve | Restituisce |
|---|---|---|
| `slice-planner` | Lo scope nuovo o il vincolo cambiato; il tempo residuo reale | `app-plan.md` §11–§14 riscritto: slice, criteri A-nn, cosa esce, budget, rischi con piano B |
| `test-author` | Il nome delle funzioni da §8 del piano, i requisiti R-nn che le giustificano, i codici attesi | I file in `app/tests/`, l'esito di `npm test`, e per ogni rosso: input esatto, atteso, ottenuto |
| `builder` | I criteri A-nn da soddisfare (numerati), i file su cui può scrivere, i requisiti R-nn con la fonte | Quali criteri sono ora verificabili, cosa ha mockato, cosa ha lasciato fuori, **il comando esatto** per vederlo girare |
| `clarity-guard` | Le chiavi i18n nuove o cambiate; la fonte che le copre (F-nn) | Righe in `meaning-checks.md` con verdetto OK / DERIVA / DA VERIFICARE, e per ogni DERIVA la correzione proposta |
| `a11y-auditor` | Le rotte toccate; i criteri di §10 del piano e la tabella §10 di `ux-spec.md` | `a11y-report.md`: criterio, esito, evidenza (selettore, misura), e per ogni rosso cosa cambiare |
| `journey-verifier` | Lo spec B8; le chiavi i18n reali da cui prendere i nomi accessibili | Esiti di `cd e2e && npm test`, e per ogni rosso: rotta, criterio, cosa ha premuto, atteso, ottenuto |

Regola sui prompt: **si passano i numeri, non le descrizioni.** "Implementa A-09 e A-11 per la
casella 76, requisito R-08, fonte F2 nota (r)" è un handoff. "Fai la pagina dell'indirizzo"
è un invito a inventare.

### Template di invocazione

```
builder — implementa i criteri A-08 e A-11 di docs/app-plan.md §11.
Requisiti: R-07 (nota (a) del MOD. 209, fonte F2). Contratto di dominio: §8, validateName.
UI: docs/ux-spec.md §5 FieldCard, §4 ciclo di vita del campo, §6 formato del messaggio.
Puoi scrivere in: app/src/app/modulo/, app/src/components/, app/src/i18n/.
NON toccare: app/src/domain/, app/tests/.
Al termine: dimmi quali criteri sono verificabili e il comando per vederlo.
```

```
test-author — copri deadline.workingDaysDeadline e calendarDaysDeadline
(docs/app-plan.md §8, requisiti R-01 e R-02).
Casi obbligatori: ingresso venerdì 18/09/2026 · ingresso a ridosso di una festività ·
termine già scaduto (giorni negativi) · skipped[] riporta il motivo · countedDays ha la
lunghezza attesa. Date reali, mai new Date(). Asserisci sui codici, non sulle frasi.
```

```
clarity-guard — controlla le chiavi doc.* nuove in app/src/i18n/it.json contro F1
(docs/sources/documenti-kit-postale-per-tipologia.txt).
Attenzione a R-23: il contratto di soggiorno è solo primo rilascio — un obbligo condizionato
presentato come assoluto è il difetto da trovare.
```

## 4. Due tracce, due persone, tre sincronizzazioni

Il team è di due persone: due sessioni di agentic coding in parallelo, su due tracce che si
toccano il meno possibile.

| | Traccia A — dominio e regole | Traccia B — interfaccia e testi |
|---|---|---|
| Scrive in | `app/src/domain/`, `app/src/data/`, `app/tests/` | `app/src/app/`, `app/src/components/`, `app/src/i18n/` |
| Agenti | `test-author` → `builder` | `builder` + `clarity-guard` |
| Blocchi | 1A · 2A · 3A · 4A | 1B · 2B · 3B · 4B |

**Le due tracce non scrivono mai lo stesso file.** L'unica frontiera è §8 del piano: la
traccia B programma contro le firme, anche prima che siano implementate, con dati da
`fixtures/`. Chi vuole cambiare una firma lo dice **prima** di cambiarla.

| Sync | Quando | Cosa si verifica |
|---|---|---|
| **S1** | fine blocco 0 | Lo scaffold è condiviso, `npm test` gira, le firme di §8 sono congelate |
| **S2** | fine blocchi 2A e 2B | Il dominio restituisce dati veri alle pagine: si sostituiscono i fixture, si guarda il percorso `/percorso → /dove → /scadenza` |
| **S3** | inizio blocco 6 | Percorso completo da tastiera in francese; da qui si tocca solo ciò che un gate segnala |

Dopo S3 **nessuna feature nuova**. Chi propone una feature dopo S3 propone di tagliare un
gate: e i gate sono la ragione per cui il prototipo è difendibile.

## 5. Cosa succede da solo — gli hook

Configurati in [`.claude/settings.json`](../.claude/settings.json). Sono due, ognuno con un
mestiere che non è "tenere un registro":

| Hook | Evento | Cosa fa |
|---|---|---|
| `protect_brief.py` | `PreToolUse` · Write/Edit | Nega le scritture su `docs/challenge-brief.md`: il brief è la fonte di verità, non si "migliora" |
| `run_tests.py` | `PostToolUse` · Write/Edit | Lancia `npm test` dopo una modifica `.ts/.tsx` sotto `app/` o `agents/`; se è rosso restituisce l'output al modello — il **gate 1** scatta all'edit che l'ha rotto, non tre edit dopo |

Gli hook si caricano **all'avvio della sessione**: dopo averli modificati serve una sessione
nuova. Ognuno va verificato passandogli il payload su stdin prima di fidarsene — un hook rotto
blocca il lavoro di entrambe le tracce, e un hook che ingoia le sue eccezioni lo fa in silenzio.

`run_tests.py` non gira su `e2e/`, ed è voluto: il gate 1 deve costare due secondi, non
l'avvio di un browser. La verifica in un browser è il blocco B8, che si lancia quando serve.

## 6. L'evidenza di come si è lavorato

Quattro artifact. **Nessuno è generato**: la registrazione automatica (due hook e un
generatore di diagrammi) è stata rimossa il 22/09/2026 — vedi D-17 nel registro delle
decisioni.

| Artifact | Chi lo scrive | Cosa dimostra |
|---|---|---|
| `docs/specs/status.md` | `orchestrator`, una riga per spec | Cosa è stato fatto, da chi, e **quali gate hanno fermato cosa** |
| `docs/decision-log.md` | il team, a ogni decisione con conseguenze | Perché, e cosa abbiamo scartato |
| `docs/ai-contributions.md` | il team | Dove ha lavorato l'AI, dove è servita revisione umana, cosa è simulato |
| `docs/evidence/` | `clarity-guard`, `a11y-auditor`, `journey-verifier` | Che i testi, l'accessibilità e il percorso sono stati verificati e non affermati |

**Cosa questo ci costa, e va detto in Q&A se lo chiedono.** Un registro scritto a mano è meno
completo di un log, ed è *intenzionale*: racconta ciò che chi scriveva riteneva importante.
Non finge di essere una traccia esaustiva. La difesa non è "abbiamo tutto", è "abbiamo scritto
le decisioni mentre le prendevamo, ed ecco il file".

Per la slide "come l'abbiamo costruito": **conta, non stimare.** Le righe di `status.md`, le
decisioni nel registro, i gate che hanno bloccato qualcosa. Un numero che non sta in un file
non va sulla slide — in un hackathon sull'agentic coding, un numero inventato sul proprio
processo è il modo più rapido di perdere credibilità.

La tabella "Gate che hanno fermato qualcosa" in `status.md` va compilata **quando accade**.
Se la si riempie alla fine, si riempie di memoria.

## 7. Dove serve una persona, sempre

Il brief mette "uso dell'AI non spiegabile dal team" fra le cose da evitare. Questi cinque
punti non si delegano, e il motivo è scritto:

1. **I valori normativi.** Importi, termini, codici: una persona li rilegge sulla fonte in
   `docs/sources/`. Un modello che sbaglia una cifra produce un errore plausibile, che è la
   specie peggiore.
2. **Il verdetto su una DERIVA.** `clarity-guard` propone; la correzione che va a schermo la
   decide una persona. Il significato di un obbligo di legge non è una preferenza di stile.
3. **Il giudizio estetico e di leggibilità.** Una schermata può passare ogni criterio e
   restare illeggibile.
4. **Cosa tagliare.** Il budget è una decisione del team: `slice-planner` propone il taglio,
   non lo esegue.
5. **Cosa si dichiara in `/limiti`.** È il terzo deliverable del tema e riguarda la
   responsabilità verso una persona in una procedura legale.

Ogni riga di `docs/ai-contributions.md` esiste per rispondere in Q&A alla domanda "questo chi
l'ha scritto, e chi l'ha controllato".

Sesto punto, dopo la rimozione della tracciatura: **scrivere il registro.** Era l'unica cosa
che accadeva da sola; adesso non accade se nessuno la fa.

## 8. Come si aggiunge un pezzo, dopo l'hackathon

Nell'ordine, senza salti: **requisito in `app-plan.md` §4 con la fonte** → firma in §8 →
criterio A-nn in §11 → **spec in `docs/specs/`** → `test-author` → `builder` →
`clarity-guard` → `a11y-auditor` → `journey-verifier`.

Un pezzo che entra saltando il primo passo è un numero senza fonte a schermo: esattamente ciò
che questo progetto esiste per non fare.
