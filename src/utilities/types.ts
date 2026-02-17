export interface Movie {
  filmid: number;
  title: string;
  duration: number;
  language: string;
  cover_image: string;
  description: string;
  details: string;
  genre: string;
}

export type SortOption = 'title_asc' | 'title_desc' | 'newest' | 'oldest' | 'duration_asc' | 'duration_desc';