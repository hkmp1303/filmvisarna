import '../css/Kiosk.css';

const kioskItems = [
  {
    id: 1,
    name: "Popcorn",
    description: "Färskt poppade Popcorn med ett val av smör, kryddor och dressing!",
    price: "Liten - 45kr, Mellan - 55kr, Stor - 60kr",
    image: "/Kiosk/Popcorn.jpg"
  },
  {
    id: 2,
    name: "Soda",
    description: "Uppfriskande läsk som släcker törsten!",
    price: "Liten - 25kr, Mellan - 35kr, Stor - 40kr",
    image: "/Kiosk/Soda.jpg"
  },
  {
    id: 3,
    name: "Godismix",
    description: "En perfekt godismix för bio!",
    price: "Liten - 25kr, Mellan -  35kr, Stor - 40kr",
    image: "/Kiosk/Godis.jpg"
  },
  {
    id: 4,
    name: "Nachos",
    description: "Krispiga nachos med ett val av cheddar, salsa eller guacamååålééé!",
    price: "Liten - 55kr, Mellan - 65kr, Stor - 70kr",
    image: "/Kiosk/Nachos_2.jpg"
  },
  {
    id: 5,
    name: "Bacon Chips",
    description: "Saltigt knappriga Bacon Chips",
    price: "Liten - 15kr, Mellan - 25kr, Stor - 30kr",
    image: "/Kiosk/Bacon_Chips.jpg"
  },
  {
    id: 6,
    name: "Mjukglass",
    description: "Uppfriskande sött som passar perfekt till saltiga popcorn!",
    price: "Liten - 10kr, Mellan - 20kr, Stor - 25kr",
    image: "/Kiosk/Ice_Cream2.jpg"
  },
  {
    id: 7,
    name: "Pizza",
    description: "Het pizza med val av topping!",
    price: "Liten - 70kr, Mellan - 85kr, Stor - 99kr",
    image: "/Kiosk/Pizza_2.jpg"
  },
];

export default function Kiosk() {
  return (
    <div className="kiosk-container">
      <h1 className="kiosk-title">Kiosk Menu</h1>

      <div className='kiosk-text'>
        <p className='kiosk-lead'>
          I våran mysiga kiosk hittar du allt du behöver för en komplett bioupplevelse från nypoppade popcorn till dina favoritdrycker.</p>
        <p>
          <strong>Observera:</strong> All försäljning sker på plats. Kom gärna i god tid
          innan filmen börjar för att säkra dina godsaker!
        </p>
      </div>

      <div className="kiosk-grid">
        {kioskItems.map(item => (
          <div key={item.id} className="kiosk-item">
            <img src={item.image} alt={item.name} className="kiosk-image" />

            <div className="kiosk-info">
              <h3 className="kiosk-name text-[#fdfff1]">{item.name}</h3>
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

//=========================================
//        ABOVE IS THE OG CODE
//     -BELOW IS THE TAILWIND CODE-
//=========================================


// const kioskItems = [
//   {
//     id: 1,
//     name: "Popcorn",
//     description: "Färskt poppade Popcorn med ett val av smör, kryddor och dressing!",
//     price: "Liten - 45kr, Mellan - 55kr, Stor - 60kr",
//     image: "/Kiosk/Popcorn.jpg"
//   },
//   {
//     id: 2,
//     name: "Soda",
//     description: "Uppfriskande läsk som släcker törsten!",
//     price: "Liten - 25kr, Mellan - 35kr, Stor - 40kr",
//     image: "/Kiosk/Soda.jpg"
//   },
//   {
//     id: 3,
//     name: "Godismix",
//     description: "En perfekt godismix för bio!",
//     price: "Liten - 25kr, Mellan -  35kr, Stor - 40kr",
//     image: "/Kiosk/Godis.jpg"
//   },
//   {
//     id: 4,
//     name: "Nachos",
//     description: "Krispiga nachos med ett val av cheddar, salsa eller guacamååålééé!",
//     price: "Liten - 55kr, Mellan - 65kr, Stor - 70kr",
//     image: "/Kiosk/Nachos_2.jpg"
//   },
//   {
//     id: 5,
//     name: "Bacon Chips",
//     description: "Saltigt knappriga Bacon Chips",
//     price: "Liten - 15kr, Mellan - 25kr, Stor - 30kr",
//     image: "/Kiosk/Bacon_Chips.jpg"
//   },
//   {
//     id: 6,
//     name: "Mjukglass",
//     description: "Uppfriskande sött som passar perfekt till saltiga popcorn!",
//     price: "Liten - 10kr, Mellan - 20kr, Stor - 25kr",
//     image: "/Kiosk/Ice_Cream2.jpg"
//   },
//   {
//     id: 7,
//     name: "Pizza",
//     description: "Het pizza med val av topping!",
//     price: "Liten - 70kr, Mellan - 85kr, Stor - 99kr",
//     image: "/Kiosk/Pizza_2.jpg"
//   },
// ];

// export default function Kiosk() {
//   return (
//     <div className="px-6 py-10 max-w-5xl mx-auto">
//       <h1 className="text-center mb-10 text-4xl md:text-5xl text-[#fffdc4] italic md:not-italic">
//         Kiosk Menu
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
//         {kioskItems.map(item => (
//           <div
//             key={item.id}
//             className="
//               bg-white/60 rounded-xl p-4 shadow
//               text-center
//               md:flex md:items-center md:gap-8 md:text-left md:text-2xl
//             "
//           >
//             <img
//               src={item.image}
//               alt={item.name}
//               className="
//                 w-full h-40 object-cover rounded-lg
//                 md:w-1/2 md:h-auto md:max-h-[360px]
//               "
//             />

//             <div
//               className="
//                 mt-4 md:mt-0
//                 md:w-1/2 md:flex md:flex-col md:justify-center md:gap-6
//                 md:bg-white/60 md:rounded-xl md:p-4 md:shadow
//               "
//             >
//               <h2 className="text-xl md:text-3xl mb-2">{item.name}</h2>

//               <p className="text-sm text-gray-600 mb-3 md:text-2xl md:italic">
//                 {item.description}
//               </p>

//               <p
//                 className="
//                   grid font-bold text-lg
//                   md:flex md:gap-24 md:text-3xl
//                 "
//               >
//                 {item.price.split(",").map((p, i) => (
//                   <span key={i}>{p.trim()}</span>
//                 ))}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }