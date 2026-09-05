export type LanguageCode =
  | 'hi'
  | 'en'
  | 'ta'
  | 'te'
  | 'mr'
  | 'gu'
  | 'bn'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  greeting: string;
}

export const LANGUAGES: Language[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', greeting: 'नमस्ते' },
  { code: 'en', name: 'English', nativeName: 'English', greeting: 'Namaste' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', greeting: 'வணக்கம்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', greeting: 'నమస్కారం' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', greeting: 'नमस्कार' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', greeting: 'નમસ્તે' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', greeting: 'নমস্কার' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', greeting: 'നമസ്കാരം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', greeting: 'ନମସ୍କାର' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'hi';

export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]!;
}
