# Meaning checks — semplificare senza tradire

Ogni testo utente che tocca la normativa, confrontato con la fonte di
[`docs/sources.md`](../sources.md). Verdetti: **OK** (stessa cosa, parole diverse) ·
**DERIVA** (il senso è cambiato, blocca la consegna) · **DA VERIFICARE** (nessuna fonte in
tabella lo sostiene: o si trova, o la stringa porta `[da verificare]`).

Le fonti citate alla lettera vengono da `docs/sources/` quando la copia locale esiste
(F1, F2) e dalla trascrizione integrale in `dominio-permesso-di-soggiorno.md` §4 per il
Foglio Note e la numerazione del MOD. 209. **F9 e F11 non sono nel repo**
(`sources.md`: "da copiare in `docs/sources/`"): tutto ciò che dipende da loro non è
verificabile oggi.

## Gate 2 — B1B (shell, `FieldCard`, `ExplainPanel`, casella 76) · it + fr

| id | chiave i18n | fonte | testo ufficiale (estratto) | nostro testo | tolto | verdetto |
|----|-------------|-------|----------------------------|--------------|-------|----------|
| MC-01 | `nota.r` (it = fr, citazione) | F2, nota (r) | "Indicare nome e cognome, oppure la denominazione sociale di società/ente/associazione, presso cui si vuole che venga alternativamente recapitata la raccomandata per la convocazione in Questura" | identico, minuscola iniziale perché citato dentro «…» | nulla | OK |
| MC-02 | `nota.r.traduzione` (it) | F2, nota (r) | come sopra | "Scrivi il nome di chi riceve la posta al posto tuo: una persona, oppure una società, un ente, un'associazione. A quel nome la Questura manda la raccomandata che ti convoca." | "denominazione sociale" → "il nome di una società"; resta il fatto centrale (lì arriva la **convocazione**) | OK |
| MC-03 | `nota.r.traduzione` (fr) | F2, nota (r) via italiano nostro | idem | "Écris le nom de la personne qui reçoit le courrier à ta place : … C'est à ce nom que la Questura envoie la lettre recommandée qui te convoque." | nulla rispetto all'italiano nostro; "Questura" non tradotto (nome proprio dell'ufficio) | OK |
| MC-04 | `campo.76.plain` · `campo.76.why` (it/fr) | F2, nota (r) | "presso cui si vuole che venga **alternativamente** recapitata la raccomandata per la convocazione in Questura" | "Se la posta non arriva a te, a nome di chi arriva?" + "A questo nome la Questura manda la raccomandata che ti dice quando presentarti." | "alternativamente" reso dalla condizione "se la posta non arriva a te": la facoltatività resta | OK |
| MC-05 | `campo.76.official` (it) | — (F11/F9 non nel repo) | non disponibile | "Recapito per eventuali comunicazioni — presso" | — | **DERIVA** (vedi §Deriva 1 e 2) |
| MC-06 | `campo.76.official` (fr) + `lang="it"` | F11 assente | — | stringa italiana invariata, `<span lang="it">` in `FieldCard.tsx:106`, etichetta sr-only "Nom sur le formulaire :" | marcatura di lingua presente e corretta; manca un marcatore **visibile** che è testo non tradotto, e `SourceNote` dichiara F2 anche per l'etichetta | **DA VERIFICARE** |
| MC-07 | `campo.76.explain.meaning` (it/fr) — ultima frase | F2, nota (q) | "Se uguale al precedente non compilare" | "Se la posta arriva direttamente a te, la casella resta vuota." | la condizione ufficiale è "uguale al recapito della sezione 7", non "arriva a te", e riguarda **tutta la sezione 8**, non la sola casella | **DA VERIFICARE** |
| MC-08 | `issue.PRESSO_EMPTY.*` (it/fr) | F2, nota (q) + (r) | come sopra | "La casella «presso» serve solo quando la posta arriva a nome di un'altra persona o di un ente." / "Se la raccomandata arriva a te, vai avanti così." | stessa inferenza di MC-07; severità `info`, non blocca: coerente con la facoltatività | **DA VERIFICARE** |
| MC-09 | `issue.PRESSO_NOT_A_NAME.*` (it/fr) | F2, nota (r) | "Indicare nome e cognome, oppure la denominazione sociale…" | "Qui il modulo chiede un nome, non una via: è il nome a cui la Questura consegna la raccomandata di convocazione." + cosa fare | nulla; le tre parti (notato · perché · cosa fare) ci sono in entrambe le lingue | OK |
| MC-10 | `campo.76.example` (it/fr) | — (esempio, non normativo) | — | "Mariama Diallo Esempio… Associazione Esempio." | dati palesemente finti, nessun dato reale | OK |
| MC-11 | `modulo.4.provvisorio` (it/fr) | — (dichiarazione di mock) | — | "I controlli di questa pagina sono provvisori: le regole vere arrivano dal blocco di dominio." | `controlloProvvisorio()` è dichiarato a schermo e in `ai-contributions.md`: nessuna pretesa di regola di legge | OK |
| MC-12 | shell: `app.title` · `shell.skip` · `shell.limiti` · `home.h1` · `home.intro` · `home.cta` · `nav.*` (it/fr) | — (nessuna affermazione normativa: nessun importo, termine o elenco) | — | vedi `it.json` / `fr.json` | niente numeri, niente scadenze, niente "ti conviene"/"la scelta migliore"/previsioni sull'esito | OK |
| MC-13 | parità chiavi it ↔ fr | — | — | 41 chiavi identiche, nessuna condizione caduta, tono alla seconda persona in entrambe | il francese parte dall'italiano nostro, non dal burocratese | OK |

## DERIVA aperte

### Deriva 1 — la casella potrebbe essere la 77, non la 76 *(rischio per la persona)*

| | |
|---|---|
| **Testo ufficiale** (`dominio-permesso-di-soggiorno.md` §4, struttura MOD. 209 Modulo 1) | Sezione **8** "Recapito per eventuali comunicazioni **(q)**" = campi **76–84**, con dettaglio "**77 PRESSO (r)**· 78 provincia · 79 comune …" |
| **Nostro testo** | chip "casella 76" + nota (r) + domanda sul *presso* → la 76 viene presentata come la casella del *presso* |
| **Perché conta** | Fatou copia il numero sul modulo cartaceo. Se il *presso* è la 77, le stiamo indicando la casella sbagliata: scrive un nome dove il modulo vuole l'intestazione di sezione, e la raccomandata di convocazione può non arrivare. |
| **Correzione proposta** | Aprire F9 (`Modulo_1.pdf`, URL diretto in `sources.md`), copiarlo in `docs/sources/`, e verificare la numerazione. Se il *presso* è la 77: `casella={77}`, chiavi `campo.77.*`, e `docs/specs/B1B` va corretto (è lo spec ad aver detto 76). Finché F9 non è nel repo, il chip deve portare `[da verificare]`. |

Nota: `dominio-permesso-di-soggiorno.md` §4 è ambiguo con sé stesso — la riga in prosa
usa `campo_209_76 = recapito per comunicazioni` (la **sezione**), la tabella dà 77 al
*presso*. Non si risolve scegliendo: si apre F9.

### Deriva 2 — l'etichetta ufficiale della casella non ha fonte nel repo

| | |
|---|---|
| **Testo ufficiale** | non disponibile: F9 e F11 sono in `sources.md` ma **non** in `docs/sources/` |
| **Nostro testo** | `campo.76.official` = "Recapito per eventuali comunicazioni — presso" |
| **Perché conta** | La stringa fonde l'intestazione di sezione ("Recapito per eventuali comunicazioni", nota q) con il nome della casella ("PRESSO", nota r): è una nostra composizione presentata come *nome sul modulo*. Il nome burocratico è esattamente ciò che la persona cerca sul foglio e che l'operatore riconosce: non può essere nostro. |
| **Correzione proposta** | Etichetta presa alla lettera da F9/F11 e `SourceNote source="F11"` su quella riga (oggi la card dichiara solo `source="F2" detail="nota (r)"`, che copre la nota, non l'etichetta). Nel frattempo: `[da verificare]` accanto all'etichetta, in tutte e quattro le lingue. |

## Da verificare — riepilogo

- MC-06 · in francese l'etichetta italiana è marcata `lang="it"` (corretto) ma non è
  **visibilmente** dichiarata come non tradotta. Proposta: riga `SourceNote` dedicata,
  `F11 · [da verificare]`, invece di lasciarla sotto F2.
- MC-07 / MC-08 · la condizione "la casella resta vuota se la posta arriva a te" è una
  nostra inferenza. La fonte (nota q) dice "se uguale al precedente non compilare", che è
  una condizione diversa e su tutta la sezione. Proposta: riformulare su (q) —
  *"Se la posta ti arriva all'indirizzo che hai già scritto prima, non compili queste
  caselle"* — oppure aggiungere `[da verificare]`.

## Fuori scope di questo gate

- `en.json` contiene **una sola chiave** (`app.title`); lo spec B1B chiedeva "le chiavi
  presenti ma vuote". Non è una deriva di significato (una chiave mancante rende la chiave
  stessa, non testo italiano silenzioso: `LanguageProvider.tsx:43`), ma è una difformità da
  segnalare a chi costruisce.
- `es.json` non controllato in questo gate: nessuna chiave nuova.
