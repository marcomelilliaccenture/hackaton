"use client";

import { StepProgress } from "./StepProgress";

/**
 * La catena delle schermate, una volta sola: / → /percorso → /dove → /scadenza
 * → /costi → /modulo/1 → /modulo/4 → /documenti → /riepilogo.
 *
 * L'ordine della coda non e' scelto qui: lo impone `stepsFor()` in
 * `@/domain/form-model` (nota f, F2) — prima il Modulo 1, poi le fotocopie
 * (`/documenti`), e per ultimo il passo della firma, che in questo strumento
 * vive su `/riepilogo` (la casella 29 si conferma li').
 *
 * I minuti sono una stima d'uso dell'interfaccia, non un dato normativo.
 */
export interface JourneyStage {
  route: string;
  labelKey: string;
}

export const JOURNEY: readonly JourneyStage[] = [
  { route: "/percorso", labelKey: "journey.percorso" },
  { route: "/dove", labelKey: "journey.dove" },
  { route: "/scadenza", labelKey: "journey.scadenza" },
  { route: "/costi", labelKey: "journey.costi" },
  { route: "/modulo/1", labelKey: "journey.modulo-nome" },
  { route: "/modulo/4", labelKey: "journey.modulo-recapito" },
  { route: "/documenti", labelKey: "journey.documenti" },
  { route: "/riepilogo", labelKey: "journey.riepilogo" },
];

/** ~2 minuti a schermata: stima d'uso, non una promessa. */
const MINUTI_PER_TAPPA = 2;

export function JourneyProgress({ route }: { route: string }) {
  const index = JOURNEY.findIndex((s) => s.route === route);
  if (index < 0) return null;

  return (
    <StepProgress
      current={index + 1}
      total={JOURNEY.length}
      labelKeys={JOURNEY.map((s) => s.labelKey)}
      minutes={(JOURNEY.length - index) * MINUTI_PER_TAPPA}
    />
  );
}
