export interface Language {
  code: string;
  name: string;
  hasDropdown?: boolean;
  subLanguages?: Language[];
}
