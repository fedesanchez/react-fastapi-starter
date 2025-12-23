export interface FetchParams {
  [key: string]: string | number | boolean;
}

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}
