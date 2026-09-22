# B1B — Shell, `FieldCard`, `ExplainPanel`, it + fr

> Blocco 1B · traccia B · 0:40 · `builder`, poi `clarity-guard` sulle chiavi nuove
> Parallelizzabile con B1A (file disgiunti).
> **Spec chiuso.** Riferimento di comportamento: `docs/ux-spec.md` §4, §5, §6 — l'unico file
> esterno da aprire. Non aprire `app-plan.md` né il dossier di dominio.

## Obiettivo

I due componenti su cui poggiano tutte le schermate, più il dizionario italiano e francese
che li riempie. Alla fine di questo blocco una pagina di prova mostra un `FieldCard`
completo che si comporta come descritto in `ux-spec.md` §4.

## Criteri da soddisfare

- [ ] **A-01** La scelta della lingua in `/` cambia immediatamente tutta l'interfaccia,
      incluse le spiegazioni, e aggiorna `<html lang>`.
- [ ] **A-10** Ogni campo ha "**Non capisco**": apre l'`ExplainPanel` con la spiegazione
      estesa nella lingua scelta e la nota ufficiale che lo riguarda.
- [ ] **A-11** Dopo **due errori sullo stesso campo** l'aiuto esteso compare senza doverlo
      chiedere.

## Cosa costruisci

### `FieldCard`

```tsx
<FieldCard
  casella={76}                     // numero ufficiale MOD. 209, sempre visibile
  labelKey="campo.76.plain"        // la domanda in parole nostre
  officialKey="campo.76.official"  // il nome burocratico (traduzione ufficiale F11)
  noteKey="nota.r"                 // la nota ufficiale che riguarda il campo
  whyKey="campo.76.why"
  exampleKey="campo.76.example"
  issues={Issue[]}                 // già filtrate per questa casella
  value={string} onChange onBlur
/>
```

Ordine verticale non negoziabile (`ux-spec.md` §5): la domanda (`<label htmlFor>`) · il nome
burocratico in mono con il chip `casella 77` · perché serve, una riga · il campo (48px) ·
l'esempio · il blocco issue · il bottone testuale "Non capisco questa domanda".

Comportamento (`ux-spec.md` §4): la validazione scatta **al `blur`**, non a ogni tasto. Un
`warning` non impedisce di continuare. Al **secondo** `error` sullo stesso campo
l'`ExplainPanel` si apre da solo **e resta aperto**. Il focus **non si sposta** da solo.

Accessibilità: `aria-describedby` → esempio + issue + nota; `aria-invalid` **solo** sugli
`error`; nessun `placeholder` che ripete l'etichetta; target ≥ 44px.

### `ExplainPanel`

Disclosure in linea (`aria-expanded` + `aria-controls`), **mai un modale**: su smartphone un
modale copre il campo di cui sta parlando. Chiudibile con `Esc` e con un bottone, senza focus
trap. Fondo `accent-weak`, bordo sinistro 3px `accent`.

Contiene, in quest'ordine: cosa vuol dire · l'istruzione ufficiale citata alla lettera · cosa
fare adesso · la fonte.

### `IssueBlock`

Tre varianti (`error` · `warning` · `info`), ognuna con **icona + parola + colore**: mai il
colore da solo. `role="alert"` su `error`, `aria-live="polite"` sul resto.

Il testo ha **tre parti, sempre tutte e tre** (`ux-spec.md` §6): cosa abbiamo notato · perché
conta · cosa fare.

### `SourceNote`

`Fonte: F1 · Polizia di Stato`, piccolo, `ink-soft`. La prop è **obbligatoria** e accetta
`"da-verificare"` come valore esplicito, che rende `[da verificare]` in `warn`. Non si può
passare `undefined` silenziosamente: è il componente che rende vera la regola "nessun numero
senza fonte".

### `LanguageSwitcher` (completamento)

Quattro bottoni (non un `<select>`), ognuno con la propria lingua e il proprio attributo
`lang`. Al cambio: aggiorna `<html lang>`, **mantiene la rotta e le risposte**, sposta il
focus sul titolo della pagina.

## Testi: it + fr

Chiavi in `it.json` e `fr.json`, **stesse chiavi**. `en.json` ed `es.json` restano con le
chiavi presenti ma vuote: mancano visibilmente, come deciso.

Convenzione: `campo.<n>.official` (traduzione ufficiale del Ministero) e `campo.<n>.plain`
(nostra). In questo blocco servono solo le chiavi della casella 77 e quelle della shell.

Le tre regole del testo (`ux-spec.md` §6):
- seconda persona singolare, presente indicativo;
- **il nome burocratico non si toglie mai**, si aggiunge il significato;
- vietati "ti conviene", "la scelta migliore", "probabilmente", previsioni sull'esito,
  "è facile".

Il francese parte dall'**italiano nostro semplificato**, non dal burocratese: tradurre il
burocratese produce burocratese in un'altra lingua. Se una frase italiana in un contesto
francese resta (il nome burocratico), porta `lang="it"`.

## La pagina di prova

`/modulo/4` provvisoria, con il `FieldCard` della casella 77 e `issues` presi da
`app/src/fixtures/sample-answers.ts`. Il dominio arriva in B3A: qui si programma contro le
firme, con dati finti e dichiaratamente finti.

## File

**Puoi scrivere in:** `app/src/components/`, `app/src/i18n/`, `app/src/app/layout.tsx`,
`app/src/app/page.tsx`, `app/src/app/modulo/`, `app/src/app/globals.css`.
**Non toccare:** `app/src/domain/`, `app/src/data/`, `app/tests/` (traccia A).

## Poi: `clarity-guard`

Sulle chiavi nuove, contro le fonti. Attenzione particolare alla casella 77: la nota
ufficiale (r) dice *"indicare nome e cognome, oppure la denominazione sociale di
società/ente/associazione, presso cui si vuole che venga alternativamente recapitata la
raccomandata per la convocazione in Questura"*. La nostra versione può aggiungere parole, non
può perdere il fatto che lì arriva **la convocazione**.

## Fatto quando

1. `/` in francese: tutta l'interfaccia è in francese, `<html lang="fr">`.
2. `/modulo/4`: il `FieldCard` mostra chip `casella 77`, nome burocratico, domanda semplice,
   esempio, bottone "Non capisco".
3. Due errori di seguito sullo stesso campo → l'`ExplainPanel` si apre da solo.
4. Solo tastiera: `Tab` raggiunge campo, "Non capisco", e i bottoni di navigazione. Il focus
   si vede sempre.
5. `npm run build` passa.

## Restituisci

```
SPEC: B1B
CRITERI ORA VERIFICABILI:
FILE TOCCATI:
TEST:
MOCK:
FUORI:
COMANDO:
```
