# B5 — `/prima` e `/limiti`

> Blocco 5 · comune · 0:25 · `builder`, poi `clarity-guard` su `/limiti`
> **Da solo**: nessun altro spec in corso. Dipende da B4A e B4B.
> **Spec chiuso.** Riferimento: `docs/ux-spec.md` §8 (`/prima` non segue la spec, e perché).
> `/prima` è **sacrificabile** (diventa uno screenshot annotato). `/limiti` **no**: è il terzo
> deliverable del tema.

## Obiettivo

Le due pagine che non servono alla funzione e servono alla consegna: il "prima" dentro
l'app, e la dichiarazione onesta di cosa questo strumento non fa.

## Criteri da soddisfare

- [ ] **A-15** `/prima` mostra il modulo com'è oggi con evidenziati i tre punti di errore, ed è
      raggiungibile dalla home e dal riepilogo.
- [ ] **A-16** `/limiti` è compilata: non è consulenza legale · non invia nulla · non conosce
      lo stato della pratica · **il patronato fa la stessa cosa gratis** · cosa è stato
      semplificato e cosa non è stato alterato · i limiti dichiarati (festività patronali,
      variabilità per Questura, dati `[da verificare]`).

## `/prima`

È l'unica pagina che **non** segue `ux-spec.md`, e lo fa per un motivo: mostra il modulo
com'è oggi. Il brief chiede di mostrare in demo il percorso **prima e dopo**; noi lo mettiamo
dentro l'app invece che in uno screenshot, così è vivo e confrontabile.

Riproduzione fedele e sobria: griglia di caselle numerate, mono, righe `rule`, densità alta,
**nessuna spiegazione**. Bastano le sezioni 1, 7 e 8 del Modulo 1 — non tutte le 173 caselle.

**Tre annotazioni** in `alert`, numerate, sui punti dove le persone sbagliano:

| # | Dove | Cosa dice l'annotazione |
|---|---|---|
| 1 | caselle **3, 4** | "Nell'ordine del passaporto. L'istruzione è la lettera (a), su un altro foglio." |
| 2 | casella **16** | "Un codice da cercare in una tabella allegata, fra circa trenta voci quasi identiche." |
| 3 | caselle **76–84** | "Qui arriva la raccomandata della convocazione. Il modulo non lo dice: lo dice la nota (r), su un altro foglio." |

Sotto: un bottone "**Vedi com'è adesso**" → `/percorso`. Link da `/` e da `/riepilogo`.

**Nessuna caricatura.** Il modulo non è ridicolo: è scritto per chi lo amministra, non per chi
lo compila. Esagerarlo farebbe perdere il punto e insulterebbe chi ci lavora — e in Q&A si
vede subito.

Dati nelle caselle: finti e palesemente tali (`XX0000000`, "Via delle Prove 1").

## `/limiti`

Il terzo deliverable del tema (*Autonomia & Limiti*). Non è un disclaimer legale: è la pagina
che dice a una persona in una procedura legale **dove questo strumento smette di aiutarla**.
Testo in prima persona plurale, breve, senza avvocatese.

### 1. Cosa non facciamo

- **Non è consulenza legale.** Spieghiamo una procedura, non diamo consigli. Non ti diciamo
  cosa ti conviene fare.
- **Non inviamo niente**: non alla Questura, non a Poste, non al Portale Immigrazione. La
  domanda la presenti tu, di persona, all'ufficio postale.
- **Non sappiamo come va la tua pratica.** Nessun dato esce da questo telefono e non siamo
  collegati a nessun ufficio.
- **Non prevediamo l'esito** né i tempi della **tua** Questura. Il dato dei 60 giorni è una
  media dichiarata dalla Polizia di Stato (F4), non una promessa.
- **Non scegliamo la tipologia per te** nei casi ambigui, e non valutiamo se il tuo reddito
  è sufficiente: sono valutazioni della Questura.
- **Non compiliamo i campi che dipendono da un documento che non hai ancora** (contratto di
  soggiorno, nulla osta, idoneità alloggiativa).

### 2. C'è un modo gratuito e con una persona in carne e ossa (R-32)

**Va detto per primo fra le alternative, non nascosto in fondo.** I **patronati** e i **Comuni
abilitati** compilano l'istanza da un portale dedicato e ti consegnano la copia cartacea nella
busta: *"l'assistenza è gratuita"* (F3). Il **numero verde di Poste 800.200.309** risponde
lun–sab, escluso i festivi, 8:00–20:00, anche sullo stato di avanzamento (F5).

Se preferisci una persona, fai bene. Questo strumento serve a chi vuole capire prima di
andarci, o non ha un patronato vicino.

### 3. Cosa abbiamo semplificato, e cosa non abbiamo cambiato

Il vincolo del brief è *semplificare senza tradire*. Quindi:

- **Le parole sono nostre, il contenuto è delle fonti ufficiali.** Non abbiamo copiato il
  testo del Ministero — riprodurrebbe la barriera che stiamo togliendo — e non l'abbiamo
  scritto a memoria.
- **Il nome burocratico c'è sempre**, accanto alla spiegazione: è quello che devi cercare sui
  tuoi documenti e che l'operatore allo sportello riconosce.
- **Non abbiamo toccato nessun numero**: importi, termini, misure delle fototessere,
  numero del conto corrente sono quelli delle fonti, cifra per cifra.
- Ogni semplificazione non ovvia è registrata in `docs/evidence/meaning-checks.md`, con il
  testo originale accanto. Un link, con una riga che dice cos'è.

### 4. Quello che non sappiamo (e lo scriviamo)

- **Le festività patronali locali non sono nel conteggio** dei giorni lavorativi: solo le
  nazionali. Se la tua provincia ha un patrono nei tuoi 8 giorni, hai un giorno in meno di
  quello che ti diciamo. Nel dubbio, vai prima.
- **La checklist è una checklist tipo.** Le Questure variano nella prassi: la fonte è il
  documento di una singola Questura (F1). L'elenco vincolante è quello della **tua**.
- **Le due date di scadenza.** Le fonti ufficiali non concordano: la Polizia di Stato e il
  Portale Immigrazione dicono "8 giorni **lavorativi**", Poste dice "8 giorni". Ti mostriamo
  entrambe e ti diciamo quale è la più cauta.
- **Dove c'è `[da verificare]`**, non abbiamo trovato la fonte ufficiale. Il dato resta
  visibile col marcatore invece di essere nascosto.
- **Copriamo il primo rilascio** per lavoro dipendente, studio e famiglia. Non copriamo
  rinnovo, aggiornamento, conversione, duplicato, né le sezioni del modulo su carta di
  soggiorno, coniuge e figli.
- **Quattro lingue**, non di più: italiano, inglese, francese, spagnolo. Non l'arabo, e ci
  dispiace: il verso di scrittura richiede un lavoro che non stava in cinque ore.

### 5. E l'intelligenza artificiale?

**Dentro questo strumento non gira nessuna AI.** Le regole sono funzioni scritte e testate:
il conteggio dei giorni, i controlli sull'indirizzo, la somma degli importi. L'AI l'abbiamo
usata **per costruirlo** — e c'è scritto dove, in `docs/ai-contributions.md`.

Perché è una buona notizia: una funzione che conta i giorni lavorativi dà sempre la stessa
risposta. Un modello dà una risposta *probabile*, e su una scadenza di legge la differenza è
tutta.

## File

**Puoi scrivere in:** `app/src/app/prima/`, `app/src/app/limiti/`, `app/src/i18n/`,
`app/src/app/page.tsx` (il link a `/prima`).
**Non toccare:** `app/src/domain/`, `app/src/data/`, `app/tests/`.

## Poi: `clarity-guard`

Su **tutto** `/limiti`. È la pagina in cui un'imprecisione è più grave che altrove: qui
stiamo dichiarando i nostri limiti a una persona che ci sta credendo. Controllo specifico su
R-32 (l'assistenza dei patronati è gratuita — è una citazione, non una nostra opinione) e sul
dato dei 60 giorni, che è una **media dichiarata**, non un tempo garantito.

## Fatto quando

1. `/prima` mostra le sezioni 1, 7, 8 con le tre annotazioni numerate, e il bottone "Vedi
   com'è adesso".
2. Link a `/prima` dalla home e dal riepilogo.
3. `/limiti` ha tutte e cinque le sezioni, ed è linkata dal footer di **ogni** pagina.
4. In `/limiti` si legge che il patronato fa la stessa cosa gratis.
5. Tutto in francese, solo tastiera, senza errori in console.

## Restituisci

```
SPEC: B5
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
