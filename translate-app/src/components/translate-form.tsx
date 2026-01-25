import { useCallback, useEffect, useReducer, useState } from "react";
import DetectLanguage from "detectlanguage";
import { TranslatePanel } from "./translate-panel";
import type { IQueryResponse } from "../types/IQueryResponse";
import type { Language } from "../types/Language";
import type { LanguageState } from "../types/LanguageState";
import type { LanguageAction } from "../types/LanguageAction";
import toast from "react-hot-toast";

const MAX_LENGTH = 500;
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
  action: LanguageAction,
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

  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguages, setSourceLanguages] = useState<Language[]>([]);
  const [targetLanguages, setTargetLanguages] = useState<Language[]>([]);

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
        mainCodes.includes(lang.code),
      );
      const otherLanguages = allLanguages.filter(
        (lang) => !mainCodes.includes(lang.code),
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

  const getDetectedLanguage = async (text: string) => {
    const detectLanguage = new DetectLanguage(
      import.meta.env.VITE_DETECT_API_KEY,
    );
    const result = await detectLanguage.detectCode(text);
    return result;
  };

  const handleSetSourceLanguage = useCallback(
    async (code: Language["code"]) => {
      // Skip auto-translation if no text or if selecting "detect"
      if (!sourceText.trim()) {
        return;
      }

      if (code === "detect") {
        const detected = await getDetectedLanguage(sourceText);
        dispatch({
          type: "SET_SOURCE_LANGUAGE",
          payload: detected ? detected : "en",
        });
      }

      // Auto-translate the source text from current language to new language
      const oldLang = languageState.sourceLanguage;
      if (oldLang !== code && oldLang !== "detect") {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_TRANSLATE_URL}q=${encodeURIComponent(
              sourceText,
            )}&langpair=${oldLang}|${code}`,
            { method: "GET" },
          );
          const data: IQueryResponse = await response.json();
          if (data.responseStatus === 200) {
            setSourceText(data.responseData.translatedText);
          }
        } catch (error) {
          if (error instanceof Error)
            toast.error(`Auto-translation failed: ${error.message}`);
        }
      }
      dispatch({ type: "SET_SOURCE_LANGUAGE", payload: code });
    },
    [sourceText, languageState.sourceLanguage],
  );

  const handleSetTargetLanguage = (code: Language["code"]) => {
    dispatch({ type: "SET_TARGET_LANGUAGE", payload: code });
  };

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;

    // Detect language if set to "detect"
    let actualSourceLang = languageState.sourceLanguage;
    if (languageState.sourceLanguage === "detect") {
      const detected = await getDetectedLanguage(sourceText);
      actualSourceLang = detected ? detected : "en";
      dispatch({ type: "SET_SOURCE_LANGUAGE", payload: actualSourceLang });
    }

    const response = await fetch(
      `${import.meta.env.VITE_TRANSLATE_URL}q=${encodeURIComponent(
        sourceText,
      )}&langpair=${actualSourceLang}|${languageState.targetLanguage}`,
      { method: "GET" },
    );
    if (!response.ok) alert("Translation API error");
    const data: IQueryResponse = await response.json();
    if (data.responseStatus !== 200)
      return toast.error("Select different languages for translation.");
    setTranslatedText(data.responseData.translatedText);
  }, [sourceText, languageState]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSpeak = async (text: string, lang: string) => {
    if ("speechSynthesis" in window && text.trim()) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      let actualLang = lang;

      if (lang === "detect") {
        const detected = await getDetectedLanguage(text);
        actualLang = detected ? detected : "en";
      }
      // Select voice matching the language code
      const availableVoices = voices.filter((voice) =>
        voice.lang.includes(actualLang),
      );
      const activeVoice = availableVoices.find(({ name }) =>
        name.includes("Google"),
      );
      if (availableVoices.length > 0) {
        utterance.voice = activeVoice || availableVoices[0];
      } else {
        toast.error("No voice found for the selected language.");
        return;
      }
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
        maxLength={MAX_LENGTH}
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
        maxLength={MAX_LENGTH}
        isReadOnly={true}
      />
    </div>
  );
}

export default TranslateForm;
