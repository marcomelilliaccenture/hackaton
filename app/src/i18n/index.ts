import it from "./it.json";
import en from "./en.json";
import fr from "./fr.json";
import es from "./es.json";

export type Lang = "it" | "en" | "fr" | "es";

/** Le quattro lingue, ognuna scritta nella propria lingua (docs/ux-spec.md §5). */
export const LANGS: ReadonlyArray<{ code: Lang; label: string }> = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" }
];

export const DEFAULT_LANG: Lang = "it";

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<Lang, Dictionary> = { it, en, fr, es };

export function isLang(value: string): value is Lang {
  return value === "it" || value === "en" || value === "fr" || value === "es";
}

/**
 * Una chiave mancante ritorna la chiave, non l'italiano: gli errori di
 * traduzione devono restare visibili (decisione, non svista).
 */
export function t(key: string, lang: Lang): string {
  const dictionary = DICTIONARIES[lang];
  if (!dictionary) return key;
  const value = dictionary[key];
  return typeof value === "string" ? value : key;
}

/**
 * Decide se una stringa a schermo va marcata `lang="it"`.
 *
 * Alcune chiavi restano in italiano in tutte le lingue: sono citazioni alla
 * lettera della fonte (le note del MOD. 209) o nomi propri. Altre — le
 * etichette ufficiali che F11 pubblica in quattro lingue — sono tradotte
 * davvero. Marcare `lang="it"` anche le seconde fa pronunciare a un lettore di
 * schermo l'inglese e il francese con la voce italiana.
 *
 * Regola: `it` solo quando la lingua attiva non e' l'italiano E il testo
 * mostrato coincide con quello di `it.json` (cioe' non e' stato tradotto).
 */
export function langAttr(key: string, lang: Lang): "it" | undefined {
  if (lang === "it") return undefined;
  const italiano = it[key as keyof typeof it] as string | undefined;
  if (typeof italiano !== "string" || italiano === "") return undefined;
  return t(key, lang) === italiano ? "it" : undefined;
}
