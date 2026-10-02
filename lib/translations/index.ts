import { Language, Translation } from '../dictionary';
import { en } from './en';
import { es } from './es';
import { de } from './de';
import { fr } from './fr';
import { it } from './it';
import { pt } from './pt';
import { id } from './id';
import { ja } from './ja';
import { ko } from './ko';
import { pl } from './pl';
import { ru } from './ru';
import { tr } from './tr';
import { uk } from './uk';
import { zh } from './zh';

export const allTranslations: Record<Language, Translation> = {
  en,
  es,
  de,
  fr,
  it,
  pt,
  id,
  ja,
  ko,
  pl,
  ru,
  tr,
  uk,
  zh,
};
