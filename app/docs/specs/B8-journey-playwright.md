# B8 — Verifica end-to-end con Playwright

> Blocco 8 · comune · 0:30 · agente: `journey-verifier`
> Dipende da B4B (il percorso deve esistere). Si rilancia **prima di ogni demo**.
> **Spec chiuso.** Non aprire `app-plan.md` né il dossier di dominio.

## Obiettivo

Sapere — non sperare — che il percorso `/` → `/riepilogo` si chiude da tastiera, in francese,
senza errori in console. E produrre gli screenshot prima/dopo per il deck.

La demo è **dal vivo, senza clip registrata**: non c'è una rete di sicurezza. Questo blocco è
l'unico modo di scoprire prima, e non davanti alla giuria, che il percorso si interrompe al
terzo passo.

## Criteri da soddisfare

- [ ] **A-12** `/riepilogo` stampa (`@media print`) senza navigazione né bottoni, con i numeri
      di casella del MOD. 209, la proposta per la casella 25 e l'avviso sulla firma (casella 29).
- [ ] **A-17** Il percorso `/` → `/riepilogo` si completa **da tastiera**, **in francese**,
      **senza errori in console**.

Più i criteri di accessibilità di `docs/ux-spec.md` §10 che richiedono un browser: contrasto
misurato, target ≥ 44px, testo ≥ 16px, zoom, focus reale.

## Perché serve un browser

`a11y-auditor` legge il codice e scrive **DA VERIFICARE A MANO** su tutto ciò che richiede un
rendering. Non è un suo limite: è la verità, non ha un browser. Quelle righe sono questo
blocco. Senza, A-17 resta una promessa.

## Cosa NON è

Non è una suite di regressione sull'interfaccia. Il piano ha deciso di non avere test di UI:
non è ciò che viene valutato e non c'è tempo. Questo blocco produce **evidenza sui criteri**.
Se ti trovi a scrivere il quindicesimo test su un componente, hai cambiato mestiere — fermati
e dillo.

Non è nemmeno un checker di conformità che sputa un report tecnico: il brief mette quelli fra
le cose da evitare. `axe` gira qui come strumento interno, non come prodotto.

## Cos'è già scritto in `e2e/`

| File | Contiene | Stato |
|---|---|---|
| `package.json` | script e due dipendenze (`@playwright/test`, `@axe-core/playwright`) | pronto |
| `playwright.config.ts` | Chromium, profilo mobile + desktop, `locale: "fr-FR"`, avvio automatico del dev server in `../app` | pronto |
| `tests/rotte.ts` | l'elenco delle rotte e i nomi dei bottoni di lingua | pronto |
| `tests/a11y.spec.ts` | axe, target, dimensione del testo, zoom, skip-link, console, cambio lingua | pronto, indipendente dai testi |
| `tests/stampa.spec.ts` | A-12: stampa senza navigazione, numeri di casella, A4 senza tagli | pronto |
| `tests/percorso.spec.ts` | A-17: etichette vere, focus che non si perde, primo Tab | **il cammino completo è `test.fixme`: va riempito** |
| `tests/evidenza.spec.ts` | gli screenshot per `docs/evidence/before-after/` | pronto, i `data-testid` di lo screenshot annotato del modulo ufficiale (`/prima` tagliata, D-17) vanno confermati |

## Cosa devi fare

1. **Installare**, una volta sola:

   ```bash
   cd e2e && npm run setup
   ```

   Scarica Chromium (~150 MB). Se la rete è lenta, fallo all'inizio della sessione, non alle
   16:30.

2. **Riempire il `test.fixme`** in `tests/percorso.spec.ts`: il cammino completo. Il percorso è
   già scritto nel commento del test. Prendi i nomi accessibili dalle **chiavi reali** in
   `app/src/i18n/fr.json`: non inventarli. Un test su un'etichetta immaginata passa per il
   motivo sbagliato.

3. **Solo tastiera** in quel test: `keyboard.press`, mai `click`. Se un elemento si raggiunge
   solo col mouse, A-17 è rosso e il test deve dirlo — è precisamente l'informazione che serve.

4. **Confermare i `data-testid`** di lo screenshot annotato del modulo ufficiale (`/prima` tagliata, D-17) (`annotazione-recapito`, `annotazione-nome`) con
   chi ha costruito quella pagina in B5. Se non ci sono, i test ripiegano su `main` e lo
   screenshot è l'intera pagina: funziona, ma inquadra peggio.

5. **Lanciare tutto e riportare.**

   ```bash
   cd e2e && npm test
   cd e2e && npm run evidence
   ```

## File

**Puoi scrivere in:** `e2e/**`, `docs/evidence/before-after/`.
**Non toccare:** `app/**` (nemmeno `package.json`), `docs/` a parte `before-after/`.

Un test rosso è un **rapporto**, non un invito a riparare: rotta, criterio, cosa hai premuto,
atteso, ottenuto. La correzione la fa `builder`.

## Fatto quando

1. `cd e2e && npm test` gira e riporta, verde o rosso, senza errori di configurazione.
2. Il test del percorso completo **non è più `fixme`** e passa da tastiera, in francese.
3. `docs/evidence/before-after/` contiene le sei immagini.
4. Ogni rosso ha la sua riga nel report, e il più grave è il primo.

## Restituisci

```
SPEC: B8
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
