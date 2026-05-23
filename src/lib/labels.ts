import type { Lang } from "../i18n/translations";
import {
  CALL_TYPE_LABELS,
  CALL_STATUS_LABELS,
  APPLICATION_STATUS_LABELS,
  EDUCATION_LEVELS,
  GENDERS,
  CATEGORY_LABELS,
} from "./constants";

// Centralized, translation-aware label helpers for enum/data values so the
// whole UI shows localized text instead of raw backend values.

type LabelPair = { en: string; cnr: string } | undefined;

const pick = (pair: LabelPair, lang: Lang, fallback: string) =>
  pair ? pair[lang] : fallback;

export const callTypeLabel = (value: string, lang: Lang) =>
  pick(CALL_TYPE_LABELS[value as keyof typeof CALL_TYPE_LABELS], lang, value);

export const callStatusLabel = (value: string, lang: Lang) =>
  pick(CALL_STATUS_LABELS[value], lang, value);

export const applicationStatusLabel = (value: string, lang: Lang) =>
  pick(APPLICATION_STATUS_LABELS[value], lang, value);

export const categoryLabel = (slug: string, lang: Lang, fallback = slug) =>
  pick(CATEGORY_LABELS[slug], lang, fallback);

// Analytics returns category names (English) rather than slugs.
export const categoryLabelByName = (name: string, lang: Lang) => {
  const entry = Object.values(CATEGORY_LABELS).find((c) => c.en === name);
  return entry ? entry[lang] : name;
};

export const educationLabel = (value: string | null | undefined, lang: Lang) => {
  if (!value) return "";
  const level = EDUCATION_LEVELS.find((l) => l.value === value);
  return level ? level[lang] : value;
};

export const genderLabel = (value: string | null | undefined, lang: Lang) => {
  if (!value) return "";
  const g = GENDERS.find((x) => x.value === value);
  return g ? g[lang] : value;
};

// Translates a list of {id, slug, name} categories for use in chip pickers.
export const localizeCategories = <T extends { slug: string; name: string }>(
  categories: T[],
  lang: Lang,
) => categories.map((c) => ({ ...c, name: categoryLabel(c.slug, lang, c.name) }));
