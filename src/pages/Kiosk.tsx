import '../css/Kiosk.css';

const kioskItems = [
  {
    id: 1,
    name: "Popcorn",
    description: "Färskt poppade Popcorn med ett val av smör, kryddor och dressing!",
    price: "45kr, 55kr, 60kr",
    image: "/public/Kiosk/Popcorn.jpg"
  },
  {
    id: 2,
    name: "Soda",
    description: "Uppfriskande läsk som släcker törsten!",
    price: "25kr, 35kr, 40kr",
    image: "/public/Kiosk/Soda.jpg"
  },
  {
    id: 3,
    name: "Godismix",
    description: "En perfekt godismix för bio!",
    price: "25kr, 35kr, 40kr",
    image: "/public/Kiosk/Godis.jpg"
  },
  {
    id: 4,
    name: "Nachos",
    description: "Krispiga nachos med ett val av cheddar, salsa eller guacamååålééé!",
    price: "55kr, 65kr, 70kr",
    image: "/public/Kiosk/Nachos_2.jpg"
  },
  {
    id: 5,
    name: "Bacon Chips",
    description: "Saltigt knappriga Bacon Chips",
    price: "Liten - 15kr, Mellan - 25kr, Stor - 30kr",
    image: "/public/Kiosk/Bacon_Chips.jpg"
  },
];

export default function Kiosk() {
  return (
    <div className="kiosk-container">
      <h1 className="kiosk-title">Kiosk Menu</h1>

      <div className="kiosk-grid">
        {kioskItems.map(item => (
          <div key={item.id} className="kiosk-item">
            <img src={item.image} alt={item.name} className="kiosk-image" />

            <div className="kiosk-info">
              <h2 className="kiosk-name">{item.name}</h2>
              <p className="kiosk-description">{item.description}</p>
              <p className="kiosk-price">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}