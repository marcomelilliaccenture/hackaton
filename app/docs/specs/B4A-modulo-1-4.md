# B4A — `/modulo/1` e `/modulo/4`, con gli errori spiegati

> Blocco 4A · traccia A · 0:45 · `builder`
> Parallelizzabile con B4B. Dipende da B3A (validatori) e B1B (componenti).
> **Spec chiuso.** Riferimento di comportamento: `docs/ux-spec.md` §4 (ciclo di vita del
> campo), §5 (`FieldCard`, `ExplainPanel`), §6 (formato del messaggio).
> **Non sacrificabile.** Sono le due schermate che raccontano la storia: senza queste non c'è
> demo.

## Obiettivo

I due campi su cui Fatou si blocca, risolti: il nome nell'ordine del passaporto (caselle 3 e
4) e il recapito dove arriva la convocazione (caselle 76–84).

## Criteri da soddisfare

- [ ] **A-08** `/modulo/1` chiede cognome e nome **nell'ordine del passaporto**, mostra il
      numero di casella (3, 4) e l'esempio della MRZ, e avvisa se sembrano invertiti.
- [ ] **A-09** `/modulo/4` chiede "**dove ricevi la posta?**", spiega che lì arriva la
      raccomandata di convocazione, mostra le caselle 76–84 e avvisa (senza bloccare) se il
      CAP non è coerente con la provincia.
- [ ] **A-10** Ogni campo ha "**Non capisco**": apre l'`ExplainPanel` con la spiegazione
      estesa nella lingua scelta e la nota ufficiale che lo riguarda.
- [ ] **A-11** Dopo **due errori sullo stesso campo** l'aiuto esteso compare senza doverlo
      chiedere.

## Requisiti di legge (con fonte)

| # | Requisito | Il dato | Fonte |
|---|---|---|---|
| R-07 | Nome e cognome | caselle 3, 4 — nota **(a)**: *"riportare il dato come scritto sul passaporto o documento equipollente"* | F2 · Foglio Note |
| R-08 | Recapito per comunicazioni | caselle 76–84 — nota **(r)**: *"indicare nome e cognome, oppure la denominazione sociale di società/ente/associazione, presso cui si vuole che venga alternativamente recapitata la raccomandata per la convocazione in Questura"*; nota **(q)**: *"se uguale al precedente non compilare"* | F2 · Foglio Note |
| R-27 | Cosa arriva a quell'indirizzo | se l'agenda della Questura non ha disponibilità, la convocazione arriva **per raccomandata all'indirizzo italiano dichiarato** | F3 |

## `/modulo/1` — caselle 3 e 4

Due `FieldCard` sulla stessa schermata (sono un dato solo: il nome), più un campo opzionale
per la MRZ.

- **Chip** `casella 3` e `casella 4`.
- **Nome burocratico**: "COGNOME" e "NOME" — con la nota (a) accanto, citata alla lettera.
- **La nostra domanda**: "Come è scritto il tuo cognome **sul passaporto**?" — la parola che
  fa il lavoro è *sul passaporto*, e va in grassetto.
- **Perché serve**: se non coincide con il passaporto, la Questura chiede un'integrazione e la
  pratica si ferma.
- **L'esempio: la MRZ.** Mostra le due righe in basso del passaporto, in mono, con il pezzo
  che contiene il nome evidenziato:

  ```
  P<SENDIALLO<<FATOU<<<<<<<<<<<<<<<<<<<<<<<<<<
     │  └─ cognome ─┘  └─ nome ─┘
     └─ codice dello Stato
  ```

  Dati **palesemente finti**. La spiegazione: nella MRZ il **cognome viene prima**, separato
  dal nome da due `<<`. È la chiave che rende il campo autoesplicativo, ed è il motivo per cui
  questa schermata esiste.
- **Campo MRZ opzionale**: "Se vuoi, copia qui la riga in basso del passaporto: controlliamo
  che l'ordine sia giusto". Opzionale significa che **senza di esso la pagina funziona**:
  niente MRZ, niente `NAME_NOT_IN_MRZ`, nessun avviso inventato.
- **Avvisi** da `validateName`: `NAME_ORDER_SUSPECT` · `NAME_NOT_IN_MRZ` · `NAME_NON_LATIN`,
  tutti `warning`. Il testo in tre parti (`ux-spec.md` §6):

  ```
  Nella riga del passaporto il cognome sembra "Diallo" e il nome "Fatou": all'incontrario.
  Il modulo vuole i dati esattamente come sul passaporto.
  Controlla: se è così, scambiali. Se il passaporto dice davvero questo, conferma.
  ```

  Nessuno di questi blocca: la MRZ la digita una persona, e può digitarla male.

## `/modulo/4` — caselle 76–84

**La schermata più importante del prodotto.** È il punto in cui la pratica di una persona si
perde oggi, in silenzio.

- **La domanda, prima di tutto**: "**Dove ricevi la posta?**" È questa la domanda che il
  modulo *voleva* fare. Il nome burocratico ("Recapito per eventuali comunicazioni", con chip
  `caselle 76-84`) sta sotto, non sopra.
- **Perché serve, esplicito e non evitabile**: "Qui la Questura ti manda la **raccomandata**
  che ti dice quando andare a fare foto e impronte. Se non arriva, la tua pratica si ferma e
  nessuno ti avvisa."
- **Il campo PRESSO (casella 77)** come primo campo, con la nota (r) risolta: "il nome della
  persona o dell'azienda a cui arriva la posta — se ricevi la posta dal tuo datore di lavoro,
  scrivi il nome dell'azienda". È il campo che nessuno capisce, e la nota che lo spiega è su
  un altro foglio.
- Poi provincia (78) · comune (79) · indirizzo (80) · civico (81) · scala (82) · interno (83)
  · CAP (84), ognuno col suo chip.
- **La nota (q) trattata come una scelta, non come un'omissione**: due opzioni chiare —
  "Ricevo la posta all'indirizzo dove vivo" (e allora la sezione 8 resta vuota, come dice la
  nota) oppure "Ricevo la posta a un altro indirizzo". La seconda è il caso di Fatou. Se
  sceglie la prima e la sezione 7 è vuota → `error ADDRESS_EMPTY_NO_STABLE`: è l'unico errore
  bloccante di questa schermata, perché è l'unico caso in cui la lettera non arriverebbe da
  nessuna parte.
- **`ADDRESS_PROVINCE_MISMATCH` è un `warning`**, e accanto al bottone "Continua" compare
  "**Ho controllato, è giusto**". Il testo:

  ```
  Il CAP 20100 è di Milano, ma hai scelto la provincia MO (Modena).
  La Questura manda la convocazione all'indirizzo di questa sezione.
  Se ricevi la posta a Milano va bene così: conferma. Altrimenti correggi il CAP.
  ```

  Bloccare qui significherebbe impedire il caso reale di Fatou, che riceve la posta
  all'indirizzo del datore di lavoro. Un avviso che si può superare è la scelta di progetto,
  non un compromesso.
- **`ExplainPanel`** della casella 76, con la nota (r) citata alla lettera, cosa fare adesso e
  la fonte (F2 · Foglio Note, nota (r)).

## Il comportamento del campo (A-11)

Da `ux-spec.md` §4, da rispettare alla lettera:

- validazione al **`blur`**, non a ogni tasto;
- il contatore degli errori è **per campo**; al **secondo** `error` l'`ExplainPanel` si apre
  da solo **e resta aperto**;
- il focus **non si sposta** da solo: l'errore è annunciato via `aria-live`, non rubando il
  cursore;
- `aria-invalid` **solo** sugli `error`, non sui `warning`;
- il passo indietro **non perde nulla**.

## File

**Puoi scrivere in:** `app/src/app/modulo/`, `app/src/components/`, `app/src/i18n/`.
**Non toccare:** `app/src/domain/`, `app/src/data/`, `app/tests/`.

Chiama i validatori, **non reimplementarli**. Se una regola manca, dillo nel report: una
regola duplicata in una pagina è una regola che non è testata.

## Fatto quando

1. `/modulo/1`: chip 3 e 4, esempio MRZ leggibile, nome invertito → avviso spiegato in tre
   parti, e si può continuare.
2. `/modulo/1` senza MRZ: nessun avviso, la pagina funziona.
3. `/modulo/4`: la prima cosa che si legge è "Dove ricevi la posta?", e da nessuna parte
   compare solo "Recapito per eventuali comunicazioni".
4. CAP di un'altra provincia → avviso + "Ho controllato, è giusto" → si continua.
5. "Ricevo la posta dove vivo" con sezione 7 vuota → errore bloccante, spiegato.
6. Due errori sullo stesso campo → `ExplainPanel` aperto da solo, e resta aperto.
7. Il passo indietro non perde nulla.
8. Tutto in francese, solo tastiera, senza errori in console.

## Restituisci

```
SPEC: B4A
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
