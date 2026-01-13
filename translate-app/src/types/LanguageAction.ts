export type LanguageAction =
  | { type: "SET_SOURCE_LANGUAGE"; payload: string }
  | { type: "SET_TARGET_LANGUAGE"; payload: string };
