import type { DetectResponse } from "@/types/api/DetectResponse";
import type { DetectResultLanguage } from "@/types/api/DetectResultItem";

export class LanguageDetector {
  /**
   * Detect language from text with minimum confidence threshold
   */
  async detect(text: string): Promise<string> {
    let result: DetectResultLanguage | null = null;
    const cleanedText = text.trim();
    const translateResponse = await fetch(
      `${import.meta.env.VITE_DETECT_URL}access_key=${encodeURIComponent(import.meta.env.VITE_DETECT_API_KEY)}&query=${encodeURIComponent(cleanedText)}`,
    );
    const data: DetectResponse = await translateResponse.json();
    if (data.success) {
      const options = data.results.sort(
        ({ probability: a }, { probability: b }) => b - a,
      );
      result = options[0].language_code;
    }
    return JSON.stringify(result);
  }
}
