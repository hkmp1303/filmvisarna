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