import { LANGUAGE_DATABASE, LANGUAGE_NAMES } from "../lib/constants";
import type { DetectionResult } from "../types/DetectionResult";
import type { LanguageScore } from "../types/LanguageScore";
import { ScoringEngine } from "./ScoringEngine";
import { TextUtils } from "./TextUtils";

export class LanguageDetector {
  private scoringEngine: ScoringEngine;

  constructor() {
    this.scoringEngine = new ScoringEngine();
  }

  /**
   * Detect language from text with minimum confidence threshold
   */
  detect(text: string, minConfidence: number = 0.3): DetectionResult | null {
    if (!TextUtils.isValidText(text)) {
      return null;
    }

    const words = TextUtils.normalizeText(text);
    const scores: Record<string, LanguageScore> = {};

    // Calculate scores for all languages
    for (const [lang, features] of Object.entries(LANGUAGE_DATABASE)) {
      scores[lang] = this.scoringEngine.calculateTotalScore(
        text,
        words,
        features
      );
    }

    // Find the best match
    let bestLang = "";
    let bestScore = 0;
    let bestMatchCount = 0;

    for (const [lang, scoreData] of Object.entries(scores)) {
      if (scoreData.score > bestScore) {
        bestScore = scoreData.score;
        bestLang = lang;
        bestMatchCount = scoreData.matchCount;
      }
    }

    // Normalize confidence
    const confidence = this.scoringEngine.normalizeConfidence(
      bestScore,
      words.length
    );

    if (confidence < minConfidence) {
      return null;
    }

    return {
      language: bestLang,
      languageName: LANGUAGE_NAMES[bestLang] || "Unknown",
      confidence: Math.round(confidence * 100) / 100,
      matchedWords: bestMatchCount,
      totalWords: words.length,
    };
  }

  /**
   * Detect multiple possible languages with confidence scores
   */
  detectMultiple(text: string, topN: number = 3): DetectionResult[] {
    if (!TextUtils.isValidText(text)) {
      return [];
    }

    const words = TextUtils.normalizeText(text);
    const results: DetectionResult[] = [];

    for (const [lang, features] of Object.entries(LANGUAGE_DATABASE)) {
      const scoreData = this.scoringEngine.calculateTotalScore(
        text,
        words,
        features
      );
      const confidence = this.scoringEngine.normalizeConfidence(
        scoreData.score,
        words.length
      );

      results.push({
        language: lang,
        languageName: LANGUAGE_NAMES[lang] || "Unknown",
        confidence: Math.round(confidence * 100) / 100,
        matchedWords: scoreData.matchCount,
        totalWords: words.length,
      });
    }

    return results
      .filter((r) => r.confidence > 0.1)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, topN);
  }
}
