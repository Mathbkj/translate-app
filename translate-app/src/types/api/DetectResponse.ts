export interface DetectResponse {
  success: boolean;
  results: Array<{
    language_code: string;
    language_name: string;
    probability: number;
    percentage: number;
    reliable_result: boolean;
  }>;
}
