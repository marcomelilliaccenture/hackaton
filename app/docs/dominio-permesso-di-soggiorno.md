# Dominio — pratica del permesso di soggiorno (kit postale MOD. 209)

Dossier di ricerca raccolto il **22 settembre 2026** per alimentare la definizione del
prodotto e delle automazioni. Non è un piano: è la **base fattuale** su cui si decide.
Il piano dell'app vive in [`app-plan.md`](./app-plan.md); il brief in
[`challenge-brief.md`](./challenge-brief.md) vince su tutto.

## Come usare questo file (istruzioni per chi legge, umano o AI)

1. Ogni affermazione porta la **fonte** fra parentesi. Dove la fonte manca o è secondaria,
   c'è `[da verificare]`: quella dicitura va riportata anche nella UI, non rimossa.
2. Le sezioni §4–§8 e §10 sono **dati citabili**: numeri, codici, elenchi di campi. Sono la
   materia prima per `domain/` (validatori, scadenze, checklist).
3. Le sezioni §11–§13 sono **derivate** (analisi, non fonte): attriti, automazioni candidate,
   glossario. Vanno discusse, non copiate come verità.
4. Cinque conflitti tra fonti ufficiali sono elencati in §9. Non vanno "risolti" scegliendo il
   numero più comodo: si mostra il più prudente e si cita.

---

## 1. Fonti ufficiali (URL verificati)

Stato HTTP verificato con `curl` il 22/09/2026.

| Fonte | URL | Note |
|---|---|---|
| Portale Immigrazione — La Procedura | https://www.portaleimmigrazione.it/ITA/nuovaProcedura.html | Descrizione ufficiale del kit postale. Contiene segnaposto redazionali non risolti ("(inserire il link col PDF)") |
| Portale Immigrazione — Tabella costi | https://www.portaleimmigrazione.it/ITA/tabelleCosti.html | Importi ufficiali; contiene due errori aritmetici (§6) |
| Portale Immigrazione — Tipologie via Ufficio Postale | https://www.portaleimmigrazione.it/ITA/tabellauffpostali.html | "ultimo aggiornamento: 30 maggio 2024" |
| Portale Immigrazione — Tipologie solo in Questura | https://www.portaleimmigrazione.it/ITA/tabellaMotiviTipologie.html | Tabella 2B |
| **MOD. 209 — Modulo 1** (il modulo) | https://www.portaleimmigrazione.it/media/documentazione/Modulo_1.pdf | 200 OK, 3,8 MB |
| **MOD. 209 — Modulo 2** (il modulo) | https://www.portaleimmigrazione.it/media/documentazione/Modulo_2.pdf | 200 OK, 726 KB, 3 pagine |
| **MOD. 209 — Istruzioni multilingue** (IT/EN/FR/ES) | https://www.portaleimmigrazione.it/media/documentazione/MOD_209_Multilingue.pdf | 200 OK, 1,2 MB, 10 pagine. Traduzioni ufficiali riga per riga |
| **Informativa Generale** (+ Foglio Note + tabelle) | https://www.portaleimmigrazione.it/media/documentazione/Informativa_Generale.pdf | 200 OK, 2,4 MB. `Mod. 01250F - Ed. 5/19`, XMP modificato 06/05/2021 |
| Poste — Guida rilascio e rinnovo | https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno | Versione EN: `/guide-to-obtaining-and-renewing-residence-permits` |
| Poste — Elenco uffici Sportello Amico (PDF) | https://www.media.poste.it/874e8567-8617-4e1a-85f5-804f51d91a57/file/RETE-SPORTELLO-AMICO | |
| Poste — Cerca ufficio | https://www.poste.it/cerca-mappe-app/?vieni-in-poste&services=103 | |
| Polizia di Stato — Il rilascio del permesso | https://www.poliziadistato.it/articolo/225 | modificato il 05/01/2024. PDF: `/articolo/pdf/225` |
| Polizia di Stato — Verifica stato pratica | https://questure.poliziadistato.it/stranieri/ | Vedi §8 |
| Polizia di Stato — Controlla online il permesso | https://www.poliziadistato.it/articolo/controlla-online-il-permesso-di-soggiorno | |
| Polizia di Stato — Modulo dichiarazione di presenza | https://www.poliziadistato.it/statics/10/moduldich.pdf | 200 OK. Per soggiorni ≤ 3 mesi (turismo, affari, visite, studio breve) |
| Checklist documenti per tipologia (A) | https://questure.poliziadistato.it/statics/29/documenti-da-inserire-nel-kit-postale-per-le-principali-tipologie-di-permesso-di-soggiorno.pdf | 4 pagine, metadati 19/03/2024 |
| Checklist documenti per tipologia (B) | https://questure.poliziadistato.it/statics/27/documenti_per_rilascio_permessi_di_soggiorno_da_richiedere_con_kit_postale.pdf?lang=it | 4 pagine. **Documento di una singola Questura** (cita il Comune di Rovigo): modello, non norma nazionale |
| Circolare rimborso contributo | https://www.poliziadistato.it/statics/49/circolare-contributo-permesso-di-soggiorno-rimborso-istanze-e-modulo.pdf | |
| Circolare PSE individuale per minori | https://www.poliziadistato.it/statics/34/circolare-pse-individuale-per-minori-stranieri-33530.pdf | |
| Portale ALI / Sportello Unico Immigrazione | https://portaleservizi.dlci.interno.it/AliSportello/ali/home.htm | Accesso SPID/CIE. Nulla osta lavoro, ricongiungimento, cittadinanza, test italiano |
| Modulo N — nulla osta nominativo lavoro subordinato (info) | https://www1.interno.gov.it/mininterno/export/sites/default/it/assets/files/15/0640_infoN.pdf | |
| Agenzia Entrate — codice fiscale | https://www.agenziaentrate.gov.it/portale/codice-fiscale-e-tessera-sanitaria/che-cos- | |
| Agenzia Entrate — iscrizione SSN | https://www.agenziaentrate.gov.it/portale/iscrizione-al-servizio-sanitario-nazionale | |

**Attenzione: la pagina di download della modulistica è rotta.**
`https://www.portaleimmigrazione.it/Download_italiano.aspx` risponde 200 ma con "Errore : 0";
`documentazione.html` carica l'elenco via JavaScript e non lo espone in HTML. I PDF sono
raggiungibili **solo** con gli URL diretti in tabella. Sono stati scaricati e trascritti per
questo dossier: se il prodotto ne dipende, va copiato in locale, non linkato a caldo.

Canale non-web: **numero verde Poste 800.200.309**, lun–sab escluso festivi 8:00–20:00, anche
per lo stato di avanzamento (fonte: poste.it).

Assistenza gratuita alternativa al kit: **Patronati e Comuni abilitati** compilano l'istanza da
un portale dedicato e consegnano la copia cartacea nella busta prevista — "L'assistenza è
gratuita" (fonte: nuovaProcedura.html).

---

## 2. Il percorso completo, a monte e a valle del kit

Il kit postale è **solo il terzo passo** di sette. Il prodotto può coprirne uno, ma deve saper
dire alla persona dove si trova.

| # | Passo | Dove | Chi lo fa | Nota |
|---|---|---|---|---|
| 1 | Nulla osta al lavoro / al ricongiungimento | Sportello Unico Immigrazione (Prefettura), **Portale ALI** | datore di lavoro o familiare in Italia | Per lavoro: quote del decreto flussi e click day |
| 2 | Visto d'ingresso | Consolato italiano nel Paese d'origine | la persona | I requisiti (reddito, alloggio) sono già accertati qui (fonte: checklist B, §E e §F) |
| 3 | **Ingresso in Italia** | frontiera | — | **Fa partire il termine di 8 giorni lavorativi** (art. 5 c.2 D.lgs 286/1998) |
| 3b | Contratto di soggiorno + Accordo di integrazione | Sportello Unico Immigrazione | persona + datore | Solo lavoro subordinato. Accordo di integrazione: art. 4-bis D.lgs 286/98, DPR 179/2011 |
| 4 | **Kit postale MOD. 209** | Ufficio Postale con Sportello Amico | solo l'interessato | Oggetto di questo dossier |
| 5 | Convocazione in Questura: rilievi fotodattiloscopici | Ufficio Immigrazione della Questura | la persona (+ figli < 14 presenti) | 4 fototessere, originali di tutto |
| 6 | Ritiro e attivazione del permesso elettronico | Questura | persona + figli > 6 anni | "in media, in 60 giorni dalla data di presentazione della domanda" (poliziadistato.it/articolo/225) |
| 7 | A valle: iscrizione anagrafica (residenza), codice fiscale, iscrizione SSN e tessera sanitaria | Comune, Agenzia Entrate, ASL | la persona | Il codice fiscale è assegnato dalla Questura in sede di richiesta del permesso, o dallo Sportello Unico (Agenzia Entrate) |

Adempimento parallelo, spesso ignorato: chi **ospita** uno straniero deve darne comunicazione
scritta all'autorità di pubblica sicurezza **entro 48 ore** (art. 7 D.lgs 286/1998 —
"dichiarazione di ospitalità" / "cessione di fabbricato"). È il documento che poi serve nel kit
come prova della dimora. Si presenta in Questura se l'immobile è in città, al Sindaco nei comuni
della provincia; modulo in triplice copia con firma in originale `[da verificare: prassi locale,
varia per Questura]`.

Chi soggiorna **≤ 3 mesi** per turismo, affari, visite o studio breve non chiede il permesso:
compila la **dichiarazione di presenza** (modulo: poliziadistato.it/statics/10/moduldich.pdf).

---

## 3. Chi passa dal kit postale e chi no

Tipologie richiedibili all'Ufficio Postale, con il **codice motivo** da scrivere al punto 16 del
Modulo 1 (fonte: Informativa Generale — Tabella allegata n. 2, e tabellauffpostali.html):

| Cod. | Motivo | Cod. | Motivo |
|---|---|---|---|
| 02 | Affidamento | 19 | Missione |
| 03 | Aggiornamento carta di soggiorno | 20 | Motivi religiosi |
| 04 | Aggiornamento permesso di soggiorno | 21 | Residenza elettiva |
| 05 | Attesa occupazione | 23 | Status apolidia (rinnovo) |
| 06 | Attesa acquisto cittadinanza | 24 | Motivi di studio (art. 39 TUI) |
| 07 | Asilo (rinnovo) | 25 | Tirocinio formazione professionale |
| 09 | Permesso UE per soggiornanti di lungo periodo | 27 | Ricercatore (art. 27-ter TUI) |
| 10 | Conversione permesso di soggiorno | 28 | Ricercatore — ricerca lavoro |
| 11 | Duplicato carta di soggiorno | 29 | Ricercatore — mobilità |
| 12 | Duplicato permesso di soggiorno | 30 | Studente — ricerca lavoro (art. 39-bis.1) |
| 13 | Famiglia | 31 | Studente (art. 39-bis TUI) |
| 14 | Famiglia minore (14–18 anni) | 32 | Alunno (art. 39-bis TUI) |
| 15 | Lavoro autonomo | 33 | Tirocinante (art. 39-bis TUI) |
| 16 | **Lavoro subordinato** | 34 | Familiare di cittadino italiano *(solo tabellauffpostali)* |
| 17 | Lavoro casi particolari (art. 27 TUI) | 35 | Carta di soggiorno elettronica familiare cittadino UE *(solo tabellauffpostali)* |
| 18 | Lavoro subordinato stagionale | | |

I codici 01, 08, 22, 26 non compaiono. I codici 34 e 35 sono nella tabella web aggiornata al
30/05/2024 ma **non** nell'Informativa cartacea (ed. 2019): segnale che il PDF dentro il kit è
più vecchio del web.

**Solo in Questura, mai col kit** (tabellaMotiviTipologie.html): affari · cure mediche · gara
sportiva · motivi umanitari · asilo politico (primo rilascio) · minore età · giustizia · status
apolide (primo rilascio) · integrazione minore · invito · protezione internazionale ·
protezione speciale · casi speciali · protezione sussidiaria.

**Devono andare in Questura anche se la tipologia sarebbe da kit**: avvocati, tutori legali,
amministratori di sostegno, incaricati dal Tribunale; minori ultraquattordicenni non
accompagnati dal genitore (fonti: poste.it, nuovaProcedura.html).

---

## 4. MOD. 209 Modulo 1 — struttura campo per campo

Numerazione **ufficiale e stabile**: ogni casella del modulo ha un numero da 1 a 173, identico
nel modulo e nelle istruzioni multilingue. È la chiave naturale per il modello dati del prodotto
(`campo_209_76` = recapito per comunicazioni). Intestazione: "Al Signor Questore di: ______
(Sigla Provincia)", spazio per **marca da bollo 16,00** e "Codice Istanza / Spazio per codice a
barre" (compilati da Poste).

| Sezione | Campi | Contenuto |
|---|---|---|
| — | 1 | "SCRIVERE IN STAMPATELLO CON PENNA NERA" |
| **1** Dati della richiesta | 2–20 | 3 cognome (a) · 4 nome (a) · 5 provincia di domicilio (b) · 6 comune di domicilio · 7 richiede il: 8 rilascio / 9 rinnovo / 10 aggiornamento / 11 duplicato / 12 conversione · 13 del/della: 14 permesso / 15 carta di soggiorno · 16 **codice tipologia in richiesta (d)** · 17 aggiornamento foto carta soggiorno · 18 numero permesso in possesso (e) · 19 codice tipologia in possesso (d) · 20 data di scadenza del permesso |
| **2** Dati sull'istanza compilata | 21–29 | 22 quali moduli: 23 Modulo 1 / 24 Modulo 2 · 25 **numero totale di fogli (g)** · 26 numero dichiarato di figli a carico (h) · 27 avvertenza penale DPR 445/2000 · 28 data · **29 firma** |
| **3** Dati anagrafici | 30–38 | 31 codice fiscale (ove in possesso) · 32 stato civile (i) · 33 sesso (j) · 34 nato/a il (a) · 35 codice Stato nascita (k) · 36 codice Stato cittadinanza (k) · 37 rifugiato SI/NO · 38 città di nascita |
| **4** Documento di identità | 39–46 | 40 passaporto / 41 altro tipo di documento · 42–43 specificare altro (l) · 44 numero · 45 valido sino al · 46 rilasciato da (m) |
| **5** Dati visto (n) | 47–57 | **48 data di ingresso in Italia** · 49 frontiera · 50 numero visto · 51 tipo visto · 52 ingresso singolo / 53 multiplo · 54 annotazioni / motivo del visto di ingresso · 55 durata del visto · 56 valido dal · 57 sino al |
| **6** Rinnovo titolo di viaggio | 58–64 | 59 titolo di viaggio per straniero / 60 per apolide / 61 documento di viaggio per rifugiato · 62 periodo richiesto (o) · 63 1 anno / 64 2 anni |
| **7** Recapito in Italia del richiedente | 65–75 | 66 provincia (b) · 67 comune · 68 indirizzo · 69 numero civico (numero/lettera) · 70 scala · 71 interno · **72 CAP** · 73 e-mail (facoltativo) (p) · 74 telefono fisso (p) · 75 cellulare (p) |
| **8** **Recapito per eventuali comunicazioni (q)** | 76–84 | **77 PRESSO (r)** · 78 provincia · 79 comune · 80 indirizzo · 81 civico · 82 scala · 83 interno · 84 CAP |
| **9** Carta di soggiorno: idoneità alloggiativa e luoghi di soggiorno (s) | 85–111 | 86 idoneità alloggiativa · 87 rilasciata in data · 88 dal Comune / 91 o da ASL (con 89–90 e 92–93 provincia/comune/ASL) · 94 il richiedente dichiara (t) · 95 **di aver soggiornato negli ultimi sei anni in:** 4 blocchi provincia/comune/indirizzo (96–107) · 108 attualmente di risiedere in (109–111) |
| — | 112–118 | La richiesta è correlata all'istanza presentata da: 113 coniuge SI/NO · 116 genitore SI/NO |
| **10** Familiari a carico conviventi (s) | 119–127 | 120 numero persone conviventi · 121 rapporto di parentela: 122 coniuge / 123 figli / 124 numero / 125 altro / 126 specificare · 127 rimando alle sezioni 11 e 12 |
| **11** Coniuge | 128–135 | cognome (a) · nome (a) · sesso (j) · nato/a il · codice Stato nascita (k) · codice Stato cittadinanza (k) · città di nascita |
| **12** Figli minori di 14 anni a carico regolarmente soggiornanti in Italia (u) | 136–173 | **5 blocchi identici** da 7 campi (cognome, nome, sesso, data, Stato nascita, Stato cittadinanza, città di nascita), distribuiti su 3 pagine ("CONTINUA") |

### Foglio Note — il significato delle lettere (a)…(y)

Trascrizione integrale dall'Informativa Generale. È la parte che nessuno legge e che spiega
quasi tutti gli errori di compilazione.

| | Istruzione ufficiale |
|---|---|
| a | Riportare il dato **come scritto sul passaporto** o documento equipollente |
| b | Vedere tabella allegata n. 1 — "Province" |
| c | Barrare la tipologia di interesse (es. X) |
| d | Vedere tabella allegata n. 2: codice corrispondente alla tipologia del permesso |
| e | Indicare **serie e numero** del permesso/carta in possesso o di riferimento |
| f | Compilare la sezione 2 **solo dopo** aver compilato interamente il Modulo 1, il Modulo 2 qualora si percepisca un reddito, e dopo aver fotocopiato in A4 tutti i documenti. "Nel caso non venga sottoscritta, l'istanza non verrà accettata allo sportello postale" |
| g | Numero complessivo di fogli di cui consta l'istanza (**moduli + fotocopie dei documenti**) |
| h | Numero complessivo dei figli dichiarati nella sezione 12 del Modulo 1 |
| i | Stato civile: **A** = stato libero, **B** = coniugato/a |
| j | Sesso: **F** = femmina, **M** = maschio |
| k | Codice Stato dalla tabella allegata n. 3 (formato a 3 lettere: es. SEN, MAR, ALB, XXX = apolide) |
| l | Solo se il documento è **diverso dal passaporto** — tabella allegata n. 4 |
| m | Tabella allegata n. 5: autorità che ha rilasciato il documento diverso dal passaporto |
| n | **Solo in caso di prima richiesta** di permesso/carta. Riportare i dati scritti sul visto |
| o | La durata del titolo/documento di viaggio rinnovato non potrà essere superiore a quella del permesso di soggiorno |
| p | Campo facoltativo, utile alla Questura per eventuali comunicazioni inerenti l'istanza |
| q | **Se uguale al precedente non compilare** |
| r | Indicare nome e cognome, oppure la denominazione sociale di società/ente/associazione, **presso cui si vuole che venga alternativamente recapitata la raccomandata per la convocazione in Questura** |
| s | Solo in caso di richiesta di rilascio di Carta di Soggiorno e conversione del permesso da altri motivi a famiglia |
| t | Solo in caso di richiesta di Carta di Soggiorno |
| u | I minori adottati, affidati o sottoposti a tutela a carico del richiedente **sono equiparati ai figli minori** |
| v | Solo in caso di lavoro subordinato |
| w | Indicare la categoria professionale di appartenenza (es. medici, ambulanti, architetti) |
| x | Solo per stranieri **assunti nell'anno in corso** — allegare fotocopia delle ultime buste paga |
| y | Solo per attività autonoma **iniziata nell'anno in corso** |

### Tabelle allegate (dati pronti per il codice)

- **n. 1 — Sigle province**: 103 voci, elenco completo nell'Informativa (da AG a VT, include MB,
  FM, KR, VB, MS, SP). Usare questa lista, non una lista ISTAT moderna: è quella che il modulo
  accetta.
- **n. 2 — Codici motivo richiesta**: vedi §3.
- **n. 3 — Codici Stato**: codici a 3 lettere per ~200 Stati (AFG, ALB, DZA … ZWE). Casi
  speciali: `XXX` = APOLIDE, `XXA` = EX UNIONE SOVIETICA, `KOS` = Kosovo, `PSE` = Palestina,
  `TWN` = Taiwan.
- **n. 4 — Documenti equipollenti al passaporto**: titolo di viaggio per apolidi · documento di
  viaggio per rifugiati · titolo di viaggio per stranieri · libretto di navigazione per i
  marittimi · documento di navigazione aerea · lasciapassare delle Nazioni Unite · documento
  rilasciato da un quartier generale NATO · documento di viaggio UNMIK · carta di identità per i
  cittadini degli Stati UE. *(Nel PDF la colonna dei codici 01–09 è disallineata rispetto ai
  nomi: la corrispondenza numero→documento va verificata sul modulo cartaceo — `[da verificare]`.)*
- **n. 5 — Autorità di rilascio**: 01 Governo · 02 rappresentanza diplomatica/consolare dello
  Stato di appartenenza all'estero · 03 … in Italia · 04 … presso lo Stato della Città del
  Vaticano · 05 ONU (lasciapassare propri dirigenti) · 06 Questura.

### Traduzioni ufficiali già disponibili

`MOD_209_Multilingue.pdf` contiene le etichette di **tutti** i campi in italiano, inglese,
francese e spagnolo, riga per riga con lo stesso numero di campo. Sono traduzioni del Ministero:
se il prodotto è multilingua, queste stringhe si riusano invece di ritradurre, e la tracciabilità
è gratis. Le istruzioni **non** coprono l'arabo.

---

## 5. MOD. 209 Modulo 2 — struttura campo per campo

Si compila **"qualora si percepisca un reddito"** (nuovaProcedura.html). 3 pagine, campi 1–68.

| Sezione | Campi | Contenuto |
|---|---|---|
| **1** Tipologie lavoro | 2–19 | 3 attività lavorativa: 4 subordinato / 5 autonomo / 6 altro · 7 tipologia e durata contratto (v): 8 tempo indeterminato / 9 determinato / 10 stagionale / 11 durata mesi / 12 altro / 13 durata giorni · 14 lavoro autonomo: 15 titolare / 16 socio / 17 libero professionista / 18 altro · 19 mansione svolta |
| **2** Lavoro subordinato — dati del datore di lavoro | 20–32 | 21 persona giuridica: 22 denominazione sociale, 23 codice fiscale, 24 oppure partita IVA, 25 matricola INPS · 26 persona fisica: 27 numero permesso/carta ove in possesso, 28 cognome, 29 nome, 30 nato/a il, 31 codice fiscale, 32 oppure partita IVA |
| **3** Contratto di soggiorno stipulato col datore della sezione 2 | 33–40 | 34 sottoscritto presso lo Sportello Unico Immigrazione · 35 della Prefettura/UTG di (sigla provincia) · 36 data sottoscrizione · 37 inviato allo Sportello Unico · 38 della Prefettura/UTG di · 39 con raccomandata n. · 40 in data |
| **4** Lavoro autonomo | 41–50 | 42 denominazione sociale · 43 codice fiscale · 44 partita IVA · 45 matricola INPS · 46 provincia iscrizione C.C.I.A.A. · 47 numero · 48 data di iscrizione · 49 iscrizione albi/registri (w) · 50 in data |
| **5** Dati reddito | 51–63 | 52 annuale percepito · **53 importo EURO** · 54 ultimo anno di presentazione della dichiarazione dei redditi · 55 Modello Unico persone fisiche / 56 società di persone / 57 società di capitale / 58 enti non commerciali / 59 CUD / 60 busta paga / 61 bollettino INPS · 62 importo mensile EURO · 63 inizio attività autonoma nell'anno in corso (c, y) |
| **6** Iscrizione elenco anagrafico Centro per l'Impiego (ex liste di collocamento) | 64–68 | 65 data di iscrizione · 66 provincia · 67 città · 68 circoscrizione |

---

## 6. Costi

Fonte primaria: `tabelleCosti.html` + poste.it. Il contributo è fissato dal **DM MEF/Interno del
5 maggio 2017** (fonte: poliziadistato.it/articolo/225).

| Voce | Importo | Dove si paga |
|---|---|---|
| Marca da bollo | **16,00 €** | Tabaccheria / rivendita valori bollati, si applica sull'istanza |
| Produzione del permesso elettronico (smart card) | **30,46 €** | Bollettino c/c postale **67422402**, intestato al Ministero dell'Economia e delle Finanze, causale "importo per il rilascio del permesso di soggiorno elettronico" |
| Contributo, permesso > 3 mesi e ≤ 1 anno | **40,00 €** | stesso bollettino, sommato |
| Contributo, permesso > 1 anno e ≤ 2 anni | **50,00 €** | stesso bollettino, sommato |
| Contributo, permesso UE lungo periodo / dirigenti / lavoratori specializzati | **100,00 €** | stesso bollettino, sommato |
| Spedizione Poste Italiane | **30,00 €** | all'operatore, al momento dell'accettazione dell'istanza |

Un **unico bollettino per ogni richiedente**, che somma produzione + contributo:

| Caso | Bollettino |
|---|---|
| Rilascio/rinnovo maggiorenne, durata > 3 mesi e < 1 anno | **70,46 €** |
| Rilascio/rinnovo maggiorenne, durata > 1 anno e < 2 anni | **80,46 €** |
| Permesso UE lungo periodo, dirigenti, lavoratori specializzati | **130,46 €** |
| Aggiornamento, conversione, duplicato (permesso in corso di validità) | **30,46 €** — contributo non previsto |
| Minore < 14 anni inserito nell'istanza di aggiornamento del genitore | **1 solo kit**, ma un bollettino da 30,46 € per ogni figlio **+** uno per il genitore. Contributo non previsto |
| Minore 14–18 anni (kit intestato e presentato dal minore, firmato da minore e genitore) | **30,46 €**, contributo non previsto |

Totale di cassa per un primo rilascio da lavoro subordinato di 1 anno: 16 + 70,46 + 30 =
**116,46 €**; per 1–2 anni **126,46 €**; per il lungo periodo **176,46 €** (somma derivata dalle
voci ufficiali, coerente con le fonti secondarie consultate).

**Esenzioni dal contributo** (poliziadistato.it/articolo/225): minori di 18 anni regolarmente
presenti · permesso rilasciato o rinnovato per asilo, richiesta di asilo, protezione umanitaria,
protezione sussidiaria · stranieri o apolidi minori · ingresso per cure mediche, esenzione estesa
agli accompagnatori · duplicato, aggiornamento o conversione di permesso in corso di validità.

⚠️ **Errori nella fonte ufficiale**: negli esempi di `tabelleCosti.html` il costo di produzione è
riscritto due volte come "30.36€" e un calcolo riporta "(30.36€ + 50.00€ = 70.46€)". Non sono da
replicare né da "correggere in silenzio": se il prodotto mostra un totale, mostra anche le voci
che lo compongono, così il conto resta verificabile dalla persona.

Il bollettino premarcato si ritira **negli uffici postali abilitati** alla ricezione delle
istanze. Delle due ricevute del bollettino: una va **nella busta**, l'altra si **esibisce in
Questura** il giorno delle impronte.

---

## 7. Termini e durate

| Adempimento | Termine | Fonte |
|---|---|---|
| **Primo rilascio** | entro **8 giorni lavorativi** dall'ingresso, al Questore della provincia in cui si trova | art. 5 c.2 D.lgs 286/1998; nuovaProcedura.html; poliziadistato.it/articolo/225 |
| Rinnovo, permessi lavoro e famiglia di durata biennale | entro **90 giorni** dalla scadenza | Informativa Generale |
| Rinnovo, permessi per lavoro annuale | entro **60 giorni** | Informativa Generale |
| Rinnovo, restanti tipologie | entro **30 giorni** | Informativa Generale |
| Aggiornamento / conversione | solo su permesso **in corso di validità** | nuovaProcedura.html |
| Lavorazione della pratica | "in media, in 60 giorni dalla data di presentazione della domanda" | poliziadistato.it/articolo/225 |
| Comunicazione di ospitalità da parte di chi ospita | entro **48 ore** | art. 7 D.lgs 286/1998 |

Durate massime del permesso, secondo la circolare più recente (prot. 50432 del 01.06.2023,
citata da poliziadistato.it/articolo/225): fino a **6 mesi** per lavoro stagionale (**9 mesi** nei
settori che richiedono l'estensione, circ. 47457 del 05.12.2016) · fino a **1 anno** per corso di
studio o formazione professionale (circ. 106051 del 16.10.2018) · fino a **3 anni** per lavoro
autonomo, lavoro subordinato a tempo indeterminato e ricongiungimento familiare.
"La validità del permesso di soggiorno è la stessa del visto d'ingresso."

---

## 8. Cosa riceve la persona, e come segue la pratica

All'accettazione allo sportello postale la persona riceve **due documenti da conservare**:

1. **Ricevuta di presentazione della domanda**, "dotata di requisiti di sicurezza", che riporta
   **Codice Assicurata** e **Codice Ologramma** (nuovaProcedura.html) — poste.it li chiama
   "nome utente e password riportati sulla ricevuta". La ricevuta consente di circolare in Italia
   e va tenuta insieme al passaporto (primo rilascio) o al permesso in scadenza (rinnovo).
2. **Lettera di convocazione in Questura** con data, ora e luogo. Se l'agenda della Questura non
   ha disponibilità, la convocazione arriva **per raccomandata all'indirizzo italiano dichiarato**,
   appena si libera un appuntamento.

Effetto giuridico rilevante: chi esibisce la ricevuta di **primo rilascio** per lavoro
subordinato, lavoro autonomo o ricongiungimento familiare "ha i medesimi diritti connessi al
possesso del permesso di soggiorno"; in attesa del primo permesso per lavoro si può lavorare
temporaneamente, salvo comunicazione di motivi ostativi (poliziadistato.it/articolo/225).

Alla **prima convocazione** servono: **4 fotografie formato tessera con fondo bianco**, altezza
minima **45 mm**, larghezza **35 mm** (una finisce sul permesso) · ricevuta dell'assicurata
postale della spedizione del kit · l'appuntamento rilasciato dall'Ufficio Postale · la seconda
ricevuta del bollettino · **gli originali di tutti i documenti allegati in fotocopia** · 4
fototessere per ciascun figlio < 14 anni da inserire nel titolo, **con i figli presenti**. Alla
consegna e attivazione del permesso devono presentarsi i genitori e i figli **di età superiore ai
6 anni** (checklist B).

**Verifica dello stato online** — due canali, in due momenti diversi:

- **Poste / Portale Immigrazione**: area riservata con Codice Assicurata + Codice Ologramma,
  copre la fase "dall'accettazione alla conclusione delle lavorazioni effettuate da Poste
  Italiane". L'URL dell'area riservata **non è pubblicato** su nessuna delle pagine lette: il
  portale rimanda solo al dominio `https://www.portaleimmigrazione.it/` e la pagina di download è
  in errore. `[da verificare: URL esatto dell'area riservata]`
- **Polizia di Stato**, dopo l'appuntamento in Questura: https://questure.poliziadistato.it/stranieri/
  Si interroga con il **numero di pratica** rilasciato dalla Questura (10 caratteri alfanumerici)
  **oppure** il **numero di assicurata** della ricevuta postale (12 cifre senza trattini); esiste
  un secondo form per recuperare i codici via email se si sono persi.
  `[da verificare: i formati 10/12 caratteri vengono da fonti secondarie, non dal sito]`

---

## 9. Conflitti tra fonti ufficiali (da non appianare)

1. **Durata massima per lavoro subordinato a tempo indeterminato / autonomo / ricongiungimento**:
   Polizia di Stato dice **3 anni** (circolare 2023); `nuovaProcedura.html` e l'Informativa dicono
   ancora **2 anni**. Il PDF del kit è dell'edizione 2019.
   → Nel prodotto: mostrare il dato con la fonte accanto, non un numero secco.
2. **Il termine degli 8 giorni**: poste.it scrive "entro 8 giorni dal tuo ingresso in Italia";
   Polizia di Stato e Portale Immigrazione scrivono "otto giorni **lavorativi**".
   → Regola prudente: calcolare sui giorni lavorativi ma **dichiararlo**, e non presentare la data
   come una certezza legale.
3. **Il termine di rinnovo**: `nuovaProcedura.html` dice "almeno sessanta giorni prima della
   scadenza" per tutti; l'Informativa distingue 90 / 60 / 30 giorni per tipologia.
4. **Composizione del kit**: la procedura web parla di "modulo 1 e modulo 2, istruzioni,
   bollettino e busta"; l'Informativa è in realtà un documento a tre blocchi (informativa, foglio
   note, elenco province — quest'ultimo datato 23/10/2020 nel nome del file interno).
5. **Codici 34 e 35** (familiare di cittadino italiano, carta di soggiorno familiare UE): presenti
   nella tabella web, assenti nella tabella cartacea dentro il kit.

Limite di metodo, da dichiarare: **la checklist (B) è il documento di una singola Questura** (cita
esplicitamente il Comune di Rovigo). Le Questure variano nella prassi. Qualsiasi checklist nel
prodotto è quindi "una checklist tipo", non l'elenco vincolante della Questura della persona: va
detto in chiaro.

---

## 10. Checklist documenti per tipologia

Fonti: checklist (A) e (B) della Polizia di Stato, trascritte dai PDF. Struttura di (B): un blocco
comune + un blocco per tipologia.

### Comune a tutti i titoli di soggiorno (checklist B, §A)

Da allegare **in fotocopia** nella busta, e da **esibire in originale** il giorno della
convocazione presso l'ufficio immigrazione della Questura:

1. marca da bollo da **16,00 €**;
2. copia del passaporto in corso di validità (solo pagine con dati anagrafici e scadenza, visti e
   timbri);
3. permesso di soggiorno, se in possesso;
4. copia del codice fiscale, solo se già in possesso;
5. certificazione attestante l'**attuale dimora**: certificato di residenza **oppure**
   dichiarazione di ospitalità / cessione di fabbricato vidimata dall'ufficio ricevente.

In deroga alla normativa sull'autocertificazione, i cittadini stranieri che devono esibire
certificati **devono richiederli all'Amministrazione competente** (D.lgs 286/1998, DPR 394/99):
niente autocertificazione, tranne dove esplicitamente prevista.

### Lavoro subordinato — primo rilascio con visto (art. 22 TUI)

Unione delle due fonti:

- **contratto di soggiorno** stipulato presso lo Sportello Unico per l'Immigrazione (solo primo
  rilascio);
- copia del **codice fiscale** se già in possesso (solo primo rilascio);
- **dichiarazione di ospitalità e contratto d'affitto con documento dell'ospitante** (al rilascio)
  **oppure certificato di residenza** (al rinnovo);
- copia del **passaporto** in corso di validità, tutte le pagine con dati anagrafici, visti e
  timbri;
- copia del permesso di soggiorno già in possesso, scaduto o valido (rinnovo/conversione);
- copia del **modello UNILAV** (comunicazione obbligatoria di assunzione);
- **dichiarazione dei redditi o modello CUD**; **ultima busta paga**;
- marca da bollo **16 €**; bollettino **70,46 €** (≤ 1 anno) o **80,46 €** (1–2 anni);
- è prevista la stipula dell'**Accordo di Integrazione** presso lo Sportello Unico (art. 4-bis
  D.lgs 286/98, DPR 179/2011).

### Altre tipologie

| Tipologia | Documenti specifici oltre al blocco comune |
|---|---|
| **Lavoro stagionale** (art. 24) | contratto di soggiorno (primo rilascio) **e nulla osta (sia al rilascio sia al rinnovo)** · UNILAV · redditi/CUD · bollettino **70,46 €** |
| **Attesa occupazione** (art. 22) | fotocopia della **certificazione di disoccupazione** del Centro per l'Impiego della zona di residenza o domicilio · bollettino **70,46 €**. Al rinnovo si valuta caso per caso, contando anche il reddito annuo complessivo dei familiari conviventi |
| **Lavoro autonomo** (art. 26) | requisiti già accertati col visto. Al rinnovo: visura camerale (o iscrizione all'albo per i liberi professionisti) · Modello Unico con invio telematico · bilancio vidimato dal commercialista degli ultimi sei mesi di attività · certificato di attribuzione della partita IVA · bollettino **70,46 / 80,46 €** |
| **Motivi familiari — con visto, ricongiungimento** (artt. 29–30) | requisiti già accertati dal nulla osta della Prefettura · copia del **nulla osta al ricongiungimento familiare** dello Sportello Unico · **modello 209 compilato presso lo Sportello Unico** (solo primo rilascio) · certificato di residenza e stato di famiglia del familiare già in Italia · per figli < 14 anni da inserire nel permesso del genitore: certificato di nascita tradotto e legalizzato dal consolato italiano o con **Apostille** · redditi (al rinnovo) · bollettino **70,46 / 80,46 €** |
| **Famiglia senza visto (coesione familiare)** | redditi del familiare · **certificato di idoneità alloggiativa** (primo rilascio) · certificato di matrimonio e di nascita (con maternità e paternità) tradotti e legalizzati/apostillati dalla rappresentanza diplomatico-consolare — **il certificato di matrimonio deve essere rilasciato da non oltre sei mesi** · altri documenti previsti dall'art. 28 TUI |
| **Studio** (art. 39, > 3 mesi) | certificazione del corso di studio vistata dalla rappresentanza diplomatica all'atto del rilascio del visto · autocertificazione di iscrizione ed esami sostenuti (rinnovo) · **polizza di assicurazione sanitaria** o attestazione di iscrizione volontaria al SSN · documentazione dei **mezzi di sostentamento** · bollettino **70,46 €** |
| **Permesso UE lungo periodo** (art. 9) | **5 anni di soggiorno legale** dalla data del primo rilascio · redditi non inferiori all'**assegno sociale annuo** (per i familiari: assegno sociale aumentato della metà per ogni familiare) · **certificato di idoneità alloggiativa** · **superamento del test di italiano livello A2** · **casellario giudiziale e carichi pendenti** · certificato di residenza e stato di famiglia · UNILAV o iscrizione C.C.I.A.A. · **iscrizione scolastica per i minori in età dell'obbligo** · per i figli minori: certificazione anagrafica tradotta e legalizzata, non richiesta se il minore è entrato con visto per ricongiungimento · bollettino **130,46 €** |
| **Carta UE familiare di cittadino UE** (D.lgs 30/2007) e **FAMIT** (familiare di cittadino italiano che non ha esercitato la mobilità) | certificato di residenza e stato di famiglia del congiunto comunitario · documento valido e redditi del familiare · certificato di matrimonio/nascita tradotto e legalizzato · per i genitori e per i figli **sopra i 21 anni**: dimostrazione di essere **a carico** del congiunto · bollettino **30,46 €** |
| **Residenza elettiva** | documentazione delle risorse da rendite (pensioni, vitalizi), proprietà immobiliari, attività economico-commerciali stabili o altre fonti · polizza sanitaria o iscrizione SSN · certificato di residenza e stato di famiglia · bollettino **80,46 €** |
| **Motivi religiosi** | dichiarazione dell'ente religioso sulla natura dell'incarico e sui mezzi di sostentamento (vitto, alloggio, spese di rientro) · polizza sanitaria o iscrizione SSN |
| **Attività sportiva** (art. 27) | contratto con la società sportiva · indicazione dei mezzi di sostentamento (vitto e alloggio) · **dichiarazione nominativa di assenso del CONI** (art. 40 c.16 DPR 394/99) |
| **Duplicato** | **denuncia di smarrimento o furto** · certificato di residenza e stato di famiglia · bollettino **30,46 €** |
| **Aggiornamento** (cambio domicilio, stato civile, inserimento figli, cambio passaporto) | per aggiornamenti, conversioni e duplicati di permessi **in corso di validità non è richiesto il pagamento del contributo** |

---

## 11. Dove le persone si bloccano (analisi, non fonte)

Ricavato dalle regole formali sopra: ogni voce è un requisito che il modulo o la procedura impone
**senza spiegarlo** a chi compila.

| # | Attrito | Cosa lo genera | Conseguenza se sbagliato |
|---|---|---|---|
| 1 | **Ordine e grafia di nome e cognome** | nota (a): "come scritto sul passaporto" — che in molti passaporti è in ordine inverso o traslitterato | Mismatch con la MRZ: integrazione o rifiuto |
| 2 | **Il recapito della sezione 8** | nota (q) "se uguale al precedente non compilare" + nota (r): è l'indirizzo dove arriva **la raccomandata di convocazione** | La convocazione non arriva. È l'errore più costoso: la pratica si ferma senza che la persona sappia perché |
| 3 | **Codice tipologia (punto 16)** | va cercato in una tabella su un foglio separato, con ~30 voci quasi omonime (studente / alunno / tirocinante / ricercatore) | Istanza per la tipologia sbagliata |
| 4 | **Codici Stato (punti 35, 36)** | tabella di ~200 codici a 3 lettere; "apolide" è `XXX` | Dato anagrafico errato |
| 5 | **Numero totale di fogli (punto 25)** | nota (g): moduli **+ tutte** le fotocopie; e la sezione 2 va compilata **per ultima**, dopo aver fotocopiato tutto | Conteggio sbagliato, allegati incompleti |
| 6 | **Firma (punto 29)** | "nel caso non venga sottoscritta, l'istanza non verrà accettata allo sportello postale"; la busta va consegnata **aperta** e non chiusa prima dei controlli | Respinta allo sportello, con il viaggio da rifare |
| 7 | **Gli 8 giorni lavorativi** | non sono scritti sul kit: stanno nell'art. 5 c.2, e poste.it li riporta come "8 giorni" | Domanda tardiva |
| 8 | **Quali documenti per la mia tipologia** | la checklist è un PDF separato, per Questura, con differenze di prassi locale | Integrazione richiesta mesi dopo |
| 9 | **Chi non può usare il kit** | avvocati, tutori, minori non accompagnati, 14 tipologie solo-Questura | Viaggio inutile all'ufficio postale |
| 10 | **Quanto pago e su quale bollettino** | 4 voci su 3 canali diversi (tabaccaio, bollettino MEF, cassa Poste), con la tabella ufficiale che contiene errori aritmetici | Versamento errato → pratica sospesa |
| 11 | **Fotocopie "in A4"** | pagine anagrafiche **e** pagine con i visti; fronte/retro non specificato | Allegato incompleto |
| 12 | **Le 4 fototessere 35 × 45 mm a fondo bianco** | richieste **alla convocazione**, non alla presentazione; servono anche per i figli < 14, che devono essere presenti | Appuntamento da rifare |

---

## 12. Automazioni candidate

Ordinate per rapporto valore/costo, con la nota se sono **deterministiche** — cioè compatibili con
il vincolo "nel software non gira AI" (CLAUDE.md).

| Automazione | Input → output | Natura | Appoggio |
|---|---|---|---|
| **Calcolo della scadenza** | data di ingresso (campo 48) → data limite a 8 giorni lavorativi, con i giorni contati e quelli saltati | deterministica; serve la lista delle festività nazionali | art. 5 c.2 |
| **Checklist documenti per tipologia** | codice motivo (campo 16) + rilascio/rinnovo → elenco documenti con "com'è fatto" e "dove si trova" | tabella dati; dichiarare la variabilità per Questura | §10 |
| **Calcolo del bollettino** | tipologia + durata + età + tipo di istanza → importo unico del bollettino, voci che lo compongono, totale di cassa | deterministica, aritmetica banale | §6 |
| **Instradamento posta vs Questura** | codice motivo + chi presenta (interessato / tutore / minore) → "Ufficio Postale" oppure "Questura, perché…" | tabella + regole | §3 |
| **Validazione del campo nome** | cognome/nome + MRZ del passaporto → avviso se non compaiono nella MRZ o se contengono caratteri non latini | deterministica; la MRZ si digita, non si fa OCR | nota (a) |
| **Coerenza CAP ↔ provincia** | CAP + sigla provincia (tabella 1) → warning spiegato, non blocco | deterministica; serve una tabella CAP→provincia `[da verificare: fonte aperta citabile]` | campi 72, 84 |
| **Sezione 8 come domanda esplicita** | "dove ricevi la posta?" invece di "recapito per eventuali comunicazioni" | riscrittura, nessuna logica | note (q), (r) |
| **Conteggio automatico dei fogli** | moduli compilati + documenti spuntati nella checklist → proposta per il campo 25 | deterministica; resta una proposta, la persona conferma | nota (g) |
| **Lookup codice tipologia** | motivo in linguaggio naturale ("lavoro con contratto") → codice del punto 16 + tipologia ufficiale | tabella con sinonimi scritti a mano | tabella n. 2 |
| **Lookup codice Stato** | nome del Paese → codice a 3 lettere (campi 35, 36) | tabella n. 3, ~200 voci | tabella n. 3 |
| **Coerenza passaporto ↔ visto ↔ ingresso** | scadenza passaporto, validità visto, data di ingresso → incoerenze (passaporto scaduto prima dell'ingresso, ingresso fuori dalla validità del visto) | deterministica | sezioni 4 e 5 |
| **Ordine di compilazione imposto** | sezione 2 sbloccata solo dopo il resto del Modulo 1, il Modulo 2 se c'è reddito e le fotocopie | regola di flusso | nota (f) |
| **Modulo 2 mostrato solo se serve** | "percepisci un reddito?" → mostra o nasconde 68 campi | regola di flusso | nuovaProcedura.html |
| **Multilingua a costo zero** | etichette IT/EN/FR/ES già tradotte dal Ministero, indicizzate per numero di campo | riuso di `MOD_209_Multilingue.pdf` | §4 |
| **Stampa del riepilogo nella forma del modulo** | risposte → foglio stampabile con i numeri di campo del MOD. 209 | CSS di stampa | §4 |

**Cosa non automatizzare, e va detto nella pagina dei limiti:**

- prevedere **l'esito** della pratica o i tempi della singola Questura;
- **inviare** qualcosa alla Questura, a Poste o al Portale Immigrazione: non esistono API
  pubbliche, la presentazione è di persona e l'identificazione è fisica;
- **compilare al posto della persona** i campi che richiedono un documento che ancora non ha
  (contratto di soggiorno, nulla osta, idoneità alloggiativa);
- consulenza legale, scelta della tipologia nei casi ambigui, valutazione del reddito sufficiente:
  sono valutazioni discrezionali della Questura;
- **OCR del passaporto**: fuori scope dichiarato in `app-plan.md`;
- scraping dello stato pratica: l'area riservata Poste non ha URL pubblico documentato e la pagina
  della Polizia richiede codici personali. Si spiega **come** guardarlo, non lo si guarda al posto
  della persona.

---

## 13. Glossario: burocratese → parole semplici

Materiale per gli `ExplainPanel`. La colonna di destra è una proposta, da rivedere con chi scrive
i testi: semplificare senza cambiare il significato (vincolo del brief).

| Termine ufficiale | Cosa vuol dire davvero |
|---|---|
| Kit a banda gialla / MOD. 209 | La busta gialla con i due moduli da compilare, che si ritira in posta |
| Sportello Amico | Lo sportello delle Poste che accetta la domanda. Non tutti gli uffici lo hanno |
| Istanza | La tua domanda |
| Rilascio / rinnovo / aggiornamento / duplicato / conversione | Prima volta / rinnovo / cambio di un dato / copia perché l'hai perso / cambio del motivo |
| Recapito per eventuali comunicazioni | L'indirizzo dove vuoi ricevere la lettera che ti dice quando andare in Questura |
| Rilievi fotodattiloscopici | Foto e impronte digitali, in Questura |
| Convocazione | La lettera che ti dà giorno e ora dell'appuntamento in Questura |
| Codice assicurata / codice ologramma | I due codici sulla ricevuta: servono a controllare online come va la pratica |
| Contratto di soggiorno | Il contratto firmato col datore di lavoro allo Sportello Unico, prima del permesso |
| Nulla osta | Il via libera dato all'azienda o al familiare **prima** che tu partissi |
| Sportello Unico per l'Immigrazione (SUI) | L'ufficio in Prefettura che gestisce nulla osta e contratto di soggiorno |
| Modello UNILAV | La comunicazione di assunzione che il datore di lavoro invia allo Stato |
| CUD / Modello Unico | I documenti che dicono quanto hai guadagnato |
| Idoneità alloggiativa | Un certificato del Comune o della ASL che dice che la casa è adatta al numero di persone |
| Dichiarazione di ospitalità / cessione di fabbricato | La dichiarazione di chi ti ospita, da fare entro 48 ore |
| Documento equipollente | Un documento che vale come il passaporto (es. titolo di viaggio per rifugiati) |
| Marca da bollo | Un francobollo fiscale da 16 € che si compra in tabaccheria |
| Permesso UE per soggiornanti di lungo periodo | Il permesso a tempo indeterminato, dopo 5 anni |
| Accordo di integrazione | L'impegno che si firma allo Sportello Unico per i permessi di almeno un anno |
| Assegno sociale | L'importo che lo Stato usa come soglia minima di reddito |
| Apostille / legalizzazione | Il timbro che rende valido in Italia un certificato straniero |

---

## 14. Cosa manca ancora

1. **URL dell'area riservata** del Portale Immigrazione per lo stato pratica (§8).
2. **Tabella CAP → provincia** da fonte aperta citabile, per il validatore dell'indirizzo.
3. **Elenco festività nazionali** da fonte citabile, per il calcolo degli 8 giorni lavorativi (le
   festività patronali locali restano fuori: limite da dichiarare).
4. **Corrispondenza codice → documento** nella tabella allegata n. 4 (colonna disallineata nel PDF).
5. Verifica che la **checklist della Questura di destinazione** della persona coincida con la
   checklist tipo: differenze di prassi locale sono la norma, non l'eccezione.
6. Conferma dei **formati dei codici** di verifica (pratica 10 caratteri / assicurata 12 cifre) sul
   sito della Polizia, non da fonti secondarie.
