# B3A — `validators.ts` + `form-model.ts` + `progress.ts`

> Blocco 3A · traccia A · 0:40 · `test-author` **prima**, poi `builder`
> Parallelizzabile con B3B. Dopo il sync **S2**.
> **Spec chiuso.** Non aprire `app-plan.md` né il dossier di dominio.

## Obiettivo

Le regole che evitano le tre integrazioni più costose: nome fuori ordine, recapito sbagliato,
passaporto incoerente. Più l'ordine di compilazione imposto dal modulo.

## Criteri da soddisfare

- [ ] **A-08** `/modulo/1` chiede cognome e nome **nell'ordine del passaporto**, mostra il
      numero di casella (3, 4) e l'esempio della MRZ, e avvisa se sembrano invertiti.
- [ ] **A-09** `/modulo/4` chiede "**dove ricevi la posta?**", spiega che lì arriva la
      raccomandata di convocazione, mostra le caselle 76–84 (il campo PRESSO è la **77**, letto da F9; la 76 è l'intestazione della sezione 8) e avvisa (senza bloccare) se il
      CAP non è coerente con la provincia.
- [ ] **A-11** Dopo **due errori sullo stesso campo** l'aiuto esteso compare senza doverlo
      chiedere. *(qui: il dominio deve rendere gli issue per campo, contabili)*

## Requisiti di legge (con fonte)

| # | Requisito | Il dato | Fonte |
|---|---|---|---|
| R-07 | Nome e cognome | caselle 3, 4 — nota **(a)**: *"riportare il dato come scritto sul passaporto o documento equipollente"* | F2 · Foglio Note |
| R-08 | Recapito per comunicazioni | caselle 76–84 (il campo PRESSO è la **77**, letto da F9; la 76 è l'intestazione della sezione 8) — nota **(r)**: *"indicare nome e cognome, oppure la denominazione sociale di società/ente/associazione, presso cui si vuole che venga alternativamente recapitata la raccomandata per la convocazione in Questura"*; nota **(q)**: *"se uguale al precedente non compilare"* | F2 · Foglio Note |
| R-11 | Numero totale di fogli | casella 25 — nota **(g)**: numero complessivo di fogli, **moduli + fotocopie dei documenti** | F2 |
| R-12 | Ordine di compilazione | nota **(f)**: compilare la sezione 2 **solo dopo** aver compilato interamente il Modulo 1, il Modulo 2 qualora si percepisca un reddito, e dopo aver fotocopiato in A4 tutti i documenti | F2 |
| R-13 | Firma | casella 29 — nota (f): *"nel caso non venga sottoscritta, l'istanza non verrà accettata allo sportello postale"* | F2 |
| R-14 | Modulo 2 | si compila *"qualora si percepisca un reddito"* | F3 |

## Contratto

> I tipi condivisi (`Answers`, `Address`, `PassportData`, `Step`, `Istanza`, `Durata`,
> `MotivoCode`, `Channel`, `Issue`, `Severity`) esistono già in `app/src/domain/types.ts`
> (B0B): **importali da lì** e ri-esportali dal tuo modulo se il contratto li nomina.
> Non ridichiararli.

```ts
export type Severity = "error" | "warning" | "info";
export interface Issue { field: number; code: string; severity: Severity }  // field = casella 209

export function validateName(i: {
  surname: string; given: string; passportMrz?: string
}): Issue[];
export function validateCommunicationAddress(
  a: Address, residence: Address, province: string
): Issue[];
export function validatePassport(p: PassportData, entryDate: Date): Issue[];
export function validateAll(answers: Answers, today: Date): Issue[];

// form-model.ts — R-12, R-14
export function needsModulo2(answers: Answers): boolean;
export function stepsFor(answers: Answers): Step[];   // l'ordine è imposto dalla nota (f)

// progress.ts — R-11
export function sheetCount(answers: Answers, checkedDocs: string[]): {
  proposed: number; breakdown: { label: string; sheets: number }[];
};
```

## I codici, esattamente questi

La frase sta in `i18n/`, il codice nel dominio. **Nessuna funzione restituisce frasi.**

| Codice | Casella | Severità | Regola |
|---|---|---|---|
| `NAME_NOT_IN_MRZ` | 3, 4 | warning | cognome o nome non compaiono nella MRZ digitata |
| `NAME_NON_LATIN` | 3, 4 | warning | caratteri non latini: va usata la traslitterazione del passaporto |
| `NAME_ORDER_SUSPECT` | 3, 4 | warning | nome e cognome sembrano invertiti rispetto alla MRZ |
| `ADDRESS_PROVINCE_MISMATCH` | 84 | **warning** | CAP di 5 cifre incoerente con la provincia — **non blocca** |
| `ADDRESS_SAME_AS_RESIDENCE` | 77 | info | uguale al recapito della sezione 7: la nota (q) dice di non compilare |
| `ADDRESS_EMPTY_NO_STABLE` | 77 | error | vuoto **e** senza recapito in sezione 7: la convocazione non arriverebbe da nessuna parte |
| `PASSPORT_EXPIRED_BEFORE_ENTRY` | 45 | error | scadenza del passaporto anteriore alla data di ingresso |
| `PASSPORT_NUMBER_EMPTY` | 44 | error | numero vuoto |
| `ENTRY_DATE_FUTURE` | 48 | error | data di ingresso nel futuro |
| `ENTRY_DATE_TOO_OLD` | 48 | warning | oltre 90 giorni nel passato |
| `DEADLINE_PASSED` | 48 | warning | i giorni rimanenti sono negativi |
| `SIGNATURE_REQUIRED` | 29 | error | firma non confermata |
| `SHEET_COUNT_UNCONFIRMED` | 25 | info | la proposta per la casella 25 non è stata confermata |

**Regola sulla severità, che decide i casi dubbi:** `error` **solo** dove l'istanza verrebbe
respinta o la convocazione non arriverebbe. Tutto il resto è `warning` o `info`.

Il CAP incoerente è un **warning**, non un blocco: Fatou riceve legittimamente la posta
all'indirizzo del datore di lavoro, in un'altra provincia. Bloccare significherebbe impedire
il caso reale che questo strumento esiste per servire.

`data/province.ts`: solo le province della demo (MO, BO, RE, MI, RM) con i loro range di CAP.
Manca una fonte aperta citabile per la tabella completa (`docs/sources.md`): il file porta in
testa `[da verificare]` e `ADDRESS_PROVINCE_MISMATCH` **non si emette** per una provincia non
in tabella — meglio silenzio che un avviso inventato.

## `stepsFor` — l'ordine imposto (R-12)

1 cognome e nome (3, 4) · 2 nascita e cittadinanza (34–38) · 3 passaporto e visto (44–57) ·
4 **recapito per comunicazioni (76–84)** · 5 lavoro / studio / famiglia · 6 contatti (73–75) ·
7 **controllo finale: fogli (25) e firma (29)**.

Il passo 7 si **sblocca per ultimo**, dopo i precedenti e dopo il Modulo 2 se
`needsModulo2()`: è la nota (f), ed è una regola di flusso, non un suggerimento.

## `sheetCount` — una proposta, non una validazione (R-11)

Ritorna `proposed` e il `breakdown` voce per voce (Modulo 1: n fogli · Modulo 2: n · ogni
documento spuntato: n). La persona **conferma**: finché non lo fa, `validateAll` emette
`SHEET_COUNT_UNCONFIRMED` con severità `info`. Non si scrive un numero al posto suo su un
modulo che firma lei.

## `test-author` — casi obbligatori

- MRZ `P<SENDIALLO<<FATOU<<<<<<<<<<<<<<<<<<<<<<<<<` con `surname: "Fatou"`,
  `given: "Diallo"` → `NAME_ORDER_SUSPECT`;
- gli stessi nell'ordine giusto → **nessun issue**;
- un nome assente dalla MRZ → `NAME_NOT_IN_MRZ`;
- caratteri non latini → `NAME_NON_LATIN`;
- CAP `20100` con provincia `MO` → **`warning`**, mai `error` (è il test che difende D-08);
- CAP `41100` con provincia `MO` → nessun issue;
- CAP con provincia fuori tabella → **nessun issue emesso**;
- recapito 76 vuoto e sezione 7 vuota → `error ADDRESS_EMPTY_NO_STABLE`;
- recapito 76 identico alla sezione 7 → `info ADDRESS_SAME_AS_RESIDENCE`;
- passaporto scaduto il 01/09/2026 con ingresso 18/09/2026 → `PASSPORT_EXPIRED_BEFORE_ENTRY`;
- numero di passaporto vuoto → `PASSPORT_NUMBER_EMPTY`;
- `needsModulo2` falso → `stepsFor` **non** contiene passi del Modulo 2;
- il passo 7 non è raggiungibile finché i precedenti non sono completi;
- **nessuna funzione restituisce una stringa leggibile**: ogni `code` è uno di quelli in
  tabella (test esplicito su questo: è il contratto con l'i18n).

Date reali, mai `new Date()`. Asserzioni sui codici, mai su frasi.

## File

**Puoi scrivere in:** `app/src/domain/validators.ts`, `form-model.ts`, `progress.ts`,
`app/src/data/province.ts`, `app/tests/`.
**Non toccare:** `app/src/app/`, `app/src/components/`, `app/src/i18n/`.

## Fatto quando

`npm test` verde, e fra i nomi dei test si legge *"un CAP di un'altra provincia è un avviso,
non un errore"* e *"il recapito vuoto senza un indirizzo in sezione 7 è un errore"*.

## Restituisci

```
SPEC: B3A
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
