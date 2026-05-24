import type { Lang } from "../i18n/translations";

/**
 * Picks the English variant when the UI is in English and a translation exists,
 * otherwise falls back to the primary (Montenegrin) value.
 */
export function localized(
  lang: Lang,
  primary: string | null | undefined,
  en: string | null | undefined,
): string {
  if (lang === "en" && en && en.trim() !== "") return en;
  return primary ?? "";
}
