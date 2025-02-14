export interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
}

export interface GoogleSearchItem {
  title: string;
  link: string;
  snippet?: string;
}
