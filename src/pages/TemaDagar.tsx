import '../css/TemaDagar.css';

type Theme = {
  id: number;
  title: string;
  description: string;
};

const themes: Theme[] = [
  {
    id: 1,
    title: "Familjevänliga filmer",
    description: "Filmer som hela familjen kan uppskatta tillsammans! Från Minsta knotten till gammla farfar!"
  },
  {
    id: 2,
    title: "Komedi",
    description: "LMAO XDDD"
  },
  {
    id: 3,
    title: "Action",
    description: "Mikael Vik"
  },
  {
    id: 4,
    title: "Klassisk",
    description: "Klassisker som än idag slår förväntningar"
  },
  {
    id: 5,
    title: "Romans",
    description: "Puss puss :*"
  },
  {
    id: 6,
    title: "Skräck",
    description: "Titta på egen risk! BuUUuUuUuUUUuu"
  },
  {
    id: 7,
    title: "Svart vitt",
    description: "Filmer utan färg, men med färgglad historia!"
  },
];

export default function Themes() {
  return (
    <div className="themes-container">
      <h2 className="themes-title">Teman</h2>

      <div className="themes-intro">
        <h3>Vad är temadagar?</h3>
        <p>
          Här hittar du olika filmteman som vi visar under våra temadagar.
          Perfekt för dig som vill upptäcka något nytt eller återuppleva gamla favoriter.
        </p>
      </div>

      <div className="themes-grid">
        {themes.map(theme => (
          <div key={theme.id} className="theme-card">
            <div className="theme-info">
              <h4 className="theme-name">{theme.title}</h4>
              <p className="theme-description">{theme.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}