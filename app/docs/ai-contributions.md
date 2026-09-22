# Dove ha lavorato l'AI, dove è servita revisione umana

Il brief chiede di indicarlo, e mette "uso dell'AI non spiegabile dal team" fra le cose da
evitare. Questo file è la risposta: si aggiorna mentre si lavora, non alla fine.

Regola: **l'AI ha costruito lo strumento, non gira dentro lo strumento.** Nel software non
c'è nessuna chiamata a un modello (vedi `docs/decision-log.md` D-03).

---

## Per attività

| Attività | AI | Revisione umana necessaria |
|---|---|---|
| Analisi del brief e scelta del tema | Ha mappato idea → Tema 01 e i tre deliverable | Confermata dal team (D-01) |
| Persona e barriera (`docs/persona.md`) | Ha proposto tre profili concreti e mappato gli otto attriti sulle note ufficiali del modulo | Scelta e dettagli validati dal team (D-02) |
| Dossier di dominio (`docs/dominio-permesso-di-soggiorno.md`) | Ricerca, download e trascrizione delle fonti; estrazione dei 34 requisiti; individuazione dei cinque conflitti fra fonti | **Sì**: ogni valore normativo va riletto sulla fonte in `docs/sources/` |
| Piano dell'app (`docs/app-plan.md`) | Scritto interamente, con la tracciabilità requisito → funzione → schermata | Da rileggere a ogni cambio di scope |
| Specifica UI/UX (`docs/ux-spec.md`) | Scritta interamente | Giudizio estetico e di leggibilità: non delegabile |
| Spec di costruzione (`docs/specs/`) | Derivati dal piano, uno per blocco | Il team verifica che siano **chiusi**: uno spec che rimanda altrove fa allargare lo scope |
| Workflow e harness | Subagent e hook scritti dall'AI | Ogni hook verificato passandogli il payload su stdin prima di attivarlo |
| Logica di dominio | Implementazione da parte di `builder` | I valori normativi (importi, termini, codici) li controlla una persona sulla fonte |
| Unit test | Scritti da `test-author`, che non tocca l'implementazione (D-09) | Il team legge i nomi dei test: sono la specifica |
| Testi e spiegazioni (it · en · fr · es) | Prima stesura | **Sì, sempre**: `clarity-guard` confronta con la fonte, una persona decide |
| Etichette ufficiali dei campi | **Nessun contributo AI**: sono le traduzioni del Ministero (F11), riusate (D-13) | Verifica che il numero di casella corrisponda |
| Accessibilità | `a11y-auditor` misura e riporta | **Sì**: ciò che richiede un browser (zoom, focus reale, console) lo verifica una persona |
| UI | Implementazione con la skill `frontend-design` | Giudizio estetico e di leggibilità |
| Verifica end-to-end | `journey-verifier` guida l'app con Playwright: tastiera, stampa, contrasto, screenshot | **Sì**: il giudizio su "la demo tiene" è del team, e la demo è dal vivo |
| Deck | Skill `hackathon-pitch` | Il team approva narrativa e numeri prima del build; i numeri si **contano** dai file, non si stimano |

Sei punti **non delegati**, con il motivo scritto, in `docs/build-workflow.md` §7: i valori
normativi, il verdetto su una DERIVA, il giudizio di leggibilità, cosa tagliare, e cosa si
dichiara in `/limiti`.

## Cosa è simulato nel prototipo

Aggiornare qui ogni volta che si introduce un mock. Va anche su una slide: dichiararlo
prima che lo scoprano in Q&A costa tre secondi, scoprirlo in Q&A costa il punteggio di
fattibilità.

| Cosa | Com'è nella demo | Cosa servirebbe davvero |
|---|---|---|
| Durata del soggiorno (`stayLongerThan3Months`) su `/dove` (B2B) | Non è una delle cinque domande dello spec: `toDomainAnswers()` la fissa a `true`, cioè il caso del permesso. L'esito «Dichiarazione di presenza» di `channelFor` esiste ma non è raggiungibile dal percorso | Una sesta domanda sul soggiorno fino a tre mesi, oppure un criterio che dichiari fuori scope quell'esito |
| Link di servizio nel footer (Privacy, Cookie, Note legali, Accessibilità, Contatti) | `<a href="#">` con `aria-disabled="true"` e click annullato: non navigano e non danno 404. Una riga sotto i link lo dichiara all'utente in it · en · fr. L'unico link vero del footer è `/limiti` | Le cinque pagine reali, che un servizio pubblico deve avere |

## Dati non verificati

Il marcatore `[da verificare]` non compare più a schermo: era una sigla che all'utente non
dice niente. Al suo posto, due regole. Dove il dato ha una fonte, la fonte è citata; dove non
ce l'ha, il numero resta ma senza riga «Fonte:», il commento in testa al file dice da dove
viene, e il limite è dichiarato per intero su `/limiti` («Due dati che non abbiamo potuto
verificare su una fonte ufficiale», it · en · fr).

- la tabella **CAP → provincia** (`app/src/data/province.ts`): nessuna fonte aperta citabile,
  gli intervalli sono il prefisso provinciale esteso al blocco di mille CAP. Il validatore
  copre solo le cinque province della demo. Dichiarato in `/limiti`;
- il **numero di fogli** di cui si compongono Modulo 1, Modulo 2 e la fotocopia di un
  documento (casella 25, `app/src/domain/progress.ts`): contati a mano da noi. Restano una
  proposta che la persona conferma — finché non conferma, `validateAll` emette
  `SHEET_COUNT_UNCONFIRMED` (info). Dichiarato in `/limiti`;
- l'elenco delle **festività nazionali** usato nel conteggio dei giorni lavorativi (è una
  costante nel codice; le patronali locali non sono gestite, dichiarato in `/limiti`);
- il **testo delle note del modulo**: risolto. La nota (b) della casella 78 è ora citata alla
  lettera dal Foglio Note (F2, testo estratto in `docs/sources/informativa-generale.txt`). Le
  caselle 48, 68 e 79-84 **non hanno nessuna nota** sul MOD. 209 (verificato su F11,
  `docs/sources/mod-209-istruzioni-multilingue.txt`): per loro la riga della nota non esiste,
  che è la risposta giusta, non un dato mancante;
- la corrispondenza codice → documento della **tabella allegata n. 4** (colonna disallineata
  nel PDF ufficiale);
- l'**URL dell'area riservata** del Portale Immigrazione per lo stato pratica.

Tre dati che erano `[da verificare]` **ora hanno una fonte**, trovata con il dossier di
dominio: gli **8 giorni lavorativi** (F12 = art. 5 c. 2 D.lgs 286/1998, confermato da F3 e
F4), i termini di **rinnovo** (F2, che li distingue in 90/60/30 — e contraddice F3: mostriamo
entrambe con la fonte) e il **valore della ricevuta** postale come titolo di soggiorno
(F4). Il marcatore è stato rimosso solo dopo aver letto la fonte, non per comodità.

## Tracciabilità

Tre file, tenuti a mano. La registrazione automatica (due hook + un generatore di diagrammi) è
stata rimossa: vedi D-17 nel registro delle decisioni.

- [`docs/specs/status.md`](./specs/status.md) — cosa è stato fatto, da quale agente, e la
  tabella dei **gate che hanno fermato qualcosa**.
- [`docs/decision-log.md`](./decision-log.md) — una riga per decisione con conseguenze.
- questo file — chi ha scritto cosa, e chi l'ha controllato.

Conseguenza da dichiarare in Q&A se chiedono: il flusso lo ricostruiamo da questi tre
registri, non da un log generato. Sono scritti mentre si lavora, ma da una persona — quindi
sono meno completi e più intenzionali di un log.

Restano due hook, che non tracciano niente:

| Hook | Cosa fa |
|---|---|
| `protect_brief.py` | Nega le scritture su `docs/challenge-brief.md` |
| `run_tests.py` | Lancia `npm test` dopo una modifica `.ts` sotto `app/` o `agents/` — è il gate 1 |
