import { useState } from "react";
import Check from "../assets/Check.svg";
import ExpandDown from "../assets/Expand_down.svg";
import SoundFill from "../assets/sound_max_fill.svg";
import Copy from "../assets/Copy.svg";
import SortAlfa from "../assets/Sort_alfa.svg";
import type { Language } from "../types/Language";

interface TranslatePanelProps {
  type: "source" | "target";
  languages: Language[];
  selectedLanguage: string;
  text: string;
  onLanguageChange: (code: string) => void;
  onTextChange: (text: string) => void;
  onCopy: (text: string) => void;
  onSpeak: (text: string, lang: string) => void;
  maxLength: number;
  isReadOnly?: boolean;
  onTranslate?: () => void;
}

export function TranslatePanel({
  type,
  languages,
  selectedLanguage,
  text,
  onLanguageChange,
  onTextChange,
  onCopy,
  onSpeak,
  maxLength,
  isReadOnly = false,
  onTranslate,
}: TranslatePanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleCopyClick = () => {
    onCopy(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleDropdown = (code: string) => {
    setOpenDropdown(openDropdown === code ? null : code);
  };

  // Get the display name for the selected language
  const getDisplayName = (lang: Language) => {
    if (lang.hasDropdown && lang.subLanguages) {
      const selectedSub = lang.subLanguages.find(
        (sub) => sub.code === selectedLanguage
      );
      // Fallback to first sublanguage (e.g., Spanish) instead of "More Languages"
      return selectedSub
        ? selectedSub.name
        : lang.subLanguages[0]?.name || lang.name;
    }
    return lang.name;
  };

  return (
    <div className="rounded-3xl bg-overlay-dark border border-gray-light/20 p-6 backdrop-blur-sm">
      {/* Language Selector Pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {languages.map((lang) => (
          <div key={lang.code} className="relative">
            <button
              type="button"
              onClick={() => {
                if (lang.hasDropdown && lang.subLanguages) {
                  toggleDropdown(lang.code);
                } else {
                  onLanguageChange(lang.code);
                }
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                !lang.hasDropdown && selectedLanguage === lang.code
                  ? "bg-text-secondary text-light"
                  : lang.hasDropdown &&
                    lang.subLanguages &&
                    lang.subLanguages.some(
                      (sub) => sub.code === selectedLanguage
                    )
                  ? "bg-text-secondary text-light"
                  : "text-gray-light hover:bg-text-secondary/50"
              }`}
            >
              {getDisplayName(lang)}
              {lang.hasDropdown && (
                <img src={ExpandDown} alt="" className="ml-2 inline h-3 w-3" />
              )}
            </button>
            {lang.hasDropdown &&
              lang.subLanguages &&
              openDropdown === lang.code && (
                <div className="absolute top-full mt-2 z-10 bg-overlay-darker border border-gray-light/20 rounded-xl overflow-hidden shadow-lg max-h-80 overflow-y-auto">
                  {lang.subLanguages.map((subLang) => (
                    <button
                      key={subLang.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(subLang.code);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-medium transition ${
                        selectedLanguage === subLang.code
                          ? "bg-text-secondary text-light"
                          : "text-gray-light hover:bg-text-secondary/50"
                      }`}
                    >
                      {subLang.name}
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Text Input Area */}
      <div className="relative border-t pt-2 border-t-gray-light/20 mb-4">
        <textarea
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onTextChange(e.target.value);
            }
          }}
          readOnly={isReadOnly}
          className="min-h-45 w-full resize-none bg-transparent font-bold text-gray-light placeholder-gray-light focus:outline-none"
          placeholder={type === "source" ? "Enter text..." : "Translation"}
          maxLength={maxLength}
        />
      </div>

      {/* Bottom Controls */}
      <div className="flex h-20 items-end justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSpeak(text, selectedLanguage)}
            disabled={!text.trim()}
            className="flex h-10 w-10 border-3 border-text-secondary items-center justify-center rounded-xl bg-overlay-darker transition hover:bg-text-secondary/50 disabled:opacity-40"
            title="Speak"
          >
            <img src={SoundFill} alt="Speak" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleCopyClick}
            disabled={!text.trim()}
            className="flex h-10 w-10 border-3 border-text-secondary items-center justify-center rounded-xl bg-overlay-darker transition hover:bg-text-secondary/50 disabled:opacity-40"
            title={isCopied ? "Copied!" : "Copy"}
          >
            <img
              src={isCopied ? Check : Copy}
              alt={isCopied ? "Copied" : "Copy"}
            />
            {/*             
            {isCopied ? (
              <img src={Check} alt="Copied" />
            ) : (
              <img src={Copy} alt="Copy" />
            )} */}
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          {type.trim() === "source" && (
            <span className="text-sm self-end text-gray-light">
              {text.length}/{maxLength}
            </span>
          )}

          {onTranslate && (
            <button
              type="button"
              onClick={onTranslate}
              disabled={text.trim().length < 1}
              className="flex text-light items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white not-disabled:outline not-disabled:outline-primary-light transition hover:bg-primary-light disabled:brightness-50"
            >
              <img src={SortAlfa} alt="" />
              Translate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
