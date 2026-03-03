export default function genre(genre: string): string {
  const translation: Record<string, string> = {
    action: 'Action',
    blackandwhite: 'Svart Vitt',
    classic: 'Klassisk',
    comedy: 'Komedi',
    family: 'Familj',
    holiday: 'Ferie',
    horror: 'Skräck',
    romance: 'Romantisk'
  };
  return translation[genre] ?? "";
}

export function displayVeiwerRating(viewer_rating: string): string {
  const display: Record<string, string> = {
    btl: 'Barntilläten',
    '7+': '7+',
    '11+': '11+',
    '15+': '15+',
    bfj: 'Barnförbjuden'
  };
  return display[viewer_rating] ?? "";
}