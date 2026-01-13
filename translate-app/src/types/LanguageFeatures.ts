export interface LanguageFeatures {
  commonWords: Set<string>;
  characterPattern: RegExp;
  diacritics?: string[];
  weight: number;
}
