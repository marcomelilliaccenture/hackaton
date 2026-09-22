# Evidenze

Gli artifact valutabili. Ognuno ha un produttore e un momento in cui nasce.

| File | Chi lo produce | Cosa dimostra | Per quale deliverable |
|---|---|---|---|
| `meaning-checks.md` | `clarity-guard` | Che la semplificazione non ha tradito la fonte: originale accanto al nostro testo | *Autonomia & Limiti* |
| `a11y-report.md` | `a11y-auditor` | Che l'accessibilità è stata **misurata** dove si può misurare leggendo il codice | *Autonomia & Limiti* |
| `before-after/` | `journey-verifier` · `cd e2e && npm run evidence` | Le due versioni dello stesso campo, stesso crop e stessa lingua | *Percorso Assistito* |
| esiti di `cd e2e && npm test` | `journey-verifier` | Che il percorso si chiude da tastiera, in francese, senza errori in console (A-17) | *Percorso Assistito* |

Fuori da qui, tre file completano la catena:

- `docs/specs/status.md` — cosa è stato fatto, e **la tabella dei gate che hanno fermato
  qualcosa**. Dopo D-17 è l'unica traccia del flusso: se non è scritta lì, non è accaduta.
- `docs/decision-log.md` — perché, non solo cosa.
- `docs/ai-contributions.md` — dove ha lavorato l'AI, dove è servita revisione umana, cosa è
  simulato. È una richiesta esplicita del brief.

## Niente tracciatura automatica

C'erano due hook che registravano ogni scrittura e ogni invocazione di agente, più uno script
che ne generava un diagramma. Sono stati rimossi (D-17): tenere in piedi una registrazione che
non scrive è peggio che non averla.

Conseguenza da conoscere: **il flusso di lavoro ora si racconta a mano**, dai tre file sopra.
Chi prepara la slide "come l'abbiamo costruito" conta le righe di `status.md` e del registro
delle decisioni — e non stima. Un numero che non sta in un file non va sulla slide.

## Nessun dato reale

Vale anche qui, e soprattutto negli screenshot: nomi, numeri di documento e indirizzi sono
inventati e palesemente tali.
