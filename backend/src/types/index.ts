import type { ObjectId } from "mongodb";

export interface Brewery {
  _id: ObjectId;
  name: string;
  brewery_type: string;
  city: string;
  state: string;
  country: string;
  address_1?: string;
  address_2?: string;
  address_3?: string;
  postal_code?: string;
  phone?: string;
  website_url?: string;
  longitude?: string;
  latitude?: string;
  ImageLink?: string;
}

export interface Comment {
  _id: ObjectId;
  brewery_id: ObjectId;
  user_id: string;
  name: string;
  text: string;
  lastModified: Date;
}

export interface User {
  id: string;
  name: string;
}

export interface BreweryFilters {
  name?: string;
  brewery_type?: string;
  city?: string;
  state?: string;
}

export interface GetBreweriesParams {
  filters?: BreweryFilters | null;
  pageNumber?: number;
  itemsPerPage?: number;
}

export interface GetBreweriesResult {
  breweriesList: Brewery[];
  totalNumBreweries: number;
}
