# Specifica UI/UX

## Perché questo file esiste

[`app-plan.md`](./app-plan.md) dice **cosa** costruire e con quali criteri. Questo file dice
**com'è fatto e come si comporta**. Serve per due motivi concreti:

1. Un agente che riceve solo il piano produce l'interfaccia media di un template: card
   arrotondate, viola, un'icona per ogni titolo, tre colonne. Sarebbe la barriera di sempre
   con un tema nuovo.
2. Per questo prodotto microcopy e accessibilità **sono** la funzione. Un messaggio d'errore
   che non dice cosa fare è un requisito non soddisfatto (A-11, §10 del piano), non una
   rifinitura.

Lo leggono `builder` e `a11y-auditor` prima di toccare un componente. Per le decisioni
estetiche non coperte qui si usa la skill `frontend-design`; per il testo che finisce a
schermo, `clarity-guard` ha l'ultima parola.

---

## 1. I cinque principi

Derivano dalla persona ([`persona.md`](./persona.md)), non da una moodboard.

| # | Principio | Cosa vuol dire in pratica | Cosa vieta |
|---|---|---|---|
| 1 | **Una decisione per schermata** | La schermata fa una domanda e mostra ciò che serve per risponderla | Form con sei campi, accordion, tab |
| 2 | **Il modulo di carta resta visibile** | Ogni campo mostra il suo **numero di casella** del MOD. 209. Fatou deve poter trascrivere sul cartaceo e parlare con l'operatore | Nascondere la provenienza per "semplificare" |
| 3 | **Nessun numero senza le sue voci** | Un totale compare sempre con il calcolo aperto; un dato normativo con la fonte accanto | Cifre calate dall'alto, badge "verificato" |
| 4 | **L'errore è contenuto, non allarme** | Dice cos'è, perché conta, cosa fare. Colore e icona insieme, mai il colore da solo | Bordo rosso muto, "campo non valido", punti esclamativi |
| 5 | **Si spiega, non si consiglia** | Frasi dichiarative sulla procedura | "Ti conviene", "la scelta migliore", previsioni sull'esito |

## 2. Direzione visiva

Il motivo conduttore è **la casella numerata del modulo**: è ciò che Fatou ha davanti sul
tavolo. L'interfaccia non finge di essere un'altra cosa — è lo stesso modulo, srotolato in
passi e spiegato. Riferimento visivo: carta e inchiostro, non dashboard.

### Colore

Token in `tailwind.config.ts`, usati solo per il ruolo dichiarato.

| Token | Valore | Ruolo |
|---|---|---|
| `ink` | `#1A1A1A` | testo principale su bianco |
| `ink-soft` | `#4A4A4A` | testo secondario, "com'è fatto", fonti |
| `paper` | `#FFFFFF` | fondo dei campi e della stampa |
| `paper-warm` | `#F5F2EC` | fondo pagina: carta, non grigio d'interfaccia |
| `rule` | `#D8D2C7` | bordi, righe di tabella, linee del modulo |
| `accent` | `#0F5D5A` | un solo accento: azione primaria, link, focus dei passi |
| `accent-weak` | `#E3EFEE` | fondo dei pannelli di spiegazione |
| `alert` | `#B3261E` | errore: l'istanza verrebbe respinta |
| `alert-weak` | `#FCEFEE` | fondo del blocco errore |
| `warn` | `#7A4B00` | avviso: controlla, non è un blocco |
| `warn-weak` | `#FFF4E0` | fondo del blocco avviso |
| `ok` | `#1E6B3A` | confermato, spuntato, "errore evitato" |
| `focus` | `#0B4F8A` | anello di focus, 3px, offset 2px |

**Un solo accento.** Se serve un secondo colore per distinguere due cose, sono due cose che
vanno distinte con una parola, non con una tinta.

Contrasti attesi: testo ≥ 4.5:1, bordi dei campi e icone di stato ≥ 3:1. Sono **attesi, non
dichiarati**: il blocco 6 del budget li misura e il risultato va in
`docs/evidence/a11y-report.md`. Se un token non passa, si cambia il token, non il criterio.

### Tipografia

Stack di sistema (`ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif`). Nessun webfont:
niente richiesta di rete durante la demo, niente testo che salta al caricamento, niente
dipendenza da un CDN in una stanza con il wifi degli ospiti. Il carattere lo dà la
**disciplina della scala**, non il font.

| Uso | Dimensione | Peso | Note |
|---|---|---|---|
| Domanda della schermata | `clamp(1.5rem, 4vw, 2rem)` | 600 | è l'unico H1 della pagina |
| Testo corrente | `1.0625rem` (17px) | 400 | **mai sotto 16px**, nessuna eccezione |
| Spiegazione, "com'è fatto" | `1rem` | 400 | `ink-soft` |
| Nome burocratico | `0.9375rem` | 500 | `font-mono`, `ink-soft`, sempre presente |
| Numero di casella | `0.8125rem` | 600 | `font-mono`, chip con bordo `rule` |
| Importi e date | `1.25rem` | 600 | `font-variant-numeric: tabular-nums` |

Misura di riga: **max ~70 caratteri** (`max-w-[40rem]`). Un A2 che legge una riga di 90
caratteri perde il segno; allargata da 34rem/62 caratteri per dare respiro allo schermo
desktop, resta lontana da quella soglia.

> ⚠️ **Da riconciliare (22/09, pomeriggio)**: questa riga e il D-18 in
> `docs/decision-log.md` sono stati scritti in parallelo da due sessioni diverse e si
> contraddicono — il D-18 propone un layout a due colonne (colonna di lettura a 62
> caratteri + colonna laterale da 1024px in su) e scarta esplicitamente l'allargamento
> applicato qui. Il codice attuale (`layout.tsx`, `SiteHeader`, `SiteFooter`) implementa
> **questa** riga (colonna unica a 40rem), non il D-18. Chi tocca per primo il layout dopo
> aver letto questo avviso: decide, applica, e cancella l'avviso.

### Spazio e forma

- Griglia base **8px**. Mobile-first: una colonna fino a 640px, colonna centrata e più
  respiro sopra.
- Raggio `4px` su campi e bottoni, `0` sulle tabelle. La carta non ha angoli da 16px.
- Ombre: **nessuna**, tranne 1px di bordo. La gerarchia la fa lo spazio.
- Bottone primario: altezza **48px**, padding orizzontale 24px, larghezza piena su mobile.
- Ogni target tattile ≥ **44 × 44px**, checkbox comprese (l'area cliccabile include l'etichetta).
- Movimento: solo `opacity` e `transform` ≤ 150ms, azzerati sotto
  `@media (prefers-reduced-motion: reduce)`. Nessuna transizione di pagina.

### Cosa NON facciamo (la lista anti-template)

Gradienti · viola/indaco di default · glassmorphism · un'emoji o un'icona per ogni titolo ·
card con ombra dentro card con ombra · "🎉 Fatto!" · illustrazioni stock di persone felici ·
barre di progresso animate · dark mode (non è nello slice, e mezza dark mode è peggio di
nessuna) · font display · numeri grandi senza le voci che li compongono (principio 3).

## 3. Anatomia della schermata

```
┌──────────────────────────────────────┐
│ skip-link (visibile al focus)        │
│ ── header ───────────────────────────│
│  Kit postale · permesso di soggiorno │  ← testo, non logo
│  [ IT  EN  FR  ES ]                  │  ← LanguageSwitcher
│ ── DeadlineBanner ───────────────────│  ← da /percorso in poi, su ogni pagina
│  Hai tempo fino a martedì 30 set.    │
│  6 giorni lavorativi rimasti  Fonte  │
│ ── StepProgress ─────────────────────│  ← solo nel wizard
│  Passo 4 di 7 · circa 2 minuti       │
│ ── main (h1 = la domanda) ───────────│
│  Dove ricevi la posta?               │
│  [ FieldCard ]                       │
│  [ blocco errore / avviso ]          │
│ ── azioni ───────────────────────────│
│  ← Indietro           Continua →     │  ← primaria a destra, sempre nello stesso posto
│ ── footer ───────────────────────────│
│  Cosa non fa questo strumento · Fonti│  ← /limiti linkata da ogni pagina
└──────────────────────────────────────┘
```

Regole della shell:

- Un solo `<h1>` per pagina: **è la domanda**. Le sezioni sono `<h2>`.
- `DeadlineBanner` è informativo, non un countdown: nessun rosso, nessun secondo che scorre.
  Quando i giorni rimanenti vanno sotto 2 cambia parola ("oggi è l'ultimo giorno utile"), non
  colore d'allarme.
- I bottoni di navigazione stanno **sempre nella stessa posizione**. Un elemento che si
  sposta fra i passi costa più di una spiegazione in meno.
- Il footer porta `/limiti` da ogni pagina (A-16) e il link alle fonti della schermata.

## 4. Il ciclo di vita di un campo

È il comportamento che vale il criterio A-11. Macchina a stati di `FieldCard`:

```
vuoto ──digita──> in compilazione ──esci dal campo──> validazione
                                                        │
                        ┌───────────────────────────────┼──────────────────┐
                        ▼                               ▼                  ▼
                   nessun issue                   warning/info          error
                        │                               │                  │
                   confermato                    avviso + continua    blocco + cosa fare
                        │                               │                  │
                        └──────── secondo error sullo stesso campo ────────┘
                                             │
                                  ExplainPanel aperto da solo
```

- La validazione scatta **all'uscita dal campo** (`blur`) e alla conferma, **non a ogni
  tasto**: un errore che appare alla terza lettera del cognome insegna che si sta sbagliando
  mentre si sta solo scrivendo.
- Un `warning` **non impedisce di continuare**: è il caso di Fatou con il CAP di un'altra
  provincia (D-08). Il bottone resta "Continua", accanto compare "Ho controllato, è giusto".
- Il contatore degli errori è per campo e vive nello stato di sessione. Al secondo errore
  l'`ExplainPanel` si apre da solo **e resta aperto** — non si richiude al terzo tentativo.
- Il focus **non si sposta** da solo. L'errore è annunciato via `aria-live`, non rubando il
  cursore a chi sta ancora scrivendo.

## 5. Inventario dei componenti

Ogni componente ha: firma, stati, contratto di accessibilità. Nessuna libreria di UI.

### `FieldCard`

Il componente centrale. Un campo per schermata.

```tsx
<FieldCard
  casella={76}                 // R-08 · numero ufficiale MOD. 209
  labelKey="campo.76.plain"    // "Dove ricevi la posta?"  (nostra)
  officialKey="campo.76.official" // "Recapito per eventuali comunicazioni" (F11)
  noteKey="nota.r"             // la nota ufficiale che riguarda il campo
  whyKey="campo.76.why"        // "Qui arriva la lettera che ti dice quando andare in Questura"
  exampleKey="campo.76.example"
  issues={Issue[]}             // dal dominio, già filtrate per questa casella
  value={string} onChange onBlur
/>
```

Ordine verticale, non negoziabile:

1. **La domanda** in parole nostre (`<label>`, sempre collegata via `htmlFor`).
2. **Il nome burocratico** in mono, con il chip `casella 76`. Se la frase è in francese, il
   nome italiano porta `lang="it"`.
3. **Perché serve**, una riga.
4. **Il campo**, altezza 48px, bordo `rule` 1px, `2px` in `accent` al focus più l'anello.
5. **L'esempio**, in `ink-soft`, con dati palesemente finti.
6. **Il blocco issue** (§6), se ce n'è.
7. **"Non capisco"** — bottone testuale, non icona, che apre `ExplainPanel`. Il testo dice
   cosa fa: "Non capisco questa domanda".

Accessibilità: `aria-describedby` punta a esempio + issue + nota; `aria-invalid` solo sugli
`error`, non sui `warning`; nessun `placeholder` che ripete l'etichetta.

### `ExplainPanel`

Spiegazione estesa di un termine burocratico. Apertura in linea (`<details>` nativo o un
disclosure con `aria-expanded` + `aria-controls`), **mai un modale**: un modale su smartphone
nasconde il campo di cui sta parlando.

Contiene, in quest'ordine: cosa vuol dire (glossario, §13 del dossier) · l'istruzione
ufficiale citata alla lettera · cosa fare adesso · la fonte (`F2 · Foglio Note, nota (r)`).
Fondo `accent-weak`, bordo sinistro 3px `accent`. Chiudibile con `Esc` e con un bottone di
chiusura, senza focus trap.

### `IssueBlock`

Vedi §6 per il testo. Tre varianti (`error` · `warning` · `info`), ognuna con **icona +
parola + colore**: mai il colore da solo. `role="alert"` per `error`, `aria-live="polite"`
per il resto.

### `DeadlineBanner`

`giorni rimanenti` · data limite in formato lungo e locale · link "come l'abbiamo calcolata" →
`/scadenza`. Porta la fonte (R-01). Sotto i 2 giorni cambia la frase, non il colore.
`aria-live="off"`: non deve annunciarsi a ogni cambio di pagina.

### `StepProgress`

"Passo 4 di 7 · circa 2 minuti". `<nav aria-label>` + `<ol>`, il passo corrente con
`aria-current="step"`. Nessuna barra animata: il testo dice più di una barra e si legge allo
zoom 200%.

### `ChecklistItem`

Per `/documenti` (A-07). Checkbox 24px con area cliccabile ≥ 44px estesa all'etichetta.
Quattro informazioni, sempre tutte e quattro: **nome semplice** (grassetto) · **nome
burocratico** (mono) · **com'è fatto** · **dove si trova**. Un badge testuale distingue
"fotocopia nella busta" da "originale alla convocazione" (R-25). Contatore sopra la lista:
"3 di 9 pronti", `aria-live="polite"`.

### `FeeTable`

Per `/costi` (A-06). Una `<table>` vera, con `<caption>` e intestazioni di riga. Una riga per
voce: importo (`tabular-nums`), **dove si paga** (tabaccheria / bollettino c/c 67422402 /
cassa di Poste), fonte. Due totali separati e etichettati: **bollettino unico** e **totale di
cassa**. Nessun totale senza le sue righe (principio 3). Le esenzioni (R-21) sono una nota
sotto la tabella, non una riga fantasma.

### `SourceNote`

Il componente che rende vera la regola "nessun numero senza fonte". Testo piccolo,
`ink-soft`: `Fonte: F1 · Polizia di Stato` con link a `sources.md`. Quando la fonte manca
mostra `[da verificare]` in `warn`, e **non si può passare `undefined` silenziosamente**: la
prop è obbligatoria e accetta `"da-verificare"` come valore esplicito.

### `LanguageSwitcher`

Quattro bottoni, non un `<select>`: quattro target da 44px si premono con il pollice e si
vedono tutti insieme. Ogni voce nella **propria** lingua (Italiano · English · Français ·
Español) con `lang` sul bottone. Al cambio: aggiorna `<html lang>`, mantiene la rotta e le
risposte, sposta il focus sul titolo della pagina, annuncia il cambio.

## 6. Come si scrive un messaggio

Tre parti, in quest'ordine. Mai meno di tre.

```
[cosa abbiamo notato]  Il CAP 20100 è di Milano, ma hai scelto la provincia MO (Modena).
[perché conta]         La Questura manda la convocazione all'indirizzo di questa sezione.
[cosa fare]            Se ricevi la posta a Milano va bene così: conferma. Altrimenti correggi il CAP.
```

Regole del testo utente:

- **Seconda persona singolare, presente indicativo.** Niente condizionale ("dovresti"),
  niente impersonale ("è necessario che").
- **Il nome burocratico non si toglie mai**, si aggiunge il significato: "la comunicazione che
  il datore di lavoro ha mandato allo Stato quando ti ha assunto (**modello UNILAV**)".
- **Vietati**: "ti conviene", "la scelta migliore", "probabilmente", "dovrebbe andare bene",
  qualsiasi previsione sull'esito o sui tempi della singola Questura, "semplice", "facile"
  ("è facile" detto a chi è bloccato è una piccola offesa).
- **Numeri e date sempre in cifre e per esteso**: "martedì 30 settembre 2026", non "30/09".
- **Niente maiuscolo**: `SCRIVERE IN STAMPATELLO` è una citazione del modulo, non il nostro tono.
- Ogni stringa con un numero normativo porta il `SourceNote` o `[da verificare]`.

Le stesse regole valgono per en · fr · es. La traduzione parte dalla **nostra** versione
italiana semplificata, mai dal burocratese (§9 del piano), e `clarity-guard` confronta ogni
lingua con l'italiano nostro, non con l'originale ufficiale.

## 7. Navigazione e persistenza

- Un passo = una **URL**. Il tasto Indietro del browser fa il passo indietro: su smartphone è
  il gesto che la gente usa comunque, e se lo strumento perde i dati lì, li perde davvero.
- Tutte le risposte in `localStorage`, chiave unica versionata (`kit209.v1`), scritte a ogni
  `blur`. Nessun dato lascia il dispositivo — e `/limiti` lo dice.
- Un badge discreto "le tue risposte restano su questo telefono" su `/percorso`, una volta.
- Entrare su `/modulo/4` senza aver fatto `/percorso` non è un errore: si spiega cosa manca e
  si offre il link, non si fa un redirect silenzioso.
- Nessun autosalvataggio invisibile di ciò che non è stato confermato: la casella 25 e la
  firma (casella 29) restano `info` finché la persona non conferma (R-11, R-13).

## 8. `/prima` — la schermata che deve sembrare vecchia

È l'unica pagina che **non** segue questa specifica, e lo fa per un motivo: mostra il modulo
com'è oggi (A-15). Riproduzione fedele e sobria — griglia di caselle numerate, mono, righe
`rule`, densità alta, nessuna spiegazione — con **tre annotazioni** in `alert` sui punti 3–4
(nome), 16 (codice tipologia) e 76–84 (recapito). Sotto, un bottone: "Vedi com'è adesso".

Nessuna caricatura: il modulo non è ridicolo, è solo scritto per chi lo amministra. Esagerarlo
farebbe perdere il punto e insulterebbe chi ci lavora.

## 9. Stampa

`@media print` è un requisito (A-12), non un extra.

- Via: header, footer, `LanguageSwitcher`, bottoni, `ExplainPanel` chiusi, `DeadlineBanner`.
- Resta: i dati nella forma del modulo, **ogni valore accanto al suo numero di casella**, la
  proposta per la casella 25, l'avviso sulla firma (casella 29), la checklist degli allegati
  con le caselle da spuntare a penna, la data di scadenza.
- Nero su bianco, `12pt`, A4, margini 15mm. I link diventano testo con l'URL fra parentesi.
- Fatou non ha una stampante: la pagina deve essere leggibile **anche a schermo** e stampabile
  da un internet point o dal datore di lavoro. Niente che dipenda dal colore.

## 10. Checklist di accessibilità per componente

`a11y-auditor` verifica questa tabella e scrive `docs/evidence/a11y-report.md`.

| Componente | Cosa si verifica |
|---|---|
| shell | un solo `h1`; skip-link primo nel DOM e visibile al focus; `<html lang>` corretto |
| `FieldCard` | `label`/`htmlFor`; `aria-describedby` completo; `aria-invalid` solo su `error`; target ≥ 44px |
| `IssueBlock` | `role="alert"` su error, `aria-live="polite"` altrimenti; icona + parola + colore |
| `ExplainPanel` | `aria-expanded` + `aria-controls`; chiusura con `Esc`; nessun focus trap; non è un modale |
| `ChecklistItem` | checkbox nativa; etichetta cliccabile; contatore annunciato |
| `FeeTable` | `<table>` con `<caption>` e `<th scope>`; importi leggibili senza colore |
| `LanguageSwitcher` | `lang` su ogni voce; focus gestito al cambio; rotta e dati preservati |
| percorso intero | completabile **solo da tastiera**, in francese, senza errori in console (A-17) |
| zoom | 200% senza scroll orizzontale né contenuto tagliato |
| contrasto | ogni token di §2 misurato, risultato nel report |

## 11. Cosa resta fuori

Dark mode · animazioni di transizione · componenti di libreria (shadcn, MUI) · icon set
completo (servono cinque icone, si scrivono inline) · temi personalizzabili · onboarding
tour · toast. Ognuna costa tempo ai criteri di §11 del piano e nessuna è su un criterio.
