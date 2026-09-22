# Persona & Barriera

Primo dei tre deliverable del Tema 01. Il brief mette "profili utente generici" fra le cose
da evitare: *"un utente disabile non è un profilo"*. Questo file è il profilo.

Lo leggono `builder` e `slice-planner` prima di decidere qualunque cosa. La regola che ne
deriva: **ogni schermata deve poter essere spiegata dicendo "questo serve a Fatou perché…"**.
Se non si riesce, la schermata è fuori scope.

---

## Chi è

> **Fatou, 29 anni.** Senegalese. È entrata in Italia il **venerdì 18 settembre 2026** con un
> visto per **lavoro subordinato**: un'azienda di logistica in provincia di Modena ha ottenuto
> il nulla osta per lei, e il contratto di soggiorno l'ha firmato allo Sportello Unico due
> giorni dopo l'arrivo.
>
> Parla **francese** (lingua di scolarizzazione) e un **italiano A2**: capisce una frase
> semplice detta piano, non capisce un modulo. Legge e scrive senza difficoltà — la barriera è
> linguistica e procedurale, non alfabetica.
>
> Ha uno **smartphone Android** con dati limitati, **nessun computer**, **nessuna stampante**.
> Dorme dalla cugina a Modena, ma non ha un indirizzo stabile: la posta le arriva
> all'indirizzo del **datore di lavoro**.
>
> Nessuno in famiglia ha già fatto questa procedura in Italia. Non sa che esistono i patronati.

Dati inventati e palesemente tali: nessun nome, numero di documento o indirizzo reale entra
nel repo, negli screenshot o nella clip.

## Cosa sta cercando di fare

Presentare la **prima domanda di permesso di soggiorno** compilando il **kit postale
MOD. 209** — la busta a banda gialla ritirata all'ufficio postale — e spedirla da uno
Sportello Amico entro il termine di legge.

Il compito è finito quando ha: i moduli compilati senza errori, le fotocopie giuste nella
busta, il bollettino dell'importo corretto, e la consapevolezza della data entro cui spedire.

## Dove si blocca oggi, esattamente

Ha la busta in mano, aperta sul tavolo della cucina. Il Modulo 1 ha **173 caselle numerate**;
le istruzioni sono su un **foglio separato** che rimanda a lettere `(a)…(y)` e a cinque
tabelle allegate. Il momento del blocco non è "non capisce l'italiano": è che **ogni casella
le chiede una decisione che il modulo non spiega**.

| # | Il blocco | Da cosa nasce | Cosa le costa |
|---|---|---|---|
| 1 | **Non sa di avere 8 giorni lavorativi.** Il termine non è scritto sul kit | art. 5 c. 2 D.lgs 286/1998 (F12); F5 lo riporta come "8 giorni", senza "lavorativi" | Domanda tardiva. È il rischio più grave e il più invisibile |
| 2 | **Casella 76–84, "Recapito per eventuali comunicazioni".** Scrive l'indirizzo della cugina, dove dorme | Nota (q) dice solo "se uguale al precedente non compilare"; è la nota (r), altrove, a dire che lì arriva **la raccomandata di convocazione in Questura** | La convocazione non la raggiunge. La pratica si ferma **senza che lei sappia perché** |
| 3 | **Caselle 3 e 4, cognome e nome.** Sul suo passaporto l'ordine è invertito rispetto al modulo | Nota (a): "come scritto sul passaporto" — che nessuno spiega significhi *anche nell'ordine e nella grafia del passaporto* | Mismatch con la MRZ → richiesta di integrazione |
| 4 | **Casella 16, codice tipologia.** Deve scrivere `16` | Il codice va cercato nella tabella allegata n. 2, su un foglio diverso, fra ~30 voci quasi omonime | Istanza per la tipologia sbagliata |
| 5 | **Quali fotocopie allegare.** Per la sua tipologia ne servono nove | La checklist è un PDF separato (F1), organizzato per tipologia, con prassi che variano per Questura | Integrazione richiesta mesi dopo |
| 6 | **Quanto paga e su quale bollettino.** Quattro voci su tre canali diversi | Bollo dal tabaccaio, bollettino c/c 67422402 al MEF, € 30 alla cassa di Poste. E la tabella ufficiale (F6) contiene due errori aritmetici | Versamento errato → pratica sospesa |
| 7 | **Casella 25, numero totale di fogli.** Va compilata per ultima, dopo aver fotocopiato tutto | Nota (g) + nota (f), che stanno sul foglio note e non accanto alla casella | Conteggio sbagliato |
| 8 | **Casella 29, la firma.** Se manca, *"l'istanza non verrà accettata allo sportello postale"* | Nota (f) | Respinta allo sportello, con il viaggio da rifare |

Il **momento esatto** che la demo mostra: Fatou è alla casella 76. Ha già scritto
l'indirizzo della cugina alla casella 68 (recapito in Italia, ed è corretto). La casella 76
le sembra la stessa domanda fatta due volte, quindi la salta — oppure ripete l'indirizzo
della cugina. In entrambi i casi la lettera che le dice quando andare in Questura andrà dove
lei non la ritira.

## Perché è lei, e perché questo compito

- **La barriera è documentata, non ipotizzata.** Le otto righe sopra non sono intuizioni: ogni
  riga risale a una nota ufficiale del MOD. 209 o a un articolo del Testo Unico
  (`dominio-permesso-di-soggiorno.md` §11).
- **Il servizio digitale è reale.** Il kit postale, il Portale Immigrazione e i suoi PDF
  esistono e sono consultabili; uno dei suoi link di download è rotto anche per un
  madrelingua.
- **Il compito ha una fine osservabile.** Non "capisce meglio la burocrazia": ha in mano i
  moduli pronti da stampare, la lista degli allegati e una data. Il brief chiede *"il task
  portato a termine"*, non un miglioramento di comprensione.
- **La difficoltà non è una disabilità sensoriale, ed è dentro il tema.** Il Tema 01 dice
  "una disabilità, una fragilità **o una difficoltà** a usare un servizio digitale". La sua è
  linguistica e procedurale; l'accessibilità tecnica (tastiera, contrasto, screen reader) resta
  requisito di ogni schermata, perché è ciò che rende lo strumento usabile **da lei**, su uno
  smartphone, in piedi, all'ufficio postale.

## Alternative scartate

| Profilo | Perché no |
|---|---|
| **Studente** (codice 31, art. 39-bis) | Cambia checklist e due campi; si aggiunge dopo senza rifare il percorso. La sua storia non ha il campo 76 come punto di svolta |
| **Ricongiungimento familiare** (codici 13–14) | Il modulo 209 per il primo rilascio lo compila lo Sportello Unico (F1): la barriera che studiamo è già mediata da un ufficio |
| Persona con disabilità visiva su un portale pubblico | Forte sul tema, ma l'audit di accessibilità di un sito altrui è esattamente ciò che il brief mette fra le cose da evitare ("checker di conformità che producono report tecnici") |

Decisione registrata in [`decision-log.md`](./decision-log.md) D-02.

## Cosa NON assumiamo di lei

Perché ogni assunzione in più è una schermata che non serve:

- **Non** assumiamo che sia sola: se ha vicino la cugina o un collega italiano, lo strumento
  resta utile (e `/limiti` le dice che il patronato fa la stessa cosa gratis, di persona).
- **Non** assumiamo che abbia i documenti già in mano. Contratto di soggiorno, codice fiscale,
  dichiarazione di ospitalità possono mancare: la checklist dice *dove si trova* ogni cosa,
  non dà per scontato che ci sia.
- **Non** assumiamo che sappia cos'è una Questura, uno Sportello Unico o un patronato. Ogni
  ente citato ha una riga di glossario (`dominio-permesso-di-soggiorno.md` §13).
- **Non** assumiamo che si fidi. Ogni numero mostrato porta la fonte: è per questo che gli 8
  giorni compaiono con l'elenco dei giorni contati, non come una data calata dall'alto.
