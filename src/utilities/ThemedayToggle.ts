export function ThemedayToggle(genre: string) {
  const body = document.body;

  body.classList.forEach(className => {
    if (className.startsWith('genre-')) {
      body.classList.remove(className);
    }
  });

  const safeGenre = genre.toLocaleLowerCase().replace(/[\s&]/g, '');

  if (safeGenre && safeGenre !== 'default' && safeGenre !== '') {
    body.classList.add(`genre-${safeGenre}`);
    sessionStorage.setItem('selectedTheme', safeGenre);
  } else {
    sessionStorage.removeItem('selectedTheme');
  }
}