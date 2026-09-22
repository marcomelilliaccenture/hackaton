# B2A — `fees.ts` + `requirements.ts`

> Blocco 2A · traccia A · 0:40 · `test-author` **prima**, poi `builder`
> Parallelizzabile con B2B. Dipende da B1A (`motivi.ts` esiste già).
> **Spec chiuso.** Non aprire `app-plan.md` né il dossier di dominio.

## Obiettivo

Quanto paga e su quale canale; quali fotocopie servono per la sua tipologia. Due tabelle di
dati e l'aritmetica che le lega, entrambe pure e testate.

## Criteri da soddisfare

- [ ] **A-06** `/costi` mostra **le quattro voci** con il canale di pagamento di ognuna, il
      bollettino unico da 70,46 € e il totale di cassa 116,46 €. Il conto è verificabile a
      occhio; nessun totale compare senza le voci che lo compongono.
- [ ] **A-07** `/documenti` cambia con la tipologia scelta; ogni voce ha **nome burocratico,
      nome semplice, com'è fatto, dove si trova**; è spuntabile con contatore persistente e
      porta il banner "checklist tipo, le Questure variano".

In questo blocco a livello di dominio; le pagine arrivano in B3B.

## Requisiti di legge (con fonte)

| # | Requisito | Il dato | Fonte |
|---|---|---|---|
| R-15 | Marca da bollo | **16,00 €**, in tabaccheria, applicata sull'istanza | F1, F6 |
| R-16 | Produzione del permesso elettronico | **30,46 €**, bollettino c/c **67422402** intestato al MEF, causale "importo per il rilascio del permesso di soggiorno elettronico" | F6 |
| R-17 | Contributo per durata | **40,00 €** (> 3 mesi ≤ 1 anno) · **50,00 €** (> 1 ≤ 2 anni) · **100,00 €** (lungo periodo, dirigenti, lavoratori specializzati) | F6; DM MEF/Interno 5.5.2017 via F4 |
| R-18 | Bollettino unico | **un solo bollettino per richiedente**, che somma produzione + contributo → **70,46** / **80,46** / **130,46 €** | F1, F6 |
| R-19 | Spedizione | **30,00 €** all'operatore, al momento dell'accettazione | F5, F6 |
| R-20 | Errori nella fonte | F6 scrive il costo di produzione "30.36€" in due esempi e sbaglia una somma. **Usiamo 30,46 €** e mostriamo sempre le voci | F6 |
| R-21 | Esenzioni dal contributo | minori di 18 anni regolarmente presenti · asilo, richiesta di asilo, protezione umanitaria e sussidiaria · apolidi minori · ingresso per cure mediche, esteso agli accompagnatori · duplicato, aggiornamento, conversione di permesso **in corso di validità** | F4 |
| R-22 | Documenti comuni a tutti i titoli | bollo 16 € · copia passaporto valido (pagine anagrafiche, scadenza, visti, timbri) · permesso se in possesso · copia codice fiscale se in possesso · certificazione dell'**attuale dimora**: certificato di residenza **oppure** dichiarazione di ospitalità / cessione di fabbricato vidimata | F1 §A |
| R-23 | Lavoro subordinato, primo rilascio | **contratto di soggiorno** (Sportello Unico, solo primo rilascio) · codice fiscale se in possesso · dichiarazione di ospitalità + contratto d'affitto + documento dell'ospitante **oppure** certificato di residenza · copia passaporto · modello **UNILAV** · dichiarazione dei redditi o **CUD** · ultima **busta paga** · bollo 16 € · bollettino 70,46 / 80,46 € | F1 |
| R-24 | Accordo di integrazione | previsto presso lo Sportello Unico per i permessi di almeno un anno | F14 = art. 4-bis D.lgs 286/98, DPR 179/2011; F1 |
| R-25 | Fotocopie | tutto **in fotocopia A4** nella busta, **originali da esibire** alla convocazione | F1 §A |
| R-26 | Niente autocertificazione | in deroga al DPR 445/2000, i cittadini stranieri che devono esibire certificati **devono richiederli all'Amministrazione competente** | F1; D.lgs 286/1998, DPR 394/99 |
| R-33 | Variabilità per Questura | F1 §B è il documento di **una singola Questura** (cita il Comune di Rovigo): è una **checklist tipo**, non l'elenco vincolante | F1 |

## Contratto

> I tipi condivisi (`Answers`, `Address`, `PassportData`, `Step`, `Istanza`, `Durata`,
> `MotivoCode`, `Channel`, `Issue`, `Severity`) esistono già in `app/src/domain/types.ts`
> (B0B): **importali da lì** e ri-esportali dal tuo modulo se il contratto li nomina.
> Non ridichiararli.

```ts
// fees.ts — R-15…R-21
export type Istanza = "rilascio" | "rinnovo" | "aggiornamento" | "conversione" | "duplicato";
export type Durata = "fino-1-anno" | "1-2-anni" | "lungo-periodo";
export type FeeChannel = "tabaccheria" | "bollettino-mef" | "cassa-poste";
export interface FeeItem { id: string; amountCents: number; channel: FeeChannel; source: string }
export interface Fees {
  bollettino: { items: FeeItem[]; totalCents: number };  // c/c 67422402, uno per richiedente
  cash: { items: FeeItem[]; totalCents: number };        // bollo + bollettino + spedizione
  exemptions: string[];                                   // codici, es. "MINORE_18"
}
export function feesFor(input: {
  istanza: Istanza; durata: Durata; ageYears: number; childrenUnder14: number;
}): Fees;

// requirements.ts — R-22…R-26, R-33
export interface DocumentRequirement {
  id: string;
  official: string;         // nome burocratico di F1, ALLA LETTERA
  i18nKey: string;          // nome semplice + com'è fatto + dove si trova
  motivi: MotivoCode[];
  onlyFor?: Istanza[];      // il contratto di soggiorno è SOLO "rilascio"
  copyInEnvelope: boolean;
  originalAtAppointment: boolean;
  source: string;
}
export function requirementsFor(motivo: MotivoCode, istanza: Istanza): DocumentRequirement[];
```

**Importi in centesimi** (`amountCents`), mai in float: `70.46` in floating point non è
`70,46`, e un totale che sfarfalla in demo su una cifra normativa è indifendibile.

`id` dei `FeeItem`: `bollo` · `produzione` · `contributo` · `spedizione`. Ognuno porta la sua
`source` (`"F1 · F6"`, `"F6"`, `"F5 · F6"`).

Casi di `feesFor` dalle fonti, da implementare esattamente così:
- `rilascio` + `fino-1-anno` + adulto → bollettino **7046** (30,46 + 40,00); cassa **11646**
  (16,00 + 70,46 + 30,00);
- `rilascio` + `1-2-anni` → bollettino **8046**; cassa **12646**;
- `lungo-periodo` → bollettino **13046**; cassa **17646**;
- `aggiornamento`, `conversione`, `duplicato` → bollettino **3046**, `exemptions` contiene
  `CONTRIBUTO_NON_PREVISTO` (R-21);
- `ageYears < 18` → `exemptions` contiene `MINORE_18`, contributo non dovuto;
- `childrenUnder14 > 0` → **un bollettino da 30,46 € per ogni figlio**, oltre a quello del
  genitore (R-21, caso dei minori nell'istanza del genitore).

## `test-author` — casi obbligatori

- i tre totali ufficiali (70,46 / 80,46 / 130,46) tornano **al centesimo**;
- il totale di cassa del caso di Fatou è **116,46 €**, e la somma delle `cash.items`
  **coincide** con `cash.totalCents` (è il test che rende vero il criterio "il conto è
  verificabile");
- `aggiornamento` → nessun contributo, e `exemptions` non è vuoto;
- minorenne → `MINORE_18` fra le esenzioni;
- due figli sotto i 14 → tre bollettini in tutto;
- **nessun importo è un float**: `amountCents` è sempre intero;
- `requirementsFor("16", "rilascio")` → lista **non vuota**, **senza id duplicati**, e
  contiene `contratto-di-soggiorno`;
- `requirementsFor("16", "rinnovo")` → **non** contiene `contratto-di-soggiorno` (R-23: solo
  primo rilascio. Un obbligo condizionato presentato come assoluto è il difetto più dannoso);
- ogni requisito ha `official` non vuoto e `source` non vuoto;
- una tipologia sconosciuta **non lancia**: ritorna almeno il blocco comune (R-22).

## File

**Puoi scrivere in:** `app/src/domain/fees.ts`, `app/src/domain/requirements.ts`,
`app/src/data/`, `app/tests/`.
**Non toccare:** `app/src/app/`, `app/src/components/`, `app/src/i18n/`.

`i18nKey` **si dichiara, non si riempie**: i testi sono della traccia B. Qui si scrive la
chiave e il nome burocratico esatto di F1.

## Fatto quando

`cd app && npm test` verde, e fra i nomi dei test si legge *"il totale di cassa per un primo
rilascio di un anno è 116,46 €"* e *"al rinnovo il contratto di soggiorno non è richiesto"*.

## Restituisci

```
SPEC: B2A
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
