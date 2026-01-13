import type { LanguageFeatures } from "../types/LanguageFeatures";
import type { LanguageScore } from "../types/LanguageScore";
import { TextUtils } from "./TextUtils";

export class ScoringEngine {
  private readonly characterSetWeight = 0.3;
  private readonly diacriticMultiplier = 2;
  private readonly wordMatchWeight = 1;

  /**
   * Calculate character set score for a language
   */
  calculateCharacterSetScore(text: string, features: LanguageFeatures): number {
    const hasCharSet = TextUtils.hasCharacterSet(
      text,
      features.characterPattern
    );
    return hasCharSet ? this.characterSetWeight * features.weight : 0;
  }

  /**
   * Calculate diacritic score for a language
   */
  calculateDiacriticScore(text: string, features: LanguageFeatures): number {
    if (!features.diacritics) {
      return 0;
    }

    const density = TextUtils.calculateDiacriticDensity(
      text,
      features.diacritics
    );
    return density > 0
      ? density * this.diacriticMultiplier * features.weight
      : 0;
  }

  /**
   * Calculate word matching score for a language
   */
  calculateWordMatchScore(
    words: string[],
    features: LanguageFeatures
  ): LanguageScore {
    let matchCount = 0;

    for (const word of words) {
      if (features.commonWords.has(word)) {
        matchCount++;
      }
    }

    return {
      score: matchCount * this.wordMatchWeight * features.weight,
      matchCount,
    };
  }

  /**
   * Calculate total score for a language
   */
  calculateTotalScore(
    text: string,
    words: string[],
    features: LanguageFeatures
  ): LanguageScore {
    const charSetScore = this.calculateCharacterSetScore(text, features);
    const diacriticScore = this.calculateDiacriticScore(text, features);
    const wordScore = this.calculateWordMatchScore(words, features);

    return {
      score: charSetScore + diacriticScore + wordScore.score,
      matchCount: wordScore.matchCount,
    };
  }

  /**
   * Normalize confidence score to 0-1 range
   */
  normalizeConfidence(score: number, totalWords: number): number {
    const maxPossibleScore = totalWords * 1.5;
    return Math.min(score / maxPossibleScore, 1);
  }
}
