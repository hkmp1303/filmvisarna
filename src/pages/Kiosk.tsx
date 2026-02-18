import '../css/Kiosk.css';

const kioskItems = [
  {
    id: 1,
    name: "Popcorn",
    description: "Färskt poppade Popcorn med ett val av smör, kryddor och dressing!",
    price: "Liten - 45kr, Mellan - 55kr, Stor - 60kr",
    image: "/public/Kiosk/Popcorn.jpg"
  },
  {
    id: 2,
    name: "Soda",
    description: "Uppfriskande läsk som släcker törsten!",
    price: "Liten - 25kr, Mellan - 35kr, Stor - 40kr",
    image: "/public/Kiosk/Soda.jpg"
  },
  {
    id: 3,
    name: "Godismix",
    description: "En perfekt godismix för bio!",
    price: "Liten - 25kr, Mellan -  35kr, Stor - 40kr",
    image: "/public/Kiosk/Godis.jpg"
  },
  {
    id: 4,
    name: "Nachos",
    description: "Krispiga nachos med ett val av cheddar, salsa eller guacamååålééé!",
    price: "Liten - 55kr, Mellan - 65kr, Stor - 70kr",
    image: "/public/Kiosk/Nachos_2.jpg"
  },
  {
    id: 5,
    name: "Bacon Chips",
    description: "Saltigt knappriga Bacon Chips",
    price: "Liten - 15kr, Mellan - 25kr, Stor - 30kr",
    image: "/public/Kiosk/Bacon_Chips.jpg"
  },
  {
    id: 6,
    name: "Mjukglass",
    description: "Uppfriskande sött som passar perfekt till saltiga popcorn!",
    price: "Liten - 10kr, Mellan - 20kr, Stor - 25kr",
    image: "/public/Kiosk/Ice_Cream2.jpg"
  },
  {
    id: 7,
    name: "Pizza",
    description: "Het pizza med val av topping!",
    price: "Liten - 70kr, Mellan - 85kr, Stor - 99kr",
    image: "/public/Kiosk/Pizza_2.jpg"
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
              <p className="kiosk-price">
                {item.price.split(",").map((p, i) => (
                  <span key={i}>{p.trim()}</span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}