export interface Film {
  filmid: number;
  title: string;
  duration: number;
  language: string;
  subtitle_language: string;
  trailer: string;
  description: string;
  cover_image: string;
  details: Filmdetails;
  genre: string;
  viewer_rating: 'btl' | 'bfj' | '7+' | '11+' | '15+' | string;
  priceid: number;

}

export interface Filmdetails {
  actor: string;
  director: string;
  release_year: string;
  production_company: string;
  production_counrty: string;
}