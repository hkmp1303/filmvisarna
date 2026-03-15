export interface BriefFilm {
  filmid: number;
  title: string;
  duration: number;
  language: string;
  cover_image: string;
  description: string | undefined;
  details: string | undefined;
  genre: string;
  viewer_rating: 'btl' | 'bfj' | '7+' | '11+' | '15+' | string;
  screenings: string[] | undefined;
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

export function sortViewerRating(a: string, b: string): number {
  const order = ['btl', '7+', '11+', '15+', 'bfj'];
  return order.indexOf(a) > order.indexOf(b) ? 1 : -1;
}
