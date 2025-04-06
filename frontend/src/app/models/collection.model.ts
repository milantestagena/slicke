import { CollectionItem , Country } from "./";

export interface Collection {
  id: number;
  type: string;
  name: string;
  description: string;
  link: string;
  year: number;
  items: CollectionItem[];
  countries: Country[];
}
