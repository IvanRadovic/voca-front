import type { CallType } from '../types';

export const CALL_TYPES: CallType[] = [
  'seminar',
  'conference',
  'education',
  'camp',
  'competition',
  'course',
  'workshop',
  'mentorship',
  'volunteering',
];

// Display labels per language for the (English) enum values.
export const CALL_TYPE_LABELS: Record<CallType, { en: string; cnr: string }> = {
  seminar: { en: 'Seminar', cnr: 'Seminar' },
  conference: { en: 'Conference', cnr: 'Konferencija' },
  education: { en: 'Education', cnr: 'Edukacija' },
  camp: { en: 'Camp', cnr: 'Kamp' },
  competition: { en: 'Competition', cnr: 'Takmičenje' },
  course: { en: 'Course', cnr: 'Kurs' },
  workshop: { en: 'Workshop', cnr: 'Radionica' },
  mentorship: { en: 'Mentorship', cnr: 'Mentorski program' },
  volunteering: { en: 'Volunteering', cnr: 'Volontiranje' },
};

export const EDUCATION_LEVELS = [
  { value: 'high_school', en: 'High school', cnr: 'Srednja škola' },
  { value: 'undergraduate', en: 'Undergraduate studies', cnr: 'Osnovne studije' },
  { value: 'bachelor', en: 'Bachelor', cnr: 'Fakultet' },
  { value: 'master', en: 'Master', cnr: 'Master' },
];

export const GENDERS = [
  { value: 'male', en: 'Male', cnr: 'Muški' },
  { value: 'female', en: 'Female', cnr: 'Ženski' },
  { value: 'other', en: 'Other', cnr: 'Drugo' },
  { value: 'undisclosed', en: 'Prefer not to say', cnr: 'Ne želim da kažem' },
];

export const PREREQUISITES = [
  { value: 'none', en: 'None', cnr: 'Nema' },
  { value: 'english', en: 'English knowledge', cnr: 'Znanje engleskog' },
  { value: 'age', en: 'Certain age', cnr: 'Određene godine' },
  { value: 'skills', en: 'Specific skills', cnr: 'Specifične vještine' },
];

export const APPLICATION_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  completed: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
};
