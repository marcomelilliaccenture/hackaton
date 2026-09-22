# Piano dell'app — Wizard kit postale permesso di soggiorno

Documento operativo: è scritto per essere eseguito da chiunque, umano o agente, senza avere
altro contesto oltre a questo file, a [`persona.md`](./persona.md) e a
[`challenge-brief.md`](./challenge-brief.md). Se un'istruzione qui contraddice il brief,
**vince il brief**.

Questa revisione (2026-09-22, seconda stesura) incorpora i requisiti di legge estratti in
[`dominio-permesso-di-soggiorno.md`](./dominio-permesso-di-soggiorno.md). Quel file è la
**base fattuale**; questo è il **contratto di costruzione**. Ogni requisito normativo che
entra nel prodotto compare in §4 con la sua fonte, la funzione che lo implementa e la
schermata che lo mostra.

**Questo file è l'unico piano.** Non esiste `docs/plan.md`: slice, criteri di accettazione,
budget e rischi stanno in §11–§14 di questo documento.

Ordine di autorità: `challenge-brief.md` → questo file → `dominio-permesso-di-soggiorno.md`
→ `sources.md` → tutto il resto.

---

## 1. Cosa stiamo costruendo

Uno strumento web che accompagna **Fatou** ([`persona.md`](./persona.md)) a compilare il
**kit postale MOD. 209** per il primo rilascio del permesso di soggiorno, fino ad avere i
moduli pronti da stampare, la lista delle fotocopie da allegare, l'importo esatto da versare
e la data entro cui spedire.

**Il software non contiene AI a runtime.** Nessuna chiamata a modelli, nessun chatbot. Tutte
le regole sono deterministiche e testate. L'AI è stata usata per *costruirlo*: il workflow è
in [`build-workflow.md`](./build-workflow.md), l'attribuzione in
[`ai-contributions.md`](./ai-contributions.md), l'harness in `agents/`.

Motivo: il brief chiede una persona concreta aiutata a portare a termine un compito reale e
vieta i chatbot generici. Una funzione che valida un CAP è più affidabile, più veloce da
dimostrare e più difendibile in Q&A di un modello che "di solito" risponde bene.
Registrato in [`decision-log.md`](./decision-log.md) D-03.

## 2. Il percorso della demo (prima → dopo)

| | Oggi | Con lo strumento |
|---|---|---|
| **Prima di tutto** | Non sa se il kit postale è il canale giusto per il suo caso | `/dove` risponde dal codice motivo e da chi presenta: Poste o Questura, e perché |
| Tempo | Non sa di avere 8 giorni **lavorativi**: il termine non è sul kit | `/scadenza` mostra la data, i giorni contati uno per uno e quelli saltati con il motivo |
| Compilazione | 173 caselle, note `(a)…(y)` su un foglio separato, cinque tabelle allegate | Un campo alla volta, con la nota ufficiale che lo riguarda già risolta e spiegata nella sua lingua |
| Errore tipico | Alla casella 76 scrive l'indirizzo della cugina: la convocazione non la raggiunge | Il campo chiede "dove ricevi la posta?" e spiega che lì arriva la raccomandata della Questura |
| Documenti | Scopre cosa manca quando la Questura chiede un'integrazione | Checklist della sua tipologia: nome burocratico, com'è fatto, dove si trova |
| Soldi | Quattro voci su tre canali, con la tabella ufficiale che sbaglia due somme | `/costi` mostra le voci, il bollettino unico e il totale di cassa, verificabile riga per riga |
| Uscita | Spera di aver capito | `/riepilogo` stampabile con i numeri di casella del MOD. 209, gli errori evitati e cosa fare dopo |

~~La pagina `/prima` mostra il modulo com'è oggi: il "prima" è **dentro l'app**~~ — tagliata (D-17): il "prima" è uno screenshot annotato del modulo ufficiale, non in uno
screenshot esterno. Serve al deliverable *Percorso Assistito*.

## 3. Le quattro tipologie esposte

Il codice motivo è il dato che decide tutto il resto (casella 16 del Modulo 1, tabella
allegata n. 2). Nell'app ne esponiamo quattro; le altre stanno nei dati, fuori dal percorso.

| Codice | Nome ufficiale | Nella nostra lingua | Fonte |
|---|---|---|---|
| `16` | Lavoro subordinato | "Lavoro con un contratto da dipendente" | F2, F7 |
| `31` | Studente (art. 39-bis TUI) | "Studio in una scuola o università italiana" | F2, F7 |
| `13` | Famiglia | "Raggiungo un familiare che vive in Italia" | F2, F7 |
| — | altro | "Un altro motivo" → porta a `/dove` con esito "non lo sappiamo dire, ecco dove chiedere" | §3 del dossier |

Il percorso della demo è `16`. Le altre tre esistono per dimostrare che la checklist, i costi
e l'instradamento cambiano davvero con la tipologia — non per essere complete.

## 4. Requisiti di legge → codice → schermata

Questa tabella è il cuore della revisione. **Nessuna riga entra nel prodotto senza una fonte.**
Dove la fonte manca, la stringa mostrata contiene `[da verificare]` e ci resta.

| # | Requisito | Il dato | Fonte | Funzione | Dove si vede |
|---|---|---|---|---|---|
| R-01 | Termine per la prima domanda | **8 giorni lavorativi** dall'ingresso (casella 48), al Questore della provincia in cui si trova | F12 (art. 5 c. 2 D.lgs 286/1998), F3, F4 | `deadline.workingDaysDeadline` | `/scadenza`, banner su ogni pagina |
| R-02 | Conflitto sul termine | F5 scrive "8 giorni" senza "lavorativi" | F5 vs F3/F4 | `deadline.calendarDaysDeadline` | `/scadenza` mostra **entrambe** le date, la più prudente in evidenza |
| R-03 | Tipologie che passano dal kit postale | 33 codici motivo ammessi | F2 (tab. 2), F7 | `routing.channelFor` | `/dove` |
| R-04 | Tipologie solo in Questura | 14 motivi (asilo primo rilascio, cure mediche, minore età, protezione…) | F8 | `routing.channelFor` | `/dove`, con il motivo dell'esclusione |
| R-05 | Chi deve andare in Questura comunque | avvocati, tutori, amministratori di sostegno, incaricati dal Tribunale; minori > 14 non accompagnati dal genitore | F3, F5 | `routing.channelFor` (input `presentedBy`) | `/dove` |
| R-06 | Soggiorni ≤ 3 mesi | non si chiede il permesso: dichiarazione di presenza | F4 | `routing.channelFor` esito `dichiarazione-di-presenza` | `/dove` |
| R-07 | Nome e cognome | caselle 3, 4 — nota **(a)**: "riportare il dato **come scritto sul passaporto**" | F2 (Foglio Note) | `validators.validateName` | `/modulo/1` |
| R-08 | Recapito per comunicazioni | caselle 76–84 — nota **(r)**: indirizzo "**presso cui si vuole che venga alternativamente recapitata la raccomandata per la convocazione in Questura**"; nota **(q)**: "se uguale al precedente non compilare" | F2 (Foglio Note) | `validators.validateCommunicationAddress` | `/modulo/4` |
| R-09 | Codice tipologia | casella 16, dalla tabella allegata n. 2 | F2, F7 | `motivi.byCode` | `/percorso` → precompila la casella |
| R-10 | Codici Stato | caselle 35, 36 — 3 lettere, tabella allegata n. 3; `XXX` = apolide | F2 | dato in `data/stati.ts`, **solo per i Paesi della demo** | `/modulo/2` |
| R-11 | Numero totale di fogli | casella 25 — nota **(g)**: moduli **+ tutte** le fotocopie | F2 | `progress.sheetCount` (proposta, la persona conferma) | `/riepilogo` |
| R-12 | Ordine di compilazione | nota **(f)**: la sezione 2 si compila **solo dopo** il resto del Modulo 1, il Modulo 2 se c'è reddito, e dopo aver fotocopiato tutto | F2 | regola di flusso in `progress.ts` | il wizard sblocca il passo finale per ultimo |
| R-13 | Firma | casella 29 — nota (f): "nel caso non venga sottoscritta, **l'istanza non verrà accettata allo sportello postale**" | F2 | `validators.validateAll` (codice `SIGNATURE_REQUIRED`) | `/riepilogo`, in evidenza |
| R-14 | Modulo 2 | si compila "**qualora si percepisca un reddito**" (68 caselle) | F3 | `form-model.needsModulo2` | `/percorso` chiede "percepisci un reddito?"; se no, 68 campi non compaiono |
| R-15 | Marca da bollo | **16,00 €**, in tabaccheria, applicata sull'istanza | F1, F6 | `fees.feesFor` voce `bollo` | `/costi` |
| R-16 | Produzione del permesso elettronico | **30,46 €**, bollettino c/c **67422402** intestato al MEF | F6 | `fees.feesFor` voce `produzione` | `/costi` |
| R-17 | Contributo per durata | **40,00 €** (> 3 mesi ≤ 1 anno) · **50,00 €** (> 1 ≤ 2 anni) · **100,00 €** (lungo periodo, dirigenti, lavoratori specializzati) | F6, F4 (DM MEF/Interno 5.5.2017) | `fees.feesFor` voce `contributo` | `/costi` |
| R-18 | Bollettino unico | un solo bollettino per richiedente: produzione + contributo → **70,46** / **80,46** / **130,46 €** | F1, F6 | `fees.feesFor` → `bollettino.total` | `/costi` |
| R-19 | Spedizione | **30,00 €** all'operatore, all'accettazione | F5, F6 | `fees.feesFor` voce `spedizione` | `/costi` |
| R-20 | Errori aritmetici nella fonte | F6 scrive "30.36€" e sbaglia una somma | F6 | — | `/costi` mostra **sempre** le voci, non solo il totale; `/limiti` dichiara la discrepanza |
| R-21 | Esenzioni dal contributo | minori di 18 · asilo, richiesta di asilo, protezione umanitaria e sussidiaria · apolidi minori · ingresso per cure mediche e accompagnatori · duplicato, aggiornamento, conversione di permesso **in corso di validità** | F4 | `fees.feesFor` → `exemptions[]` | `/costi` |
| R-22 | Documenti comuni a tutti i titoli | bollo 16 € · copia passaporto valido (pagine anagrafiche, scadenza, visti, timbri) · permesso se in possesso · copia codice fiscale se in possesso · certificazione dell'**attuale dimora** (residenza **oppure** dichiarazione di ospitalità / cessione di fabbricato vidimata) | F1 §A | `requirements.requirementsFor` | `/documenti` |
| R-23 | Lavoro subordinato, primo rilascio | contratto di soggiorno (SUI) · codice fiscale se in possesso · dichiarazione di ospitalità + contratto d'affitto + documento dell'ospitante **oppure** certificato di residenza · copia passaporto · modello **UNILAV** · dichiarazione dei redditi o **CUD** · ultima **busta paga** · bollo 16 € · bollettino 70,46 / 80,46 € | F1 | `requirements.requirementsFor("16", "rilascio")` | `/documenti` |
| R-24 | Accordo di integrazione | previsto presso lo Sportello Unico per i permessi di almeno un anno | F14 (art. 4-bis D.lgs 286/98, DPR 179/2011), F1 | voce informativa in `requirements` | `/documenti`, `/riepilogo` (cosa fare dopo) |
| R-25 | Fotocopie | tutto **in fotocopia A4** nella busta, **originali da esibire** alla convocazione | F1 §A, F2 nota (f) | — | `/documenti` (banner), `/riepilogo` |
| R-26 | Niente autocertificazione | in deroga al DPR 445/2000, i cittadini stranieri che devono esibire certificati **devono richiederli all'Amministrazione competente** | F1 (D.lgs 286/1998, DPR 394/99) | — | `/documenti`, `ExplainPanel` di ogni certificato |
| R-27 | Cosa riceve alla spedizione | **ricevuta** con Codice Assicurata e Codice Ologramma (da conservare, vale con il passaporto) + **lettera di convocazione**; se l'agenda è piena, la convocazione arriva **per raccomandata all'indirizzo dichiarato** | F3, F5 | — | `/riepilogo` (cosa fare dopo) — chiude il cerchio su R-08 |
| R-28 | Valore della ricevuta | chi esibisce la ricevuta di primo rilascio per lavoro subordinato, autonomo o ricongiungimento "ha i medesimi diritti connessi al possesso del permesso" | F4 | — | `/riepilogo` |
| R-29 | Cosa portare alla convocazione | **4 fototessere 35 × 45 mm, fondo bianco** · ricevuta dell'assicurata · appuntamento di Poste · seconda ricevuta del bollettino · **originali di tutti gli allegati** · 4 foto per ogni figlio < 14, **con i figli presenti** | F1 §B, F4 | lista statica in `data/convocazione.ts` | `/riepilogo` |
| R-30 | Comunicazione di ospitalità | chi ospita comunica entro **48 ore** all'autorità di pubblica sicurezza | F13 (art. 7 D.lgs 286/1998) | — | `ExplainPanel` della dichiarazione di ospitalità |
| R-31 | Tempi di lavorazione | "in media, in **60 giorni** dalla data di presentazione" | F4 | — | `/riepilogo`, come informazione non come promessa |
| R-32 | Alternativa gratuita al kit | **patronati e Comuni abilitati** compilano l'istanza; "l'assistenza è gratuita". Numero verde Poste **800.200.309**, lun–sab 8:00–20:00 | F3, F5 | — | `/limiti` — è un requisito del deliverable *Autonomia & Limiti* |
| R-33 | Variabilità per Questura | F1 §B è il documento di **una singola Questura** (cita il Comune di Rovigo) | F1 | — | `/documenti` e `/limiti`: "checklist tipo", non elenco vincolante |
| R-34 | Durate massime del permesso | fino a 3 anni (lavoro subordinato a tempo indeterminato, autonomo, ricongiungimento) secondo F4 (circ. 50432/2023); **2 anni** secondo F2 e F3 | F4 vs F2/F3 | dato con doppia fonte | `/costi` (incide sul contributo), con entrambe le fonti |

**Requisiti raccolti e deliberatamente non implementati** — vanno in `/limiti`, non nel
dimenticatoio: sezione 9 del Modulo 1 (idoneità alloggiativa e sei anni di soggiorni, caselle
85–111, solo carta di soggiorno) · sezioni 10–12 (familiari a carico, coniuge, cinque blocchi
figli, caselle 119–173) · rinnovo, aggiornamento, conversione, duplicato · tabella allegata
n. 4 (documenti equipollenti: la colonna dei codici è disallineata nel PDF) · tabella n. 5
(autorità di rilascio) · Modulo 2 oltre le caselle del datore di lavoro.

## 5. Scope

**Dentro**
- Le 10 rotte di §6, con il percorso completo funzionante per il codice motivo `16`.
- Quattro lingue: it · en · fr · es. Le **etichette dei campi** riusano le traduzioni
  ufficiali del Ministero (F11, indicizzate per numero di casella); le **spiegazioni** sono
  scritte a mano da noi in tutte e quattro.
- I requisiti R-01 … R-34 di §4.
- Persistenza locale (`localStorage`), nessun account, nessun server.
- Output stampabile via CSS di stampa (`window.print()`), con i numeri di casella del MOD. 209.
- Verifica end-to-end con Playwright in `e2e/`: chiude A-12 e A-17, che nessuna lettura del
  codice può chiudere, e produce gli screenshot prima/dopo.

**Fuori (deciso, non dimenticato)**
- Login, backend, database, upload di documenti, invio alla Questura, notifiche.
- Arabo o altre lingue RTL: il layout costa più del valore dimostrabile in 5 ore.
- OCR del passaporto: la MRZ si digita.
- Lookup del codice motivo da testo libero e tabella completa dei ~200 codici Stato: valore
  reale, costo di data-entry alto. Restano le quattro tipologie e i Paesi della demo.
- Conteggio automatico dei fogli come *validazione*: resta una **proposta** (R-11).
- Qualunque forma di consulenza legale, scelta della tipologia nei casi ambigui, previsione
  sull'esito o sui tempi della singola Questura.
- Scraping dello stato pratica: si spiega **come** guardarlo, non lo si guarda al posto suo.

## 6. Le rotte

```
/               avvio: lingua + "ho ricevuto il kit postale"
/percorso       motivo · chi presenta · data di ingresso · provincia · reddito sì/no
/dove           Ufficio Postale o Questura? (R-03…R-06) — il gate che evita il viaggio inutile
/scadenza       la data limite, i giorni contati, i giorni saltati (R-01, R-02)
/costi          voci, bollettino unico, totale di cassa, esenzioni (R-15…R-21)
/documenti      checklist della tipologia (R-22…R-26, R-33)
/modulo/[step]  il wizard, un campo alla volta, con il numero di casella
/riepilogo      moduli compilati + errori evitati + stampa + cosa fare dopo (R-27…R-31)
/limiti         cosa questo strumento non fa (R-32, R-33, e ogni semplificazione)
```

`/dove` viene prima di `/scadenza` deliberatamente: sapere di avere 8 giorni non serve a chi
non può usare il kit postale.

## 7. Struttura dei file

```
app/
  src/
    app/
      layout.tsx              shell, <html lang>, skip-link, provider lingua, DeadlineBanner
      page.tsx                /
      percorso/page.tsx       /percorso
      dove/page.tsx           /dove
      scadenza/page.tsx       /scadenza
      costi/page.tsx          /costi
      documenti/page.tsx      /documenti
      modulo/[step]/page.tsx  /modulo/1..7
      riepilogo/page.tsx      /riepilogo
      limiti/page.tsx         /limiti
    components/               inventario e stati in docs/ux-spec.md §5
      FieldCard.tsx  ExplainPanel.tsx  StepProgress.tsx  DeadlineBanner.tsx
      ChecklistItem.tsx  FeeTable.tsx  SourceNote.tsx  LanguageSwitcher.tsx
    domain/                   logica pura, zero React, zero lingua, 100% testata
      deadline.ts  routing.ts  fees.ts  requirements.ts  validators.ts
      form-model.ts  progress.ts
    data/                     tabelle citabili, una fonte per file in testa
      motivi.ts               tabella allegata n. 2, le 4 tipologie esposte + canale
      province.ts             sigle della tabella allegata n. 1 (demo: MO, BO, RE, MI, RM)
      stati.ts               codici Stato a 3 lettere, solo i Paesi della demo (R-10)
      festivita.ts            festività nazionali 2026–2027 [da verificare: fonte citabile]
      convocazione.ts         cosa portare alla convocazione (R-29)
      campi-209.ts            numero di casella → sezione, nota (a)…(y), chiave i18n
    i18n/
      it.json  en.json  fr.json  es.json   chiavi identiche
      index.ts                t(key, lang), fallback esplicito e visibile
    fixtures/
      sample-answers.ts       dati finti per la demo, dichiaratamente finti
  tests/
    deadline.test.ts  routing.test.ts  fees.test.ts
    validators.test.ts  requirements.test.ts

e2e/                      verifica end-to-end — package.json PROPRIO, non quello di app/
  playwright.config.ts    Chromium, mobile + desktop, locale fr-FR, avvia app/ da sé
  tests/
    a11y.spec.ts          axe, target 44px, testo 16px, zoom, skip-link, console
    percorso.spec.ts      A-17: il cammino completo, solo da tastiera
    stampa.spec.ts        A-12: stampa senza navigazione, numeri di casella, A4
    evidenza.spec.ts      gli screenshot di docs/evidence/before-after/
```

Perché `e2e/` ha un `package.json` separato: `npm test` dentro `app/` è il **gate 1** e scatta
dopo ogni modifica `.ts` (hook `run_tests.py`). Con Playwright lì dentro, ogni edit avvierebbe
un browser. Il gate deve restare di due secondi.

Regola di separazione: **`domain/` non importa nulla da React e non conosce la lingua.**
Restituisce codici (`"ADDRESS_PROVINCE_MISMATCH"`), non frasi. Le frasi stanno in `i18n/`.
È ciò che rende i test leggibili e le quattro lingue possibili (D-07).

Regola sui dati: ogni file di `data/` comincia con un commento che cita la fonte (`F2`,
`F6`…) e la data di verifica. Un dato senza quel commento non entra.

## 8. Il contratto di dominio

Firme da rispettare: sono il contratto fra UI e test. `test-author` testa contro questa
sezione, `builder` implementa contro questa sezione. Chi vuole cambiarla lo dice prima.

I tipi nominati da più moduli (`Answers`, `Address`, `PassportData`, `Step`, `Istanza`,
`Durata`, `MotivoCode`, `Channel`, `Issue`, `Severity`) nascono in un solo file,
`domain/types.ts`, scritto verbatim in [`docs/specs/B0B-domain-types.md`](specs/B0B-domain-types.md).
I moduli che il contratto qui sotto nomina come proprietari di un tipo lo **ri-esportano**
(`export type { Istanza } from "./types"`): la superficie pubblica resta questa, le
definizioni sono una sola (D-16).

```ts
// ── data/motivi.ts ────────────────────────────────────────────────────────────
export type MotivoCode = "16" | "31" | "13" | "altro";
export interface Motivo {
  code: MotivoCode;
  official: string;              // nome della tabella allegata n. 2, alla lettera
  i18nKey: string;              // la nostra versione semplificata
  channel: "ufficio-postale" | "questura";
  source: string;               // "F2 · F7"
}

// ── routing.ts — R-03…R-06 ────────────────────────────────────────────────────
export type Channel = "ufficio-postale" | "questura" | "dichiarazione-di-presenza";
export type RoutingReason =
  | "MOTIVO_SOLO_QUESTURA"          // R-04
  | "PRESENTATO_DA_TERZO"           // R-05: avvocato, tutore, amministratore
  | "MINORE_NON_ACCOMPAGNATO"       // R-05
  | "SOGGIORNO_BREVE"               // R-06: ≤ 3 mesi
  | "MOTIVO_NON_RICONOSCIUTO";      // "altro": non lo sappiamo dire
export function channelFor(input: {
  motivo: MotivoCode;
  presentedBy: "interessato" | "terzo-autorizzato" | "minore-non-accompagnato";
  stayLongerThan3Months: boolean;
}): { channel: Channel; reasons: RoutingReason[] };

// ── deadline.ts — R-01, R-02 ──────────────────────────────────────────────────
export function workingDaysDeadline(
  entryDate: Date, days?: number, holidays?: Date[]
): {
  deadline: Date;
  countedDays: Date[];
  skipped: { date: Date; reason: "weekend" | "holiday" }[];
};
export function calendarDaysDeadline(entryDate: Date, days?: number): Date;  // R-02
export function daysRemaining(deadline: Date, today: Date): number;          // può essere negativo

// ── fees.ts — R-15…R-21 ───────────────────────────────────────────────────────
export type Istanza = "rilascio" | "rinnovo" | "aggiornamento" | "conversione" | "duplicato";
export type Durata = "fino-1-anno" | "1-2-anni" | "lungo-periodo";
export type FeeChannel = "tabaccheria" | "bollettino-mef" | "cassa-poste";
export interface FeeItem { id: string; amountCents: number; channel: FeeChannel; source: string }
export interface Fees {
  bollettino: { items: FeeItem[]; totalCents: number };   // c/c 67422402, un solo bollettino
  cash: { items: FeeItem[]; totalCents: number };         // bollo + bollettino + spedizione
  exemptions: string[];                                    // codici, es. "MINORE_18"
}
export function feesFor(input: {
  istanza: Istanza; durata: Durata; ageYears: number; childrenUnder14: number;
}): Fees;

// ── requirements.ts — R-22…R-26 ───────────────────────────────────────────────
export interface DocumentRequirement {
  id: string;
  official: string;        // nome burocratico di F1, alla lettera
  i18nKey: string;         // nome semplice + "com'è fatto" + "dove si trova"
  motivi: MotivoCode[];
  onlyFor?: Istanza[];     // R-23: il contratto di soggiorno è solo primo rilascio
  copyInEnvelope: boolean; // R-25: fotocopia nella busta
  originalAtAppointment: boolean;
  source: string;
}
export function requirementsFor(motivo: MotivoCode, istanza: Istanza): DocumentRequirement[];

// ── validators.ts — R-07, R-08, R-13 ──────────────────────────────────────────
export type Severity = "error" | "warning" | "info";
export interface Issue { field: number; code: string; severity: Severity }  // field = casella 209
export function validateName(i: { surname: string; given: string; passportMrz?: string }): Issue[];
export function validateCommunicationAddress(a: Address, residence: Address, province: string): Issue[];
export function validatePassport(p: PassportData, entryDate: Date): Issue[];
export function validateAll(answers: Answers, today: Date): Issue[];

// ── form-model.ts — R-09, R-12, R-14 ──────────────────────────────────────────
export function needsModulo2(answers: Answers): boolean;   // R-14: solo se c'è reddito
export function stepsFor(answers: Answers): Step[];         // R-12: l'ordine è imposto

// ── progress.ts — R-11 ────────────────────────────────────────────────────────
export function sheetCount(answers: Answers, checkedDocs: string[]): {
  proposed: number; breakdown: { label: string; sheets: number }[];
};  // proposta per la casella 25, la persona conferma
```

**Codici di validazione decisi** (la frase sta in `i18n/`, il codice nel dominio):

| Codice | Casella | Severità | Regola | Fonte |
|---|---|---|---|---|
| `NAME_NOT_IN_MRZ` | 3, 4 | warning | cognome o nome non compaiono nella MRZ digitata | R-07 |
| `NAME_NON_LATIN` | 3, 4 | warning | caratteri non latini: va usata la traslitterazione del passaporto | R-07 |
| `NAME_ORDER_SUSPECT` | 3, 4 | warning | nome e cognome sembrano invertiti rispetto alla MRZ | R-07 |
| `ADDRESS_PROVINCE_MISMATCH` | 84 | **warning** | CAP di 5 cifre incoerente con la provincia: **non blocca** (D-08) | R-08 |
| `ADDRESS_SAME_AS_RESIDENCE` | 76 | info | uguale al recapito della sezione 7: la nota (q) dice di non compilare | R-08 |
| `ADDRESS_EMPTY_NO_STABLE` | 76 | error | vuoto senza recapito in sezione 7: la convocazione non arriverebbe da nessuna parte | R-08 |
| `PASSPORT_EXPIRED_BEFORE_ENTRY` | 45 | error | scadenza del passaporto anteriore alla data di ingresso | sezioni 4–5 |
| `PASSPORT_NUMBER_EMPTY` | 44 | error | numero vuoto | sezione 4 |
| `ENTRY_DATE_FUTURE` | 48 | error | data di ingresso nel futuro | R-01 |
| `ENTRY_DATE_TOO_OLD` | 48 | warning | oltre 90 giorni nel passato: il termine è scaduto, serve un'altra strada | R-01 |
| `DEADLINE_PASSED` | 48 | warning | i giorni rimanenti sono negativi | R-01 |
| `SIGNATURE_REQUIRED` | 29 | error | firma non confermata: allo sportello l'istanza non viene accettata | R-13 |
| `SHEET_COUNT_UNCONFIRMED` | 25 | info | la proposta non è stata confermata dalla persona | R-11 |

Regola su `severity`: **`error` solo dove l'istanza verrebbe respinta o la convocazione non
arriverebbe.** Tutto il resto è `warning` o `info`. Bloccare un caso legittimo è peggio che
avvisare: Fatou riceve legittimamente la posta a un indirizzo in un'altra provincia (D-08).

## 9. Lingue e testi

- Dizionari piatti `it.json` / `en.json` / `fr.json` / `es.json`, **stesse chiavi**.
- Una chiave mancante mostra la chiave, non l'italiano silenzioso: gli errori di traduzione
  devono essere visibili in demo, non nascosti.
- **Le etichette ufficiali dei campi vengono da F11**, non da noi: il Ministero le ha già in
  quattro lingue, riga per riga, con lo stesso numero di casella. Convenzione delle chiavi:
  `campo.76.official` (da F11) e `campo.76.plain` (nostra).
- **Le spiegazioni non sono traduzioni letterali**: ogni lingua spiega il concetto come lo
  spiegherebbe una persona. Il significato non cambia mai. Se una semplificazione rischia di
  spostare il senso, va in `docs/evidence/meaning-checks.md` prima di andare a schermo.
- Ogni voce mostra **nome burocratico + spiegazione semplice**, mai solo la seconda: il nome
  ufficiale è quello che Fatou deve cercare sui documenti e che l'operatore riconosce.

Il glossario burocratese → parole semplici è pronto in
`dominio-permesso-di-soggiorno.md` §13: è la materia prima degli `ExplainPanel`, da rivedere
con `clarity-guard`, non da copiare.

## 10. Accessibilità — criteri di accettazione, non buone intenzioni

Valgono per **ogni** schermata; `a11y-auditor` li verifica prima della consegna.

- Ogni input ha un `<label>` associato; il placeholder non è mai l'unica etichetta.
- Gli errori sono annunciati (`aria-live="polite"`), dicono **cosa** è sbagliato e **cosa
  fare**, e sono raggiungibili dal campo che li ha generati.
- L'intero percorso `/` → `/riepilogo` si completa **da tastiera**; il focus è sempre visibile
  e non salta mai indietro all'inizio della pagina dopo un errore.
- Contrasto AA (4.5:1 sul testo, 3:1 su UI e bordi dei campi), testo ingrandibile al **200%**
  senza perdita di contenuto né scroll orizzontale.
- `<html lang>` aggiornato alla lingua scelta; i blocchi in altra lingua (il nome burocratico
  italiano dentro una frase francese) marcati con `lang="it"`.
- Target tattili ≥ **44px**: la persona è su uno smartphone, in piedi, all'ufficio postale.
- Nessun contenuto veicolato dal solo colore: gli stati hanno anche un'icona e una parola.

## 11. Lo slice

> Fatou sceglie il francese, dichiara di essere entrata il 18 settembre 2026 con un visto per
> lavoro subordinato, e scopre **in un minuto** che il kit postale è il canale giusto, che ha
> tempo fino al 30 settembre, che deve versare 116,46 € su tre canali diversi e quali nove
> fotocopie servono. Poi compila le caselle 3, 4 e 76–84 del Modulo 1 — le tre che la
> fermavano — e arriva a un riepilogo stampabile con i numeri di casella, la lista degli
> allegati e la frase che le dice dove spedire.

### Criteri di accettazione

Verificabili guardando lo schermo. Un criterio che si verifica solo leggendo il codice non è
un criterio.

- [ ] **A-01** La scelta della lingua in `/` cambia immediatamente tutta l'interfaccia,
      incluse le spiegazioni, e aggiorna `<html lang>`.
- [ ] **A-02** `/percorso` fa **una domanda per schermata**, con il passo indietro sempre
      disponibile e le risposte che sopravvivono a un refresh.
- [ ] **A-03** La data di ingresso rifiuta una data futura e avvisa (non blocca) oltre 90
      giorni nel passato, **spiegando** invece di mostrare un errore muto.
- [ ] **A-04** `/dove` dice "Ufficio Postale" per il codice `16` presentato dall'interessata,
      e dice "Questura, perché…" se si dichiara di presentare tramite avvocato o tutore.
- [ ] **A-05** `/scadenza` mostra la data limite a **8 giorni lavorativi**, **l'elenco dei
      giorni contati** e quelli saltati con il motivo (weekend / festività), più la data a 8
      giorni di calendario come limite prudente, con la fonte di entrambe.
- [ ] **A-06** `/costi` mostra **le quattro voci** con il canale di pagamento di ognuna, il
      bollettino unico da 70,46 € e il totale di cassa 116,46 €. Il conto è verificabile a
      occhio; nessun totale compare senza le voci che lo compongono.
- [ ] **A-07** `/documenti` cambia con la tipologia scelta; ogni voce ha **nome burocratico,
      nome semplice, com'è fatto, dove si trova**; è spuntabile con contatore persistente e
      porta il banner "checklist tipo, le Questure variano".
- [ ] **A-08** `/modulo/1` chiede cognome e nome **nell'ordine del passaporto**, mostra il
      numero di casella (3, 4) e l'esempio della MRZ, e avvisa se sembrano invertiti.
- [ ] **A-09** `/modulo/4` chiede "**dove ricevi la posta?**", spiega che lì arriva la
      raccomandata di convocazione, mostra le caselle 76–84 e avvisa (senza bloccare) se il
      CAP non è coerente con la provincia.
- [ ] **A-10** Ogni campo ha "**Non capisco**": apre l'`ExplainPanel` con la spiegazione
      estesa nella lingua scelta e la nota ufficiale che lo riguarda.
- [ ] **A-11** Dopo **due errori sullo stesso campo** l'aiuto esteso compare senza doverlo
      chiedere.
- [ ] **A-12** `/riepilogo` stampa (`@media print`) senza navigazione né bottoni, con i numeri
      di casella del MOD. 209, la proposta per la casella 25 e l'avviso sulla firma (casella 29).
- [ ] **A-13** `/riepilogo` elenca **gli errori evitati** in parole di Fatou ("l'indirizzo
      dove ricevi la posta è verificato", "il nome è nell'ordine del passaporto").
- [ ] **A-14** `/riepilogo` dice cosa fare dopo: dove si spedisce, cosa si riceve (ricevuta con
      i due codici + convocazione), cosa conservare, cosa portare alla convocazione.
- [x] ~~**A-15** `/prima` mostra il modulo com'è oggi con evidenziati i tre punti di errore, ed è
      raggiungibile dalla home e dal riepilogo.~~ — **tagliato (D-17)**: il "prima" è uno screenshot annotato del modulo ufficiale.
- [ ] **A-16** `/limiti` è compilata: non è consulenza legale · non invia nulla · non conosce lo
      stato della pratica · **il patronato fa la stessa cosa gratis** · cosa è stato
      semplificato e cosa non è stato alterato · i limiti dichiarati (festività patronali,
      variabilità per Questura, dati `[da verificare]`).
- [ ] **A-17** Il percorso `/` → `/riepilogo` si completa **da tastiera**, **in francese**,
      **senza errori in console**.
- [ ] **A-18** `npm test` verde e `npm run build` che passa.

### Fuori dallo slice (deciso, non dimenticato)

| Cosa | Perché | Cosa perdiamo |
|---|---|---|
| Caselle 85–173 (carta di soggiorno, coniuge, figli) | 88 caselle, nessuna sulla strada di Fatou | La completezza del modulo. Dichiarato in `/limiti` |
| Rinnovo, aggiornamento, conversione, duplicato | Termini e costi diversi, quattro percorsi in più | Il caso d'uso più frequente in assoluto. È la prima estensione naturale |
| Lookup dei ~200 codici Stato e dei 33 codici motivo | Data-entry lungo, valore dimostrativo basso | L'autonomia sulle caselle 16, 35, 36 fuori dalla demo |
| Tabella CAP → provincia completa | Non abbiamo una fonte aperta citabile (`sources.md`) | Il validatore dell'indirizzo copre solo le province della demo |
| Test di **regressione** sull'interfaccia | Cinque ore; non è ciò che viene valutato | La regressione la vede una persona. I test in `e2e/` verificano i **criteri**, non i componenti (B8) |
| Clip registrata da 45 secondi | La demo è **dal vivo** (deciso 2026-09-22) | La rete di sicurezza. Mitigazione: gli screenshot nel deck e il PDF di riserva |

### Budget — due tracce in parallelo, due persone

Le tracce condividono `docs/app-plan.md` §8 come contratto e si sincronizzano tre volte.
Dettaglio degli handoff in [`build-workflow.md`](./build-workflow.md).

| Blocco | Traccia | Chi lo guida | Ore | Fatto quando |
|---|---|---|---|---|
| **0** Scaffold Next.js + Tailwind + Vitest + i18n vuoto | comune | `builder` | 0:30 | `npm run dev` apre `/`, `npm test` gira a vuoto |
| **1A** `deadline.ts` + `routing.ts` + test | A · dominio | `test-author` → `builder` | 0:40 | A-05 e A-04 verificabili in console dei test |
| **1B** `layout` + `FieldCard` + `ExplainPanel` + it/fr | B · interfaccia | `builder` + `clarity-guard` | 0:40 | A-01 e A-10 visibili su una pagina di prova |
| **2A** `fees.ts` + `requirements.ts` + test | A | `test-author` → `builder` | 0:40 | A-06 e A-07 calcolabili |
| **2B** `/percorso` + `/dove` + `/scadenza` | B | `builder` | 0:40 | A-02, A-03, A-04, A-05 sullo schermo |
| **3A** `validators.ts` + `form-model` + test | A | `test-author` → `builder` | 0:40 | Tutti i codici di §8 coperti |
| **3B** `/costi` + `/documenti` | B | `builder` | 0:35 | A-06, A-07 sullo schermo |
| **4A** `/modulo/1` e `/modulo/4` + errori spiegati | A | `builder` | 0:45 | A-08, A-09, A-11 |
| **4B** `/riepilogo` + CSS di stampa | B | `builder` | 0:35 | A-12, A-13, A-14 |
| **5** `/limiti` | comune | `builder` + `clarity-guard` | 0:10 | A-16 (A-15 tagliato, D-17) |
| **6** Passata a11y + `meaning-checks.md` | comune | `a11y-auditor` + `clarity-guard` | 0:30 | `docs/evidence/` popolata |
| **8** Verifica end-to-end + screenshot | comune | `journey-verifier` | 0:30 | A-12, A-17, A-18 verificati in un browser |
| **7** Deck | comune | skill `hackathon-pitch` | 0:35 | `presentation/outputs/` consegnabile |

Somma per traccia ≈ 2:45 · wall-clock con due persone ≈ **3:35** su 5:00. Il margine sta nei
blocchi 3B e 5, sacrificabili in quest'ordine: `/documenti` diventa una lista statica,
`/prima` diventa uno screenshot annotato. **I blocchi 0–2 e 4 non sono sacrificabili**: senza
di loro non c'è un percorso da dimostrare.

## 12. Rischi

| Rischio | Segnale che sta succedendo | Piano B (già pronto, non da inventare) |
|---|---|---|
| Lo scaffold Next.js mangia più di 30 minuti | `npm run dev` non apre alle 0:35 | `npm create vite` + React Router: le rotte sono 10 file, il dominio non cambia di una riga |
| Le quattro lingue non stanno nel tempo | alle 3:00 `fr.json` è a metà | Si spedisce **it + fr** (la lingua di Fatou) complete; en/es restano con le chiavi visibili, che è il comportamento dichiarato in §9 |
| `clarity-guard` trova una DERIVA su una stringa in demo | verdetto DERIVA nel report | La stringa torna al **nome burocratico + "[in revisione]"**: burocratese visibile è meglio di senso alterato |
| Un dato normativo non ha fonte | `[da verificare]` in una schermata della demo | Si mostra con il marcatore **e si dice in demo**: è un punto a favore, non un buco. La giuria chiede sempre "come fate a saperlo" |
| I test diventano rossi a 20 minuti dalla demo | hook `run_tests.py` restituisce rosso | Si torna all'ultimo stato verde e si spedisce quello: il percorso funzionante batte la feature in più |
| La stampa salta su un browser | `/riepilogo` in anteprima di stampa perde il layout | Si dimostra la stampa su Chrome, dichiarato; `stampa.spec.ts` lo verifica prima della demo |
| **La demo dal vivo si rompe** (dev server, porta occupata, browser) | l'app non si apre in sala | Gli screenshot di `docs/evidence/before-after/` sono **già dentro il deck**, più il PDF: i sette passi si raccontano a schermo nero. Non c'è clip: questo piano B è l'unico |

## 13. Dati

Nessun dato reale, mai. I fixture usano nomi e numeri palesemente inventati
(`PASSAPORTO N. XX0000000`, `CAP 41100`, "Via delle Prove 1"). Nessuno screenshot con dati di
persone vere entra nel repo, nel deck o nella clip.

## 14. Definizione di "pronto per la demo"

- `npm run build` passa, `npm test` è verde (A-18).
- Il percorso `/` → `/riepilogo` si completa da tastiera, in francese, senza errori in
  console (A-17).
- `/limiti` compilata: è il terzo deliverable del tema (A-16).
- `docs/evidence/meaning-checks.md` popolata da `clarity-guard`, senza DERIVA aperte.
- `docs/evidence/a11y-report.md` prodotta da `a11y-auditor`, senza criteri di §10 rossi.
- `cd e2e && npm test` lanciato, con A-12 e A-17 verdi in un browser vero (B8).
- `docs/evidence/before-after/` con gli screenshot, già inseriti nel deck.
- **Nessuna clip**: la demo è dal vivo, provata due volte, con gli screenshot come piano B.
- `docs/ai-contributions.md` aggiornato: dove ha lavorato l'AI, dove è servita revisione
  umana, cosa è simulato.

## 15. Decisioni prese

Registro completo in [`decision-log.md`](./decision-log.md). In breve: Tema 01 (D-01) ·
persona Fatou, lavoro subordinato (D-02) · nessuna AI a runtime (D-03) · contenuto dalle
fonti, parole nostre (D-04) · quattro lingue scritte a mano (D-05) · stampa via CSS (D-06) ·
il dominio restituisce codici (D-07) · CAP incoerente è un avviso (D-08) · chi scrive i test
non scrive l'implementazione (D-09) · un solo file di piano (D-10) · numerazione MOD. 209
come chiave del modello dati (D-11) · bollettino e instradamento dentro lo slice (D-12) ·
etichette ufficiali da F11, spiegazioni nostre (D-13) · l'evidenza del flusso la produce un
hook (D-14).

## 16. Domande ancora aperte

1. **Provincia della demo**: proposta **MO** (Modena), coerente con il datore di lavoro di
   Fatou. Serve a rendere credibile la validazione CAP/provincia (CAP 41100 → MO).
2. **Festività**: l'elenco nazionale 2026–2027 entra come costante, ma serve una fonte
   citabile (`sources.md`). Fino ad allora la lista porta `[da verificare]`.
3. **F9–F11 in locale**: i tre PDF del MOD. 209 vanno copiati in `docs/sources/` prima della
   demo. La pagina di download ufficiale è rotta: se cade la rete, senza copia locale non
   possiamo mostrare la fonte.
4. **Durata del permesso di Fatou**: incide sul contributo (40 € o 50 €). La demo assume
   **fino a 1 anno** → bollettino 70,46 €, e mostra la doppia fonte sulle durate massime (R-34).
