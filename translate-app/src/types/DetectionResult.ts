export interface DetectionResult {
  language: string;
  languageName: string;
  confidence: number;
  matchedWords: number;
  totalWords: number;
}
