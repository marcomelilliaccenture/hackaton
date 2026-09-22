# B3B — `/costi` · `/documenti`

> Blocco 3B · traccia B · 0:35 · `builder`, poi `clarity-guard` sulle voci della checklist
> Parallelizzabile con B3A. Dopo il sync **S2**.
> **Spec chiuso.** Riferimento di comportamento: `docs/ux-spec.md` §5 (`FeeTable`,
> `ChecklistItem`, `SourceNote`), §6.
> **Primo blocco sacrificabile** se il tempo stringe: `/documenti` può diventare una lista
> statica. Se lo tagli, dillo nel report.

## Obiettivo

Le due schermate che rispondono alle due domande più pratiche: quanto pago e dove, e quali
fotocopie metto nella busta.

## Criteri da soddisfare

- [ ] **A-06** `/costi` mostra **le quattro voci** con il canale di pagamento di ognuna, il
      bollettino unico da 70,46 € e il totale di cassa 116,46 €. Il conto è verificabile a
      occhio; nessun totale compare senza le voci che lo compongono.
- [ ] **A-07** `/documenti` cambia con la tipologia scelta; ogni voce ha **nome burocratico,
      nome semplice, com'è fatto, dove si trova**; è spuntabile con contatore persistente e
      porta il banner "checklist tipo, le Questure variano".

## `/costi`

Chiama `feesFor({ istanza, durata, ageYears, childrenUnder14 })` e rende una `<table>` vera,
con `<caption>` e `<th scope>`. Una riga per voce, **quattro informazioni per riga**:

| Voce | Importo | Dove si paga | Fonte |
|---|---|---|---|
| Marca da bollo | 16,00 € | tabaccheria o rivendita di valori bollati | F1 · F6 |
| Produzione del permesso elettronico | 30,46 € | bollettino c/c **67422402**, intestato al MEF | F6 |
| Contributo (permesso fino a 1 anno) | 40,00 € | **lo stesso bollettino**, sommato | F6 |
| Spedizione | 30,00 € | all'operatore, quando accetta la domanda | F5 · F6 |

Poi **due totali separati ed etichettati**, mai uno solo:

- **Bollettino unico: 70,46 €** — un solo bollettino per richiedente, che somma produzione e
  contributo. Con la causale: *"importo per il rilascio del permesso di soggiorno
  elettronico"*.
- **Totale di cassa: 116,46 €** — quanto esce di tasca in tutto, su tre canali diversi.

Regole non negoziabili:

1. **Nessun totale senza le sue righe** (`ux-spec.md` §5). La fonte ufficiale F6 contiene due
   errori aritmetici: mostrare solo il totale ci renderebbe indistinguibili da lei. Mostrare
   le voci rende il conto verificabile da chi paga.
2. Importi da `amountCents`, formattati `tabular-nums`. Mai ricalcolare in pagina: la somma la
   fa il dominio.
3. **Le esenzioni** (`exemptions[]`) sono una nota **sotto** la tabella, non una riga
   fantasma: minori di 18 anni · asilo e protezioni · apolidi minori · cure mediche e
   accompagnatori · aggiornamento, conversione, duplicato di permesso in corso di validità.
   Fonte F4.
4. Le **due ricevute del bollettino**: una va **nella busta**, l'altra si **esibisce in
   Questura** il giorno delle impronte. Una riga, in evidenza: è un errore frequente e costa
   un appuntamento.
5. Il bollettino premarcato si ritira **negli uffici postali abilitati** alla ricezione delle
   istanze.
6. Sulla durata: il contributo dipende da quanto dura il permesso, e le fonti **non
   concordano** (F4 dice fino a 3 anni per il tempo indeterminato, F2 e F3 dicono 2). Una
   riga lo dice, con entrambe le fonti. La demo assume **fino a 1 anno**.

## `/documenti`

Chiama `requirementsFor(motivo, "rilascio")`. Un `ChecklistItem` per voce, con **tutte e
quattro** le informazioni, sempre:

1. **nome semplice** (grassetto) — "Il contratto che hai firmato col tuo datore di lavoro";
2. **nome burocratico** (mono) — "contratto di soggiorno". È quello che deve cercare sui
   documenti e che l'operatore riconosce: **non si toglie mai**;
3. **com'è fatto** — "un foglio con il timbro dello Sportello Unico e due firme";
4. **dove si trova** — "te l'ha dato lo Sportello Unico in Prefettura quando l'hai firmato".

Più un badge testuale che distingue **"fotocopia nella busta"** da **"originale alla
convocazione"**: tutto va in fotocopia A4 nella busta, e gli originali si esibiscono il
giorno delle impronte (F1 §A).

Sopra la lista: contatore "3 di 9 pronti", `aria-live="polite"`, persistente in
`localStorage`. Checkbox nativa da 24px con area cliccabile ≥ 44px estesa all'etichetta.

Due banner, entrambi obbligatori:

- **"Questa è una checklist tipo."** Le Questure variano nella prassi: la fonte F1 §B è il
  documento di una singola Questura. La lista vincolante è quella della **sua** Questura.
  Fonte F1. *(È un requisito del deliverable Autonomia & Limiti, non una postilla.)*
- **"Niente autocertificazione."** In deroga alla normativa generale, i cittadini stranieri
  che devono esibire certificati **devono richiederli all'Amministrazione competente** (F1;
  D.lgs 286/1998, DPR 394/99). È una regola che sorprende chi è abituato all'autocertificazione
  italiana, e che manda indietro le pratiche.

Ogni voce che nomina un certificato ha un `ExplainPanel` con dove si chiede. Per la
**dichiarazione di ospitalità**: chi ospita deve comunicarla entro **48 ore** all'autorità di
pubblica sicurezza (F13 = art. 7 D.lgs 286/1998).

Se il motivo è `16` e la durata è almeno un anno, una riga informativa sull'**Accordo di
integrazione**, che si firma allo Sportello Unico (F14 = art. 4-bis D.lgs 286/98, DPR
179/2011). Non è un documento da allegare: è un adempimento a valle, e va detto come tale.

## Testi

Le chiavi `doc.*` e `fee.*` in `it.json` e `fr.json`; `en.json` ed `es.json` con le chiavi
presenti ma vuote. `official` viene dal dominio (è F1 alla lettera): **non riscriverlo** in
i18n, altrimenti una traduzione può perderlo.

Poi `clarity-guard` su tutte le chiavi `doc.*`. Il difetto da cercare: un **obbligo
condizionato presentato come assoluto** — il contratto di soggiorno è **solo** primo rilascio,
la busta paga solo per chi è stato assunto nell'anno in corso.

## File

**Puoi scrivere in:** `app/src/app/costi/`, `app/src/app/documenti/`,
`app/src/components/FeeTable.tsx`, `app/src/components/ChecklistItem.tsx`, `app/src/i18n/`.
**Non toccare:** `app/src/domain/`, `app/src/data/`, `app/tests/`.

## Fatto quando

1. `/costi` con lavoro subordinato, 1 anno, adulta: quattro voci con tre canali diversi,
   bollettino 70,46 €, cassa 116,46 €. Si somma a mano e torna.
2. Cambiare la durata a "1–2 anni" → bollettino 80,46 €, cassa 126,46 €.
3. `/documenti` con `16` → nove voci con quattro informazioni ciascuna; con `31` (studio) la
   lista **cambia**.
4. Spuntare tre voci, ricaricare la pagina → il contatore dice ancora "3 di 9".
5. Entrambi i banner presenti. Contrasto e target verificabili a occhio.
6. Solo tastiera, in francese, senza errori in console.

## Restituisci

```
SPEC: B3B
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
