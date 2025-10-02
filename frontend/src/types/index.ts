export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  city: string;
  state: string;
  postal_code?: string;
  country?: string;
  website_url?: string;
  phone?: string;
  ImageLink?: string;
}

export interface Comment {
  id: string;
  brewery_id: string;
  name: string;
  user_id: string;
  text: string;
  lastModified: string;
}

export interface User {
  id: string;
  name: string;
}

export interface BreweriesResponse {
  breweries: Brewery[];
  page: number;
  filters: Record<string, string>;
  entries_per_page: number;
  total_results: number;
}
