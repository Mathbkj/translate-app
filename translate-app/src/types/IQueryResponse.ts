export interface IQueryResponse {
  exception_code: string | null;

  matches: string;

  mtLangSupported: boolean | null;

  quotaFinished: boolean | null;

  responderId: string | null;

  responseData: {
    translatedText: string;
  };

  responseDetails: string;

  responseStatus: number;
}
