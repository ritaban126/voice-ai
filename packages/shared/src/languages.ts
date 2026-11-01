// Languages shown in the signup carousel. One language is used for the whole app (UI, voice in, voice out).
export const LANG_CODES = ['hi', 'bn', 'ta', 'en'] as const;
export type LangCode = (typeof LANG_CODES)[number];

export interface LanguageInfo {
  code: LangCode;
  nativeLabel: string;
  englishLabel: string;
  bcp47: string; // for browser/Intl use; the Gnani adapter has its own mapping
}

export const LANGUAGES: Record<LangCode, LanguageInfo> = {
  hi: { code: 'hi', nativeLabel: 'हिंदी', englishLabel: 'Hindi', bcp47: 'hi-IN' },
  bn: { code: 'bn', nativeLabel: 'বাংলা', englishLabel: 'Bengali', bcp47: 'bn-IN' },
  ta: { code: 'ta', nativeLabel: 'தமிழ்', englishLabel: 'Tamil', bcp47: 'ta-IN' },
  en: { code: 'en', nativeLabel: 'English', englishLabel: 'English', bcp47: 'en-IN' },
};

export const LANGUAGE_LIST: LanguageInfo[] = LANG_CODES.map((c) => LANGUAGES[c]);
export const DEFAULT_LANG: LangCode = 'hi';

export function isLang(value: unknown): value is LangCode {
  return typeof value === 'string' && (LANG_CODES as readonly string[]).includes(value);
}