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
  viewerRating: BinaryType;
  priceid: number;

}

export interface Filmdetails {
  actor: string;
  director: string;
  release_year: string;
  production_company: string;
  production_counrty: string;
}