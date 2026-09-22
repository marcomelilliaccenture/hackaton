// app/src/domain/form-model.ts
// R-12 (nota f: ordine di compilazione) · R-14 (Modulo 2 solo "qualora si percepisca un reddito").
// Puro: nessun import da React, nessuna frase leggibile — solo chiavi i18n.
//
// Nota (f), F2: la sezione 2 si compila SOLO dopo aver compilato interamente il Modulo 1,
// il Modulo 2 qualora si percepisca un reddito, e dopo aver fotocopiato in A4 tutti i
// documenti. Qui quell'ordine e' una regola di flusso (`requires`), non un suggerimento.

import type { Answers, Step } from "@/domain/types";

/** R-14 — il Modulo 2 si compila solo se c'e' un reddito. Fonte: F3. */
export function needsModulo2(answers: Answers): boolean {
  return answers.hasIncome === true;
}

/**
 * Le sette schermate in cui e' diviso il Modulo 1: l'ordine e' quello del modulo stesso,
 * con le caselle citate. Il passo 7 (fogli 25 + firma 29) si sblocca per ultimo.
 */
export const MODULO_1_FIELD_STEPS: { route: string; i18nKey: string; caselle: number[] }[] = [
  { route: "/modulo/1", i18nKey: "step.nome", caselle: [3, 4] },
  { route: "/modulo/2", i18nKey: "step.nascita", caselle: [34, 35, 36, 37, 38] },
  { route: "/modulo/3", i18nKey: "step.passaporto", caselle: [44, 45, 48, 57] },
  { route: "/modulo/4", i18nKey: "step.recapito", caselle: [77, 84] },
  { route: "/modulo/5", i18nKey: "step.attivita", caselle: [] },
  { route: "/modulo/6", i18nKey: "step.contatti", caselle: [73, 74, 75] },
  { route: "/modulo/7", i18nKey: "step.controllo-finale", caselle: [25, 29] },
];

/** L'ordine imposto dalla nota (f). Il Modulo 2 compare solo se serve (R-14). */
export function stepsFor(answers: Answers): Step[] {
  const steps: Step[] = [
    { id: "modulo-1", i18nKey: "step.modulo-1", route: "/modulo/1", requires: [] },
  ];

  if (needsModulo2(answers)) {
    steps.push({
      id: "modulo-2",
      i18nKey: "step.modulo-2",
      route: "/modulo/5",
      requires: ["modulo-1"],
    });
  }

  const primaDelleFotocopie = steps.map((s) => s.id);
  steps.push({
    id: "fotocopie",
    i18nKey: "step.fotocopie",
    route: "/documenti",
    requires: primaDelleFotocopie,
  });

  steps.push({
    id: "firma",
    i18nKey: "step.firma",
    route: "/modulo/7",
    requires: [...primaDelleFotocopie, "fotocopie"],
  });

  return steps;
}

/**
 * Il passo e' raggiungibile? Solo se tutti i passi che la nota (f) impone prima sono
 * completi. La pagina chiede qui, non riscrive la regola.
 */
export function canEnterStep(step: Step, completedStepIds: string[]): boolean {
  return step.requires.every((id) => completedStepIds.includes(id));
}
