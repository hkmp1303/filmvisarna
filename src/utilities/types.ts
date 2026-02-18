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
export interface User {
  userid: number;    // Matchar DB (int unsigned)
  email: string;     // Matchar DB
  firstname: string; // Matchar DB
  lastname: string;  // Matchar DB
  phone?: string;    // Matchar DB
  role?: 'visitor' | 'staff' | 'member'; // Matchar DB enum
}
export type SortOption = 'title_asc' | 'title_desc' | 'newest' | 'oldest' | 'duration_asc' | 'duration_desc';