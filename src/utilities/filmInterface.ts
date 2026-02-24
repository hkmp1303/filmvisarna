export interface BriefFilm {
  filmid: number;
  title: string;
  duration: number;
  language: string;
  cover_image: string;
  description: string;
  details: string;
  genre: string;
}

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
  actor: any;
  actors: Array<Actor>;
  director: string;
  release_year: string;
  production_company: string;
  production_counrty: string;
}

export interface Actor {
  name: string;
}