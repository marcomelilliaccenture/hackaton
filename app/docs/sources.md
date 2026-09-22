# Fonti

Ogni affermazione normativa che compare nell'app — un elenco di documenti, un importo, una
scadenza, un codice — deve essere riconducibile a una riga di questa tabella. Se non lo è,
nell'interfaccia compare `[da verificare]` e ci resta fino a quando la fonte non esiste.

Il dossier che ha estratto e trascritto queste fonti è
[`dominio-permesso-di-soggiorno.md`](./dominio-permesso-di-soggiorno.md): lì c'è il testo,
qui c'è la provenienza. Le copie scaricate stanno in `docs/sources/`: servono a citare il
testo esatto anche offline, durante la demo, e a permettere il controllo "semplificare senza
tradire" fatto da `clarity-guard`.

Stato HTTP di tutti gli URL verificato con `curl` il 22/09/2026.

## Fonti ufficiali

| # | Fonte | Cosa ne prendiamo | Copia locale |
|---|---|---|---|
| F1 | [Polizia di Stato — Documenti da inserire nel kit postale per le principali tipologie](https://questure.poliziadistato.it/statics/29/documenti-da-inserire-nel-kit-postale-per-le-principali-tipologie-di-permesso-di-soggiorno.pdf) | Elenco documenti per tipologia; importi (bollo € 16, bollettino € 70,46 / € 80,46 / € 130,46) | `sources/documenti-kit-postale-per-tipologia.pdf` · `.txt` |
| F2 | [Portale Immigrazione — Informativa Generale](https://www.portaleimmigrazione.it/media/documentazione/Informativa_Generale.pdf) | Foglio Note (a)…(y); tabelle allegate 1–5 (province, codici motivo, codici Stato, documenti equipollenti, autorità); termini di rinnovo | `sources/informativa-generale-portale-immigrazione.pdf` |
| F3 | [Portale Immigrazione — La procedura](https://www.portaleimmigrazione.it/ITA/nuovaProcedura.html) | Composizione del kit; Sportello Amico; ricevuta con Codice Assicurata e Ologramma; Modulo 2 solo "qualora si percepisca un reddito"; assistenza gratuita di patronati e Comuni | — |
| F4 | [Polizia di Stato — Il rilascio del permesso di soggiorno](https://www.poliziadistato.it/articolo/225) | Termine di 8 giorni lavorativi; DM MEF/Interno 5 maggio 2017 per il contributo; esenzioni; lavorazione "in media 60 giorni"; valore giuridico della ricevuta; durate massime (circ. 50432/2023) | — |
| F5 | [Poste Italiane — Guida rilascio e rinnovo](https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno) | Dove si ritira il kit, come si spedisce, cosa si riceve, € 30 di spedizione, numero verde 800.200.309 | — |
| F6 | [Portale Immigrazione — Tabella costi](https://www.portaleimmigrazione.it/ITA/tabelleCosti.html) | Importi di produzione (€ 30,46) e contributo (€ 40 / 50 / 100); composizione del bollettino unico; c/c **67422402** | — |
| F7 | [Portale Immigrazione — Tipologie richiedibili via Ufficio Postale](https://www.portaleimmigrazione.it/ITA/tabellauffpostali.html) | Le tipologie che passano dal kit postale, con codice motivo (ultimo aggiornamento 30/05/2024) | — |
| F8 | [Portale Immigrazione — Tipologie solo in Questura](https://www.portaleimmigrazione.it/ITA/tabellaMotiviTipologie.html) | Le 14 tipologie che **non** passano dal kit | — |
| F9 | [MOD. 209 — Modulo 1](https://www.portaleimmigrazione.it/media/documentazione/Modulo_1.pdf) | Numerazione ufficiale dei campi 1–173 e struttura delle 12 sezioni | `docs/sources/mod-209-modulo-1.pdf` + `.txt` (scaricato 2026-09-22) |
| F10 | [MOD. 209 — Modulo 2](https://www.portaleimmigrazione.it/media/documentazione/Modulo_2.pdf) | Campi 1–68 (lavoro, datore, contratto di soggiorno, reddito, Centro per l'Impiego) | da copiare in `docs/sources/` |
| F11 | [MOD. 209 — Istruzioni multilingue IT/EN/FR/ES](https://www.portaleimmigrazione.it/media/documentazione/MOD_209_Multilingue.pdf) | Etichette ufficiali di **tutti** i campi in quattro lingue, indicizzate per numero di campo | `docs/sources/mod-209-istruzioni-multilingue.pdf` + `.txt` (scaricato 2026-09-22) |
| F12 | **art. 5 c. 2 D.lgs 286/1998** (Testo Unico Immigrazione) | Il termine di **8 giorni lavorativi** dall'ingresso per la prima domanda | riferimento normativo, citato da F3 e F4 |
| F13 | **art. 7 D.lgs 286/1998** | Comunicazione di ospitalità entro **48 ore** da parte di chi ospita | riferimento normativo |
| F14 | **art. 4-bis D.lgs 286/1998 · DPR 179/2011** | Accordo di integrazione per i permessi di almeno un anno | riferimento normativo |
| F15 | [Polizia di Stato — Verifica stato pratica](https://questure.poliziadistato.it/stranieri/) | Come si controlla lo stato della pratica dopo la Questura | — |

**La pagina di download della modulistica è rotta** (`Download_italiano.aspx` risponde 200 con
"Errore : 0"; `documentazione.html` carica l'elenco via JavaScript). F9–F11 sono raggiungibili
**solo** con gli URL diretti sopra: vanno copiati in locale, non linkati a caldo in demo.

## Tipologie coperte da F1

`LAVORO SUBORDINATO` · `LAVORO STAGIONALE` · `LAVORO AUTONOMO` · `STUDIO` ·
`UE per soggiornanti di lungo periodo` · `FAMIGLIA con visto (ricongiungimento)` ·
`FAMIGLIA senza visto (coesione)` · `RESIDENZA ELETTIVA`

Nell'app ne esponiamo quattro (lavoro subordinato `16`, studio `31`, famiglia `13`, altro);
le altre restano nei dati ma fuori dal percorso, per non allargare la demo.

## Conflitti fra fonti ufficiali

Non si appianano scegliendo il numero più comodo: si mostra il dato **con la fonte accanto**.
Dettaglio in `dominio-permesso-di-soggiorno.md` §9.

| Conflitto | Fonti in disaccordo | Come lo trattiamo nell'app |
|---|---|---|
| 8 giorni **lavorativi** o 8 giorni? | F4 e F3 dicono "lavorativi", F5 dice "8 giorni dal tuo ingresso" | Calcoliamo sui lavorativi e **mostriamo anche** la data a 8 giorni di calendario come limite prudente |
| Durata massima lavoro subordinato a tempo indeterminato | F4 (circ. 2023): 3 anni · F2 e F3: 2 anni | Mostriamo entrambi con la fonte; nessun numero secco |
| Termine di rinnovo | F3: 60 giorni per tutti · F2: 90 / 60 / 30 per tipologia | Fuori dal percorso demo (primo rilascio). Resta nei dati con entrambe le fonti |
| Costo di produzione | F6 lo scrive "30.36€" in due esempi e sbaglia una somma | Usiamo **30,46 €** e mostriamo sempre le voci che compongono il totale, così il conto è verificabile |
| Codici motivo 34 e 35 | Presenti in F7 (web, 2024), assenti in F2 (cartaceo, ed. 2019) | Fuori dalle quattro tipologie esposte; annotato come segnale che il PDF nel kit è più vecchio del web |

## Ancora da verificare

Finché non hanno una fonte in tabella, nell'app appaiono con `[da verificare]` accanto.

| Dato mancante | Serve a | Ricaduta se resta mancante |
|---|---|---|
| Tabella **CAP → provincia** da fonte aperta citabile | Validatore dell'indirizzo (campi 72, 84) | Il validatore copre solo le province della demo; le altre non producono warning |
| Elenco **festività nazionali** da fonte citabile | Calcolo degli 8 giorni lavorativi | L'elenco è una costante nel codice, dichiarata in `/limiti` |
| Corrispondenza codice → documento della **tabella allegata n. 4** | Campi 41–43 (documento diverso dal passaporto) | Fuori percorso: la demo usa il passaporto |
| URL dell'**area riservata** Portale Immigrazione | Spiegare come si segue la pratica | `/riepilogo` rimanda al numero verde e a F15, non a un URL inventato |
| Checklist della **Questura di destinazione** | Verificare che la checklist tipo coincida | Dichiarato in `/limiti`: F1 è una checklist tipo, le Questure variano (F1 §B cita il Comune di Rovigo) |
| Festività **patronali locali** | Conteggio esatto dei giorni lavorativi | Non gestite, dichiarato in `/limiti` |

## Come si usano queste fonti nei testi

1. **Il contenuto è della fonte, le parole sono nostre.** Copiare il testo ufficiale
   riprodurrebbe la barriera che stiamo togliendo; inventarlo sarebbe peggio.
2. Ogni voce della checklist porta il **nome burocratico** *e* la spiegazione semplice. Il
   nome burocratico è quello di F1 alla lettera: è quello che la persona deve cercare sui
   propri documenti e che l'operatore allo sportello riconosce.
3. Le **etichette dei campi** del MOD. 209 non le traduciamo noi: F11 le ha già in it · en ·
   fr · es, riga per riga, con lo stesso numero di campo. Sono traduzioni del Ministero, la
   tracciabilità è gratis. Le **spiegazioni** invece sono nostre, in tutte e quattro le
   lingue, e partono dalla nostra versione italiana semplificata — mai dal burocratese.
4. Ogni semplificazione non ovvia finisce in `docs/evidence/meaning-checks.md`: testo
   originale, testo nostro, cosa abbiamo tolto, perché il senso non cambia. È il materiale
   del deliverable *Autonomia & Limiti* — e la difesa in Q&A.
