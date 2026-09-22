# B4B — `/riepilogo` e la stampa

> Blocco 4B · traccia B · 0:35 · `builder`
> Parallelizzabile con B4A. Dipende da B3B.
> **Spec chiuso.** Riferimento di comportamento: `docs/ux-spec.md` §9 (stampa), §6 (testo).
> **Non sacrificabile.** Chiude il percorso: senza questa schermata la demo non ha una fine.

## Obiettivo

L'uscita. Fatou arriva qui con i dati raccolti nella forma del modulo, stampabili, la lista
degli allegati, e sa cosa fare domani mattina.

## Criteri da soddisfare

- [ ] **A-12** `/riepilogo` stampa (`@media print`) senza navigazione né bottoni, con i numeri
      di casella del MOD. 209, la proposta per la casella 25 e l'avviso sulla firma (casella 29).
- [ ] **A-13** `/riepilogo` elenca **gli errori evitati** in parole di Fatou ("l'indirizzo dove
      ricevi la posta è verificato", "il nome è nell'ordine del passaporto").
- [ ] **A-14** `/riepilogo` dice cosa fare dopo: dove si spedisce, cosa si riceve (ricevuta con
      i due codici + convocazione), cosa conservare, cosa portare alla convocazione.

## Requisiti di legge (con fonte)

| # | Requisito | Il dato | Fonte |
|---|---|---|---|
| R-11 | Numero totale di fogli | casella 25 — nota **(g)**: numero complessivo di fogli, **moduli + fotocopie dei documenti**. Resta una **proposta**: la persona conferma | F2 |
| R-13 | Firma | casella 29 — *"nel caso non venga sottoscritta, l'istanza non verrà accettata allo sportello postale"* | F2 |
| R-25 | Fotocopie | tutto **in fotocopia A4** nella busta, **originali da esibire** alla convocazione. La busta si consegna **aperta** | F1 §A · F2 |
| R-27 | Cosa riceve | **ricevuta** con **Codice Assicurata** e **Codice Ologramma**, da conservare col passaporto + **lettera di convocazione** con data, ora e luogo. Se l'agenda della Questura è piena, la convocazione arriva **per raccomandata all'indirizzo dichiarato** | F3 · F5 |
| R-28 | Valore della ricevuta | chi esibisce la ricevuta di **primo rilascio** per lavoro subordinato, autonomo o ricongiungimento *"ha i medesimi diritti connessi al possesso del permesso di soggiorno"*; in attesa del primo permesso per lavoro si può lavorare temporaneamente, salvo comunicazione di motivi ostativi | F4 |
| R-29 | Alla convocazione | **4 fotografie formato tessera, fondo bianco, 35 × 45 mm** · ricevuta dell'assicurata · l'appuntamento rilasciato dall'Ufficio Postale · la **seconda ricevuta del bollettino** · **gli originali di tutti i documenti allegati in fotocopia** · 4 foto per ogni figlio < 14 da inserire nel titolo, **con i figli presenti** | F1 §B · F4 |
| R-31 | Tempi | la pratica si lavora *"in media, in 60 giorni dalla data di presentazione"* | F4 |
| R-32 | Alternativa gratuita | **patronati e Comuni abilitati** compilano l'istanza; *"l'assistenza è gratuita"*. Numero verde Poste **800.200.309**, lun–sab escluso festivi 8:00–20:00 | F3 · F5 |

## Le cinque sezioni, in quest'ordine

### 1. I tuoi dati, nella forma del modulo

Ogni valore accanto al **suo numero di casella**: `3 COGNOME · Diallo`, `76-84 RECAPITO PER
COMUNICAZIONI · presso …`. È ciò che permette di trascrivere sul cartaceo senza cercare, e di
parlare con l'operatore allo sportello.

Le caselle non compilate compaiono come **vuote e numerate**, non nascoste: un campo mancante
scoperto allo sportello costa il viaggio.

### 2. Gli errori evitati (A-13)

Il pezzo che finisce nel deck. Una riga per ogni controllo passato, in parole sue, **al
passato**:

- "Il tuo nome è nell'ordine del passaporto — quello che il modulo chiede."
- "L'indirizzo dove ricevi la posta è compilato: la lettera della Questura ti arriverà."
- "Il tuo passaporto è valido dopo la data di ingresso."
- "Hai chiesto la tipologia giusta: codice 16, lavoro subordinato."
- "Sei nei tempi: hai presentato entro gli 8 giorni lavorativi."

Solo i controlli **realmente passati**: se un `warning` è stato superato con "ho controllato,
è giusto", la riga lo dice ("hai confermato tu che ricevi la posta a Milano"). Un elenco che
si vanta di controlli che non sono avvenuti è la cosa peggiore che questa pagina possa fare.

### 3. Prima di chiudere la busta

- **La firma, casella 29** — in evidenza: senza firma l'istanza **non viene accettata** allo
  sportello postale. Una checkbox "ho firmato" che emette `SIGNATURE_REQUIRED` finché è
  vuota.
- **La casella 25**, con la proposta di `sheetCount()` e il `breakdown` aperto (Modulo 1: n ·
  Modulo 2: n · ogni documento spuntato: n). **Proposta, non valore**: la persona conferma.
  Non scriviamo un numero al posto suo su un modulo che firma lei.
- **Le fotocopie in A4**, e la busta che si consegna **aperta**: i controlli li fa l'operatore
  prima di chiuderla.
- L'elenco degli allegati spuntati in `/documenti`, con le caselle da spuntare a penna.

### 4. Cosa succede dopo (A-14)

1. **Dove si spedisce**: un ufficio postale con **Sportello Amico** — non tutti gli uffici lo
   hanno. Solo l'interessata, di persona.
2. **Cosa ti danno**: la **ricevuta** con **Codice Assicurata** e **Codice Ologramma** (sono i
   codici per controllare online come va la pratica) e la **lettera di convocazione** con
   data, ora e luogo. Se l'agenda della Questura è piena, la convocazione arriva **per
   raccomandata all'indirizzo della sezione 8** — la frase che chiude il cerchio su `/modulo/4`.
3. **Cosa conservare**: la ricevuta **insieme al passaporto**. Vale: con la ricevuta di primo
   rilascio per lavoro hai gli stessi diritti del permesso, e in attesa del primo permesso
   puoi lavorare (F4).
4. **Cosa portare alla convocazione** (R-29), come lista spuntabile. Le **4 fototessere 35 ×
   45 mm a fondo bianco** in evidenza: servono in Questura, non alla posta, e chi non le ha
   rifà l'appuntamento.
5. **Quanto ci vuole**: "in media 60 giorni", **con la fonte** e presentato come informazione,
   **non come promessa**. Nessuna previsione sulla singola Questura.
6. **Come si controlla lo stato**: i due codici della ricevuta sul Portale Immigrazione; dopo
   l'appuntamento, il sito della Polizia di Stato. L'URL esatto dell'area riservata **non è
   pubblicato**: si rimanda al numero verde **800.200.309** e a F15, **mai a un URL
   inventato**.

### 5. Ecco com'era

Il link a `/limiti` nel footer. (`/prima` è tagliata: D-17.)

## La stampa (A-12)

`@media print`, che esiste già in `globals.css` da B0.

- **Via**: header, footer, `LanguageSwitcher`, bottoni, `DeadlineBanner`, `ExplainPanel`
  chiusi.
- **Resta**: i dati con i numeri di casella, la proposta per la 25, l'avviso sulla firma, la
  checklist degli allegati con le caselle a penna, la data di scadenza.
- Nero su bianco, `12pt`, A4, margini 15mm. I link diventano testo con l'URL fra parentesi.
- **Niente che dipenda dal colore**: Fatou non ha una stampante e stamperà da un internet
  point o dal datore di lavoro, probabilmente in bianco e nero.
- Leggibile **anche a schermo**: potrebbe non stampare affatto e mostrare il telefono
  all'operatore.

## File

**Puoi scrivere in:** `app/src/app/riepilogo/`, `app/src/app/globals.css`,
`app/src/components/`, `app/src/i18n/`.
**Non toccare:** `app/src/domain/`, `app/src/data/`, `app/tests/`.

## Fatto quando

1. `/riepilogo` dopo il percorso completo: dati con i numeri di casella, caselle vuote
   visibili.
2. Gli errori evitati elencati, e **solo** quelli realmente passati.
3. Ctrl+P: anteprima senza navigazione né bottoni, su una pagina A4, leggibile in bianco e
   nero.
4. La checkbox della firma non spuntata → l'avviso sulla casella 29 è visibile.
5. La proposta per la casella 25 mostra il dettaglio del conteggio.
6. "Cosa portare alla convocazione" contiene le 4 fototessere 35 × 45 mm.
7. Tutto in francese, solo tastiera, senza errori in console.

## Restituisci

```
SPEC: B4B
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
