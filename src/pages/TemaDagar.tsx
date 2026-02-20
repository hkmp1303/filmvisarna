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
    description: "Klassiska filmer som än idag ses av människor "
  },
  {
    id: 5,
    title: "Action",
    description: "Mikael Vik"
  },
  {
    id: 6,
    title: "Skräck",
    description: "Titta på egen risk! Buuuuuuu"
  },
  {
    id: 7,
    title: "Svart vitt",
    description: "Svartvita filmer, kan hjälpa er o era ungar med deras jävla brainrot tiktok skit"
  },
];

export default function Themes() {
  return (
    <div className="themes-container">
      <h1 className="themes-title">Teman</h1>

      <div className="themes-intro">
        <h2>Vad är temadagar?</h2>
        <p>
          Här hittar du olika filmteman som vi visar under våra temadagar.
          Perfekt för dig som vill upptäcka något nytt eller återuppleva gamla favoriter.
        </p>
      </div>

      <div className="themes-grid">
        {themes.map(theme => (
          <div key={theme.id} className="theme-card">
            <div className="theme-info">
              <h3 className="theme-name">{theme.title}</h3>
              <p className="theme-description">{theme.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}