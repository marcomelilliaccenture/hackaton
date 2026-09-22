// app/src/data/modulo-209-sezioni.ts
// Le dodici sezioni del MOD. 209 Modulo 1, nell'ordine e con il titolo del modulo.
// Fonte: F9 (MOD. 209 Modulo 1) — testo estratto in docs/sources/mod-209-modulo-1.txt.
// Verificato il: 22/09/2026.
//
// Sul cartaceo il titolo di una sezione E' una casella numerata (la 2, la 21, la 76...),
// non un'intestazione tipografica: per questo ogni sezione porta `casellaTitolo`. Il
// facsimile di stampa dice "casella 76 · SEZIONE 8" come fa il modulo, cosi' chi trascrive
// trova il punto sul foglio senza contare le caselle.
//
// Il modulo arriva alla casella 173: qui NON si elencano le caselle una per una, perche'
// l'etichetta di una casella che non chiediamo non l'abbiamo in fonte e non la si inventa.
// Le sezioni servono a raggruppare le caselle che l'app raccoglie davvero.

export interface SezioneModulo1 {
  numero: number;
  /** titolo alla lettera del modulo: resta in italiano in tutte le lingue */
  titolo: string;
  /** la casella che sul modulo porta il titolo della sezione */
  casellaTitolo: number;
  /** prima e ultima casella della sezione, incluse */
  da: number;
  a: number;
}

export const SEZIONI_MODULO_1: SezioneModulo1[] = [
  { numero: 1, titolo: "SEZIONE 1 - DATI DELLA RICHIESTA", casellaTitolo: 2, da: 2, a: 20 },
  { numero: 2, titolo: "SEZIONE 2 - DATI SULL'ISTANZA COMPILATA", casellaTitolo: 21, da: 21, a: 29 },
  { numero: 3, titolo: "SEZIONE 3 - DATI ANAGRAFICI", casellaTitolo: 30, da: 30, a: 38 },
  { numero: 4, titolo: "SEZIONE 4 - DATI DOCUMENTO DI IDENTITA'", casellaTitolo: 39, da: 39, a: 46 },
  { numero: 5, titolo: "SEZIONE 5 - DATI VISTO", casellaTitolo: 47, da: 47, a: 57 },
  {
    numero: 6,
    titolo: "SEZIONE 6 - RICHIESTA RINNOVO TITOLO / DOCUMENTO DI VIAGGIO",
    casellaTitolo: 58,
    da: 58,
    a: 64,
  },
  {
    numero: 7,
    titolo: "SEZIONE 7 - RECAPITO IN ITALIA DEL RICHIEDENTE",
    casellaTitolo: 65,
    da: 65,
    a: 75,
  },
  {
    numero: 8,
    titolo: "SEZIONE 8 - RECAPITO PER EVENTUALI COMUNICAZIONI",
    casellaTitolo: 76,
    da: 76,
    a: 84,
  },
  {
    numero: 9,
    titolo:
      "SEZIONE 9. CARTA DI SOGGIORNO (IDONEITA' ALLOGGIATIVA - DICHIARAZIONE LUOGHI DI SOGGIORNO)",
    casellaTitolo: 85,
    da: 85,
    a: 111,
  },
  {
    numero: 10,
    titolo: "SEZIONE 10. FAMILIARI A CARICO CONVIVENTI",
    casellaTitolo: 119,
    da: 119,
    a: 127,
  },
  { numero: 11, titolo: "SEZIONE 11 - CONIUGE", casellaTitolo: 128, da: 128, a: 135 },
  {
    numero: 12,
    titolo:
      "SEZIONE 12 - FIGLI MINORI DI 14 ANNI A CARICO REGOLARMENTE SOGGIORNANTI IN ITALIA",
    casellaTitolo: 136,
    da: 136,
    a: 173,
  },
];

/**
 * La sezione che contiene una casella. `undefined` per le caselle 1 e 112-118, che sul
 * modulo stanno fuori da ogni sezione (la 1 e' l'avviso «scrivere in stampatello», il
 * blocco 112-118 e' «la richiesta e' correlata all'istanza presentata da»).
 */
export function sezioneDiCasella(casella: number): SezioneModulo1 | undefined {
  return SEZIONI_MODULO_1.find((s) => casella >= s.da && casella <= s.a);
}
