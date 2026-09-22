# Decision log

Una riga per decisione che ha conseguenze: cosa abbiamo deciso, perché, cosa abbiamo
scartato. Serve a non ridiscutere le stesse cose alla terza ora e a rispondere in Q&A senza
improvvisare.

Formato: `D-nn` · data · decisione · motivo · alternativa scartata.

---

## D-01 · 2026-09-22 · Tema 01 — Accessibilità Digitale

I tre deliverable del tema (Persona & Barriera, Percorso Assistito, Autonomia & Limiti)
corrispondono a ciò che la nostra soluzione produce: una persona precisa che non riesce a
completare un servizio digitale reale, e che alla fine ci riesce.

Scartato il Tema 03 (Educazione Digitale Inclusiva): richiede di dimostrare apprendimento
misurabile, mentre noi dimostriamo **completamento di un compito**. Forzare la nostra idea
nel tema sbagliato avrebbe fatto perdere punti su "fit al tema".

## D-02 · 2026-09-22 · La persona è Fatou, lavoro subordinato

Profilo concreto: 29 anni, ingresso con visto per lavoro subordinato, francese + italiano A2,
smartphone, nessuna stampante, posta ricevuta all'indirizzo del datore di lavoro.

Il brief rifiuta esplicitamente i profili generici ("un utente disabile non è un profilo").
Scartati studente e ricongiungimento familiare: cambiano checklist e due campi, si possono
aggiungere dopo senza rifare il percorso.

## D-03 · 2026-09-22 · Nel prodotto non gira AI

Le regole (scadenze, validazioni, documenti) sono funzioni deterministiche testate con
Vitest. Nessun modello a runtime.

Motivi: il brief vieta i chatbot generici e chiede una capability concreta; una funzione che
valida un CAP è dimostrabile e difendibile in Q&A; in 5 ore un percorso deterministico si
chiude, un percorso conversazionale no. L'AI resta lo strumento di costruzione, documentato
in `agents/` e `docs/ai-contributions.md`.

Scartato: assistente conversazionale che spiega i campi via LLM.

## D-04 · 2026-09-22 · Il contenuto viene dalle fonti ufficiali, le parole sono nostre

Elenco documenti e importi dal PDF della Polizia di Stato (F1 in `docs/sources.md`),
scaricato nel repo. Le spiegazioni le scriviamo noi; ogni voce mantiene il nome burocratico
esatto accanto alla versione semplice.

Scartato copiare il testo ufficiale: riprodurrebbe la barriera che stiamo togliendo.
Scartato scriverlo a memoria: sarebbe inventare obblighi altrui.

## D-05 · 2026-09-22 · Quattro lingue scritte a mano: it · en · fr · es

Le traduzioni partono dalla nostra versione italiana semplificata, non dal burocratese —
tradurre il burocratese produce burocratese in un'altra lingua. Il brief vieta la pura
traduzione automatica.

Scartato l'arabo: RTL costa più del valore dimostrabile in 5 ore. Annotato come limite.

## D-06 · 2026-09-22 · Output stampabile via CSS di stampa, non generazione PDF

`window.print()` con un `@media print` pulito. Zero dipendenze, zero rischio di font o
layout che saltano cinque minuti prima della demo.

Scartate le librerie PDF lato client: costo di setup alto, resa incerta.

## D-07 · 2026-09-22 · Il dominio restituisce codici, non frasi

`validators.ts` restituisce `"ADDRESS_PROVINCE_MISMATCH"`; la frase sta in `i18n/`. È ciò
che rende i test indipendenti dalla lingua e le quattro lingue possibili senza duplicare
logica.

## D-08 · 2026-09-22 · CAP incoerente con la provincia è un avviso, non un blocco

Una persona può legittimamente ricevere la posta in un'altra provincia (il datore di lavoro,
un parente). Bloccare significherebbe impedire il caso reale di Fatou.

## D-09 · 2026-09-22 · Chi scrive i test non scrive l'implementazione

`test-author` può creare file solo sotto `app/tests/`. Quando lo stesso agente scrive test e
codice, il test smette di essere una prova e diventa una descrizione del bug.

## D-10 · 2026-09-22 · Un solo file di piano

`docs/app-plan.md` è il piano: slice, criteri, budget e rischi stanno nelle sue sezioni
11–14. `docs/plan.md` non esiste e non va creato.

Motivo: `builder` e `slice-planner` puntavano a `docs/plan.md` e `docs/persona.md`, nessuno
dei due esistente, mentre il piano vero era in `app-plan.md`. Due file di piano significano
due verità e, alla terza ora, la domanda "quale leggo?".

Creato `docs/persona.md`, che serviva davvero: è il primo deliverable del tema.

## D-11 · 2026-09-22 · La numerazione del MOD. 209 è la chiave del modello dati

Ogni casella del modulo ha un numero ufficiale e stabile da 1 a 173, identico nel modulo e
nelle istruzioni multilingue. `Issue.field` è quel numero, non un nome di campo nostro.

Motivo: è l'unica chiave che esiste già in tutte e quattro le lingue (F11), che l'operatore
allo sportello riconosce, e che permette a Fatou di trascrivere sul cartaceo. Un nostro
`communicationAddress` avrebbe richiesto una mappatura in più e non avrebbe aiutato nessuno.

## D-12 · 2026-09-22 · Bollettino e instradamento entrano nello slice

`/costi` (R-15…R-21) e `/dove` (R-03…R-06) sono nel percorso della demo.

Motivo: sono due degli attriti documentati più costosi — versamento sbagliato e viaggio
inutile all'ufficio postale — e sono aritmetica e tabelle, cioè quasi zero rischio tecnico.
`/costi` ha anche un valore difensivo: la tabella ufficiale contiene due errori aritmetici,
e mostrare le voci accanto al totale dimostra il principio "nessun numero senza le sue voci".

Scartati: lookup dei ~200 codici Stato e dei 33 codici motivo da testo libero (data-entry
lungo, valore dimostrativo basso) e il conteggio automatico dei fogli come validazione — resta
una proposta che la persona conferma.

## D-13 · 2026-09-22 · Le etichette ufficiali vengono da F11, le spiegazioni sono nostre

`MOD_209_Multilingue.pdf` contiene le etichette di tutti i campi in it · en · fr · es, riga
per riga, con lo stesso numero di casella. Le riusiamo (`campo.76.official`); le spiegazioni
(`campo.76.plain`) le scriviamo noi in tutte e quattro le lingue.

Motivo: sono traduzioni del Ministero, la tracciabilità è gratis, e ritradurle sarebbe lavoro
sprecato con il rischio di allontanarsi dal termine che l'operatore riconosce. Ma tradurre il
burocratese produce burocratese in un'altra lingua: le spiegazioni partono dalla nostra
versione italiana semplificata.

## D-14 · 2026-09-22 · L'evidenza del flusso la produce un hook, non la memoria

`log_agent.py` registra ogni invocazione di subagente in `docs/evidence/agent-runs.jsonl`;
`flow_report.py` ne genera `flow.md` e i numeri della slide.

Motivo: l'hackathon si chiama Agentic Coding, quindi il flusso è materiale valutabile. Un
diagramma disegnato la notte prima descrive il flusso che avremmo voluto seguire. Se il
registro è vuoto lo script non scrive niente e lo dice: preferiamo nessun diagramma a un
diagramma inventato.

## D-15 · 2026-09-22 · Gli agenti leggono spec chiusi, non il piano

Ogni blocco di lavoro ha uno spec in `docs/specs/`: ~2–3 KB, con i criteri, i requisiti di
legge con la fonte, le firme e i file scrivibili. Nessun agente apre `app-plan.md` (~24 KB) né
`dominio-permesso-di-soggiorno.md` (~45 KB).

Motivo: dodici invocazioni × il piano intero è lavoro pagato dodici volte per usarne una
frazione; e un agente che ha letto tutto il piano trova sempre qualcosa in più da fare, e
allarga lo scope senza accorgersene. Lo spec è anche il posto dove un difetto si corregge e
**resta scritto**, invece di essere rattoppato in un prompt e perso.

Conseguenza accettata: gli spec duplicano testo dal piano, e possono divergere. Mitigazione:
`slice-planner` elenca gli spec che non corrispondono più dopo ogni cambio di criterio.

## D-16 · 2026-09-22 · I tipi condivisi nascono in `domain/types.ts`, gli altri moduli li ri-esportano

Il contratto di dominio (§8 del piano) nominava `Answers`, `Address`, `PassportData` e `Step`
senza definirli: B0 ha dovuto inventarsi uno stub di `Answers` dentro le fixture per
compilare, e B2A, B3A e B4A stavano per dichiararne ciascuno una versione propria. I tipi
condivisi ora stanno in un solo file, `app/src/domain/types.ts`, scritto verbatim nello spec
`B0B-domain-types.md`.

Scartato: lasciare che ogni modulo dichiari i tipi che gli servono, come suggeriva la lettura
letterale di §8. Tre definizioni di `Answers` scritte da tre agenti in parallelo non
coincidono, e la divergenza si scopre a integrazione fatta, nell'ora in cui non si ripara.

Conseguenza accettata: la superficie pubblica promessa dagli spec (`Istanza` da `fees.ts`,
`MotivoCode` da `data/motivi.ts`, `Issue` da `validators.ts`, `Channel` da `routing.ts`)
viene mantenuta con un `export type { … } from "./types"`. Una riga in più per modulo, in
cambio di una sola definizione per tipo.

## D-16 · 2026-09-22 · La verifica in un browser sta in `e2e/`, separata dal gate 1

Playwright vive in `e2e/`, con un `package.json` proprio, guidato dall'agente
`journey-verifier`. Spec: `docs/specs/B8-journey-playwright.md`.

Motivo: `npm test` dentro `app/` e' il gate 1 e scatta dopo ogni modifica `.ts` (hook
`run_tests.py`). Con Playwright fra quelle dipendenze, ogni edit avvierebbe un browser e il
gate passerebbe da due secondi a trenta — cioe' verrebbe aggirato entro mezz'ora. E al momento
della decisione `app/package.json` era in mano alla sessione che eseguiva B0.

Cosa chiude: A-17 (percorso da tastiera, in francese, console pulita) e A-12 (stampa), che
`a11y-auditor` non puo' chiudere perche' non ha un browser — scrive "DA VERIFICARE A MANO", ed
e' corretto. Piu' contrasto misurato, target 44px, testo 16px e gli screenshot prima/dopo.

Scartato: Playwright come devDependency di `app/`, e i test di regressione sull'interfaccia.
Il piano (§5) ha deciso di non averne: qui si verificano i **criteri**, non i componenti.

## D-17 · 2026-09-22 · Niente tracciatura automatica: il flusso si scrive a mano

Rimossi gli hook `log_tool.py` e `log_agent.py` e lo script `flow_report.py`, con i loro
output (`docs/workflow-log.md`, `agent-runs.jsonl`, `flow.md`, `flow-deck.md`). Restano due
hook, `protect_brief.py` e `run_tests.py`, che non tracciano niente.

Motivo immediato: non funzionavano. Dopo un'ora di lavoro e decine di scritture, il registro
conteneva una riga.

Motivo tecnico, che vale la pena ricordare: un hook non deve mai far fallire un turno, quindi
ingoia le proprie eccezioni. Il prezzo di quella regola e' un hook che **non fa niente in
silenzio**. Un hook che tiene un registro va scritto in modo che il suo fallimento sia
visibile, altrimenti produce l'illusione di una traccia — che e' peggio di nessuna traccia,
perche' ci si conta sopra.

Cosa perdiamo, e va detto in Q&A se lo chiedono: il flusso ora si ricostruisce da
`docs/specs/status.md`, `docs/decision-log.md` e `docs/ai-contributions.md`. Sono scritti
mentre si lavora, ma da una persona: meno completi e piu' intenzionali di un log. La difesa
non e' "abbiamo tutto", e' "abbiamo scritto le decisioni mentre le prendevamo, ed ecco il
file".

Conseguenza operativa: la tabella "Gate che hanno fermato qualcosa" in `status.md` va
compilata **quando accade**. Riempita alla fine, si riempie di memoria.

## D-18 · 2026-09-22 · Nessuna clip registrata: la demo e' dal vivo

Si consegnano il deck e una demo dal vivo. La clip da 45 secondi non si fa.

Conseguenza: **non c'e' rete di sicurezza.** Quindi due cose diventano obbligatorie invece che
consigliate — il blocco B8 (`cd e2e && npm test`) prima di salire, perche' e' l'unico modo di
sapere che il percorso tiene; e gli screenshot di `docs/evidence/before-after/` **dentro** il
deck, cosi' i sette passi si raccontano anche se l'app non parte.

Il percorso della demo va provato due volte. Una demo dal vivo non si rifa'.

## D-19 · 2026-09-22 · La presentazione si costruisce in sessione, non come spec

Lo spec `B7-deck` è **ritirato**. Narrativa e deck non passano più dall'orchestratore: la
narrativa vive in [`presentation/storytelling.md`](../presentation/storytelling.md), approvata
a voce dal team, e il build del `.pptx` segue la skill `hackathon-pitch` nella stessa sessione.

Motivo: uno spec serve quando un subagente deve eseguire senza contesto. Il deck non ha questo
problema — ha il problema opposto, cioè richiede tutto il contesto e un'approvazione umana su
ogni frase. Passarlo per la pipeline aggiungeva un livello di indirezione e nessun controllo.

Conseguenze registrate nello storytelling: 6 slide parlate in 4 minuti, **si chiude sulla
demo** e non su un ask (è un hackathon, non una raccolta fondi), **nessuna slide di impatto**
perché non esiste una baseline misurata, e il "prima" del deliverable 2 sta su una slide come
screenshot del MOD. 209 — così non dipende dal fatto che il dev server sia in piedi.

## D-17 · 2026-09-22 · `/prima` tagliata, `/limiti` resta

Il blocco 5 prevedeva due pagine: `/prima`, che mostrava il modulo com'è oggi con i tre punti
d'errore evidenziati, e `/limiti`. `/prima` è tagliata. `/limiti` resta.

Motivo: il "prima" serve solo come termine di paragone e lo stesso confronto si ottiene con
uno screenshot annotato del modulo ufficiale in `docs/evidence/before-after/` — che è già un
deliverable di B6, quindi il lavoro si fa una volta invece di due. `/limiti` no: è l'unico
posto in cui il **terzo deliverable del tema** ("Autonomia & Limiti", brief §Deliverable 3)
esiste dentro il prodotto invece che solo in una slide.

Scartato: tagliare entrambe e lasciare i limiti al solo deck. La giuria valuta tre
deliverable; due su tre dimostrati nel prodotto e uno solo raccontato è un deliverable in
meno, per dieci minuti risparmiati.

Conseguenza accettata: A-15 decade. B6, B7 e B8 prendono il "prima" da uno screenshot
annotato del PDF ufficiale (F9, ora in `docs/sources/`), non da una rotta dell'app.

## D-18 · 2026-09-22 · La misura di riga vincola la colonna, non la finestra

`ux-spec.md` §2 fissa la misura di riga a 62 caratteri (`max-w-[34rem]`) perché una riga da 90
è difficile da seguire per chi legge a livello A2. Quel limite era però applicato al
contenitore di pagina in `layout.tsx`, `SiteHeader` e `SiteFooter`: su un monitor desktop il
risultato era un'app mobile centrata in una finestra vuota.

Da qui: il vincolo dei 62 caratteri resta, ma sulla **colonna di testo**. Sopra 1024px la
pagina usa due colonne — lettura a misura piena, e una laterale con avanzamento del percorso,
scadenza e fonti, che prima competevano con il contenuto nella stessa colonna.

Scartato: allargare la colonna di testo a tutta la finestra. Avrebbe reso l'app "da desktop"
buttando via la ragione per cui il limite esiste, e la demo si fa davanti a una giuria che
legge le schermate.

Conseguenza accettata: due layout da verificare invece di uno. Il criterio di zoom 200% si
misura sulla colonna stretta, dove è più severo.

## D-18bis · 2026-09-22 · Numerazione D-18 duplicata: colonna allargata (40rem), non a due colonne

**Nota**: questa voce e quella sopra sono entrambe numerate D-18, scritte in parallelo da due
sessioni sullo stesso `ux-spec.md` — nessuna delle due sapeva dell'altra. Non ho unificato la
numerazione per non toccare una voce che non è mia: chi riordina il log, rinumeri.

Scelta applicata qui (opposta a quella sopra): la colonna unica è stata allargata da
`max-w-[34rem]` a `max-w-[40rem]` in `layout.tsx`, `SiteHeader`, `SiteFooter` — niente
seconda colonna. Motivo: richiesta esplicita a voce di semplicità per la demo, colonna sola
ma meno vuoto ai lati; l'alternativa a due colonne (voce sopra) non era ancora implementata
in codice quando è stata scelta questa.

Conseguenza: **le due decisioni sono in conflitto e vanno riconciliate dal team prima della
demo** — vedi l'avviso in `docs/ux-spec.md` §2 (Tipografia, "Misura di riga"). Finché non si
riconcilia, il codice riflette questa voce (colonna a 40rem), non quella a due colonne.

## D-20 · 2026-09-22 · Gli hook stanno in `.claude/hooks/`, `agents/` resta solo il racconto

`agents/harness/` è sparita: i due hook (`protect_brief.py`, `run_tests.py`) sono in
`.claude/hooks/` e `.claude/settings.json` li invoca da lì. In `agents/` resta il solo
`README.md`, che è il deliverable narrativo sull'harness.

Motivo: l'harness eseguibile è configurazione di Claude Code e vive dove Claude Code la
cerca; tenerne una copia in un albero parallelo raddoppiava i path da aggiornare (la
cartella `agents/harness/` conteneva ormai solo `hooks/`, dopo la rimozione dei due hook di
tracciatura in D-17). Scartato: lasciare tutto com'era, e spostare anche `README.md` dentro
`.claude/` — è un documento per la giuria, non configurazione.

Verifica: entrambi gli hook ri-testati passando il payload su stdin dopo lo spostamento
(`ROOT` era `parents[3]`, ora `parents[2]`).
