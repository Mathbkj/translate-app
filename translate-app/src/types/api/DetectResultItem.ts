import type { DetectResponse } from "./DetectResponse";

export type DetectResultLanguage =
  DetectResponse["results"][number]["language_code"];
