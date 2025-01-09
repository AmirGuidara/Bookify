import { de } from './de';
import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';

export const translations = {
  en,
  de,
  fr,
  ar
} as const;

export type Language = keyof typeof translations;