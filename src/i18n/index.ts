import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { t as translate, type TranslationKey } from './translations';

export function useTranslation() {
  const { language } = useApp();

  const t = useCallback(
    (key: TranslationKey) => translate(language, key),
    [language],
  );

  return { t, language };
}

export { t as translate } from './translations';
export type { TranslationKey } from './translations';
export { LANGUAGES, getLanguage, DEFAULT_LANGUAGE } from './languages';
export type { LanguageCode, Language } from './languages';
