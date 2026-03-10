import '../css/TemaDagar.css';

type Theme = {
  id: number;
  title: string;
  tagline: string;
  description: string;
};

const themes: Theme[] = [
  {
    id: 1,
    title: "Familjefilmer",
    tagline: "Upplev magin tillsammans!",
    description: "Vi visar att från tidlösa klassiska familjefilmer till de senaste stora animerade som roar både stora och små. Vi anpassar ljudnivån och erbjuder förmånliga familjepaket på popcorn och dricka för en perfekt gemensam filmupplevelse."
  },
  {
    id: 2,
    title: "Komedi",
    tagline: "En riktigt skrattfest",
    description: "Låt Filmvisaren bjuda in till en rejäl dos humor. Vi har handplockat de största komedierna och de vassaste komikerna för en garanted skrattfyld kväll där vardagens bekymmer lämnas utanför dörren."
  },
  {
    id: 3,
    title: "Action",
    tagline: "Adrenalin & stora explosioner.",
    description: "Spänning, maxat tempo och oförglömliga stunts. Vi bjuder in dig till ditt livs filmupplevelse i våra salonger med högkvalitativt surroundljud, där varje explosion och biljakt känns i hela kroppen."
  },
  {
    id: 4,
    title: "Klassisk",
    tagline: "Njut av en ordentlig kultfilm.",
    description: "Vissa filmer blir bara bättre med åren. Följ med oss när vi dammar av mästerverken som format filmhistorien. Här får du chansen att se de stora legenderna på den vita duken, precis som det var tänkt från början."
  },
  {
    id: 5,
    title: "Romantik",
    tagline: "Stora känslor, tårar och kärlek som övervinner allt",
    description: "Filmvisaren visar de mest gripande berättelserna för dig som älskar film som berör på djupet. Perfekt för en dejt eller en kväll med vännerna där glädje, sorg och hopp står i centrum."
  },
  {
    id: 6,
    title: "Svart vitt",
    tagline: "Filmer utan färg, men fulla av liv!",
    description: "Upptäck charmen i det monokroma. Från tidiga film noir-mästerverk till moderna indie-projekt som valt bort färg för att låta skuggspel och berättande tala. En unik upplevelse för den sanna filmälskaren."
  },
  {
    id: 7,
    title: "Skräck",
    tagline: "Vågar du sitta kvar när ljuset släcks?",
    description: "Vi fyller våra mörkaste salonger med de mest hårresande rysarna som någonsin visats. Med förstärkt ljud och en atmosfär laddad med spänning garanterar vi att du inte lämnar biografen oberörd."
  },
  {
    id: 8,
    title: "Ferie",
    tagline: "Högtidsmagi och nostalgi",
    description: "När högtiderna närmar sig pyntar vi biografen och rullar ut ett särskilt kurerat program. Oavsett om det är julstämning eller Halloween-rys så skapar vi en helhetsupplevelse som förgyller ledigheten."
  },
];

export default function Themes() {
  return (
    <div className="themes-container">
      <h2 className="themes-title">Temadagar</h2>

      <div className="themes-intro">
        <h3>Vad är temadagar?</h3>
        <p> Varje helg kör filmvisaren våra temadagar.</p>
        <p>Då har du möjlighet att se filmer i dina favorit genres</p>
        <p>På högtider så som Jul och Halloween kör vi film ut på genres som passar högtiderna.</p>
      </div>

      <div className="themes-grid">
        {themes.map(theme => (
          <div key={theme.id} className="theme-card">
            <div className="theme-info">
              <h3 className="theme-name">{theme.title}</h3>
              <h4 className='text-center mb-2'>{theme.tagline}</h4>
              <p className="theme-description">{theme.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}