import type { SortOption } from '../utilities/types';
import type { BriefFilm } from '../utilities/filmInterface';


const getYear = (m: BriefFilm) => {
  try {
    const d = typeof m.details === 'string' ? JSON.parse(m.details) : m.details;
    return parseInt(d?.release_year) || 0;
  } catch { return 0; }
};

export function sortAndFilterMovies(
  movies: BriefFilm[],
  sortBy: SortOption,
  searchQuery: string,
  selectedGenre: string
): BriefFilm[] {


  const sorted = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'title_asc': return a.title.localeCompare(b.title);
      case 'title_desc': return b.title.localeCompare(a.title);
      case 'newest': return getYear(b) - getYear(a);
      case 'oldest': return getYear(a) - getYear(b);
      case 'duration_asc': return a.duration - b.duration;
      case 'duration_desc': return b.duration - a.duration;
      default: return 0;
    }
  });


  return sorted.filter((movie) => {
    const matchesSearch = searchQuery.trim() === '' ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === '' ||
      movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());



    return matchesSearch && matchesGenre;
  });
}