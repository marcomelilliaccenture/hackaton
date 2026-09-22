# B7 — Deck

> **SPEC RITIRATO (D-19).** La presentazione non passa più dalla pipeline degli spec: narrativa
> e deck si costruiscono in sessione, a partire da [`presentation/storytelling.md`](../../presentation/storytelling.md).
> Questo file resta come materiale di riferimento — il copione della demo e la mappa fra i tre
> deliverable e i file che li contengono sono stati ripresi nello storytelling. Non eseguirlo.

> Blocco 7 · comune · 0:35 · skill **`hackathon-pitch`** (non un subagente: è una procedura)
> Dipende da B6: il deck cita gli artifact, quindi gli artifact esistono già.
> ~~**Spec chiuso.**~~

## Obiettivo

Il deck Accenture. **Nessuna clip registrata: la demo è dal vivo.** Nessun numero nel deck
che non esista già in un file del repo.

## Cosa esiste già, e non va riscritto

Il deck **cita**, non riformula. Questa è la mappa fra i tre deliverable del tema e i file
che li contengono:

| Deliverable del Tema 01 | Dove è già scritto |
|---|---|
| **1 · Persona & Barriera** | `docs/persona.md` — profilo, il momento esatto del blocco, gli otto attriti con la fonte di ognuno |
| **2 · Percorso Assistito** | `docs/app-plan.md` §2 (tabella prima → dopo) · `docs/evidence/before-after/` · la demo dal vivo |
| **3 · Autonomia & Limiti** | `/limiti` nell'app · `docs/evidence/meaning-checks.md` · `docs/evidence/a11y-report.md` |

Più la slide che questo hackathon chiede esplicitamente, visto il nome:

| Slide | Dove sono i dati |
|---|---|
| **Come l'abbiamo costruito** | `docs/build-workflow.md` (i ruoli e i gate) · `docs/specs/status.md` (cosa ha fermato cosa) · `docs/decision-log.md` (perché) |

## La slide sul workflow agentico

Non racconta "abbiamo usato l'AI": mostra **i ruoli, i gate, e cosa un gate ha fermato**.

I numeri vengono contati a mano da `docs/specs/status.md` e dal registro delle decisioni — la
tracciatura automatica è stata rimossa (D-17). Quindi: **conta, non stimare.** Se un numero non
lo puoi indicare in un file, non va sulla slide.

Se un gate non ha mai fermato niente, **si dice**: "il gate 3 non ha mai bloccato — o l'abbiamo
fatto bene, o è decorativo". Un team che sa distinguere i due casi è più credibile di un team
con tre spunte verdi.

Da dichiarare sulla stessa slide, non in Q&A:

- **nel prodotto non gira AI** — e perché è una scelta, non un limite (una funzione che conta i
  giorni lavorativi dà sempre la stessa risposta; un modello ne dà una probabile, e su una
  scadenza di legge la differenza è tutta);
- i **mock**, dalla tabella "cosa è simulato" di `docs/ai-contributions.md`;
- dove è servita **revisione umana**, dalla stessa fonte.

## La demo dal vivo

Non c'è una clip registrata: si mostra l'app. Il copione, cronometrato sui criteri, è lo
stesso percorso che `journey-verifier` verifica in B8 — e va provato **due volte** prima di
salire, perché una demo dal vivo non si può rifare.

| Passo | Cosa mostri | Perché |
|---|---|---|
| 1 | lo screenshot annotato del modulo ufficiale (`/prima` tagliata, D-17): la casella 76 annotata | Il problema in cinque secondi, senza parole |
| 2 | `/` in **francese**, e le prime domande di `/percorso` | La lingua di Fatou: mostrarlo in italiano sposta la demo sulla nostra comodità |
| 3 | `/dove`: "Ufficio Postale" | Il viaggio inutile evitato prima di cominciare |
| 4 | `/scadenza`: la data e i giorni contati uno per uno | Il conto è verificabile: non chiediamo fiducia |
| 5 | `/costi`: le quattro voci e i due totali | La fonte ufficiale sbaglia due somme, noi mostriamo le voci |
| 6 | `/modulo/4`: "Dove ricevi la posta?", CAP di un'altra provincia, l'avviso che **non** blocca | È la schermata che vale il progetto |
| 7 | `/riepilogo`: gli errori evitati, e l'anteprima di stampa | Il compito portato a termine |

**Almeno un passaggio da tastiera, visibile.** È l'unico modo di dimostrare l'accessibilità
senza affermarla: si vede il focus che si sposta.

### Piano B, da preparare prima

Una demo dal vivo si rompe: dev server che non parte, porta occupata, browser che aggiorna.
Quindi, in `presentation/outputs/`, **prima di salire**:

- gli screenshot di `docs/evidence/before-after/` già dentro il deck, così i sette passi si
  raccontano anche a schermo nero;
- il PDF del deck, per il caso in cui PowerPoint non collabori.

Se la demo cade, si continua sulle immagini e si dice che è caduta. Fingere che non sia
successo costa più del guasto.

## Vincoli di consegna

- `presentation/outputs/` contiene **solo** file consegnabili, in **kebab-case**, **senza date
  nel nome**.
- Un PDF del deck: se PowerPoint o la rete cadono in sala, il pitch continua. Non c'è clip di
  riserva, quindi gli screenshot nel deck sono l'unico appoggio se l'app non parte.
- Nessun numero nel deck che non risalga a `docs/sources.md`. Dove il dato porta
  `[da verificare]` **nell'app**, lo porta **anche nella slide**: la coerenza fra prodotto e
  pitch è ciò che si nota in Q&A.

## Fatto quando

1. Il deck esiste in `presentation/outputs/`, ha passato il quality gate della skill.
2. Ogni numero del deck è rintracciabile in un file del repo.
3. La slide "come l'abbiamo costruito" ha numeri **contati** da `docs/specs/status.md` e
   `docs/decision-log.md`, non stimati.
4. Gli screenshot di `docs/evidence/before-after/` sono **dentro** il deck: sono il piano B
   della demo dal vivo.
5. Esiste il PDF del deck.
6. Il percorso della demo è stato provato **due volte**.

## Restituisci

```
SPEC: B7
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
