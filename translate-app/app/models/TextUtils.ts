export class TextUtils {
  /**
   * Normalize text for processing by removing punctuation and splitting into words
   */
  static normalizeText(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\s]/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length > 0);
  }

  /**
   * Check if text contains specific character sets
   */
  static hasCharacterSet(text: string, pattern: RegExp): boolean {
    return pattern.test(text);
  }

  /**
   * Calculate diacritic density for romance languages
   */
  static calculateDiacriticDensity(
    text: string,
    diacritics?: string[]
  ): number {
    if (!diacritics || diacritics.length === 0) {
      return 0;
    }

    let count = 0;
    const lowerText = text.toLowerCase();

    for (const char of lowerText) {
      if (diacritics.includes(char)) {
        count++;
      }
    }

    return text.length > 0 ? count / text.length : 0;
  }

  /**
   * Validate input text
   */
  static isValidText(text: string, minLength: number = 3): boolean {
    return Boolean(text && text.trim().length >= minLength);
  }
}
