import { useCallback, useEffect, useReducer, useState } from "react";
import { TranslatePanel } from "./TranslatePanel";
import type { IQueryResponse } from "../types/IQueryResponse";
import type { Language } from "../types/Language";
import type { LanguageState } from "../types/LanguageState";
import type { LanguageAction } from "../types/LanguageAction";
import { LanguageDetector } from "../models/LanguageDetector";

// Helper function to get language name from code
const getLanguageDisplayName = (langCode: string): string => {
  const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
  try {
    return displayNames.of(langCode) || langCode;
  } catch {
    return langCode;
  }
};

function languageReducer(
  state: LanguageState,
  action: LanguageAction
): LanguageState {
  switch (action.type) {
    case "SET_SOURCE_LANGUAGE":
      return { ...state, sourceLanguage: action.payload };
    case "SET_TARGET_LANGUAGE":
      return { ...state, targetLanguage: action.payload };
    default:
      return state;
  }
}

function TranslateForm() {
  const [languageState, dispatch] = useReducer(languageReducer, {
    sourceLanguage: "detect",
    targetLanguage: "en",
  });

  const [sourceText, setSourceText] = useState("Hello, how are you?");
  const [translatedText, setTranslatedText] = useState(
    "Bonjour, comment allez-vous ?"
  );
  const [sourceLanguages, setSourceLanguages] = useState<Language[]>([
    { code: "detect", name: "Detect Language" },
  ]);
  const [targetLanguages, setTargetLanguages] = useState<Language[]>([]);
  const maxLength = 500;

  // Build language lists dynamically from available voices
  useEffect(() => {
    const buildLanguagesFromVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;

      // Extract unique language codes from all available voices
      const langMap = new Map<string, string>();
      voices.forEach((voice) => {
        const langCode = voice.lang.split("-")[0]; // Get base language code (e.g., "en" from "en-US")
        if (!langMap.has(langCode)) {
          langMap.set(langCode, getLanguageDisplayName(langCode));
        }
      });

      // Convert to Language array and sort alphabetically
      const allLanguages: Language[] = Array.from(langMap.entries())
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.name.localeCompare(b.name));

      // Split into main pills and dropdown
      const mainCodes = ["en", "fr"];
      const mainLanguages = allLanguages.filter((lang) =>
        mainCodes.includes(lang.code)
      );
      const otherLanguages = allLanguages.filter(
        (lang) => !mainCodes.includes(lang.code)
      );

      // Build source languages with detect option
      const sourceLangs: Language[] = [
        { code: "detect", name: "Detect Language" },
        ...mainLanguages,
      ];

      if (otherLanguages.length > 0) {
        sourceLangs.push({
          code: "more",
          name: "More Languages",
          hasDropdown: true,
          subLanguages: otherLanguages,
        });
      }

      // Build target languages without detect option
      const targetLangs: Language[] = [...mainLanguages];
      if (otherLanguages.length > 0) {
        targetLangs.push({
          code: "more",
          name: "More Languages",
          hasDropdown: true,
          subLanguages: otherLanguages,
        });
      }

      setSourceLanguages(sourceLangs);
      setTargetLanguages(targetLangs);
    };

    // Initial load
    buildLanguagesFromVoices();

    // Listen for voices to be loaded (some browsers load asynchronously)
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = buildLanguagesFromVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const getDetectedLanguage = (text: string) => {
    const detector = new LanguageDetector();
    return detector.detect(text);
  };

  const handleSetSourceLanguage = useCallback(
    async (code: Language["code"]) => {
      // Skip auto-translation if no text or if selecting "detect"
      if (!sourceText.trim() || code === "detect") {
        dispatch({ type: "SET_SOURCE_LANGUAGE", payload: code });
        return;
      }

      // Auto-translate the source text from current language to new language
      const oldLang = languageState.sourceLanguage;
      if (oldLang !== code && oldLang !== "detect") {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}q=${encodeURIComponent(
              sourceText
            )}&langpair=${oldLang}|${code}`,
            { method: "GET" }
          );
          const data: IQueryResponse = await response.json();
          if (data.responseStatus === 200) {
            setSourceText(data.responseData.translatedText);
          }
        } catch (error) {
          console.error("Auto-translation failed:", error);
        }
      }
      dispatch({ type: "SET_SOURCE_LANGUAGE", payload: code });
    },
    [sourceText, languageState.sourceLanguage]
  );

  const handleSetTargetLanguage = (code: Language["code"]) => {
    dispatch({ type: "SET_TARGET_LANGUAGE", payload: code });
  };

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;

    // Detect language if set to "detect"
    let actualSourceLang = languageState.sourceLanguage;
    if (languageState.sourceLanguage === "detect") {
      const detected = getDetectedLanguage(sourceText);
      actualSourceLang = detected ? detected.language : "en";
      // Update the source language state with detected language
      dispatch({ type: "SET_SOURCE_LANGUAGE", payload: actualSourceLang });
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}q=${encodeURIComponent(
        sourceText
      )}&langpair=${actualSourceLang}|${languageState.targetLanguage}`,
      { method: "GET" }
    );
    if (!response.ok) alert("Translation API error");
    const data: IQueryResponse = await response.json();
    if (data.responseStatus !== 200)
      return alert("Same languages are selected. Choose different languages.");
    setTranslatedText(data.responseData.translatedText);
  }, [sourceText, languageState]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSpeak = (text: string, lang: string) => {
    if ("speechSynthesis" in window && text.trim()) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      console.log("Lang", lang);
      // Select voice matching the language code
      const availableVoices = voices.filter((voice) =>
        voice.lang.includes(lang)
      );
      const activeVoice = availableVoices.find(({ name }) =>
        name.includes("Google")
      );
      console.log("Available voices:", availableVoices);
      if (availableVoices.length > 0) {
        utterance.voice = activeVoice!;
      } else alert("No voice found for the selected language.");
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="grid grid-cols-1 [&>div]:max-w-125 gap-4 lg:grid-cols-2">
      <TranslatePanel
        type="source"
        languages={sourceLanguages}
        selectedLanguage={languageState.sourceLanguage}
        text={sourceText}
        onLanguageChange={handleSetSourceLanguage}
        onTextChange={setSourceText}
        onCopy={handleCopy}
        onSpeak={handleSpeak}
        maxLength={maxLength}
        onTranslate={handleTranslate}
      />
      <TranslatePanel
        type="target"
        languages={targetLanguages}
        selectedLanguage={languageState.targetLanguage}
        text={translatedText}
        onLanguageChange={handleSetTargetLanguage}
        onTextChange={setTranslatedText}
        onCopy={handleCopy}
        onSpeak={handleSpeak}
        maxLength={maxLength}
        isReadOnly={true}
      />
    </div>
  );
}

export default TranslateForm;
