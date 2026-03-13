import { useEffect, useState } from "react";
import "../css/ProfilePage.css";
import type { User } from "../utilities/userInterface";
import type { Booking } from "../utilities/bookingInterface";


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);


  const handleLogout = async () => {
    try {
      await fetch('/api/login', { method: 'DELETE' });   // Använde Timoty's "handleLogout" funktion han skapade i "Login.tsx". Very Sigma :)
      setUser(null);
    } catch (err) {
      console.error("Kunde inte logga ut", err);
    }
  };


  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profileinformation");
      const data = await res.json();

      console.log("Active bookings from API:", data.activeBookings);
      console.log("History from API:", data.history);

      if (data.error) {
        console.error("Not logged in");
        setLoading(false);
        return;
      }

      setUser(data.user);
      setActiveBookings(Array.isArray(data.activeBookings) ? data.activeBookings : []);
      setHistory(Array.isArray(data.history) ? data.history : []); 
      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) {
    return <p>Laddar profilsidan</p>;
  }

  if (!user) {
    return <p>Du måste vara inloggad för att se din profil</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <section className="profile-header">
        <div className="profile-info">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Ingen bild uppladdad ännu
            </div>
          )}
        </div>

        <div className="profile-details">
          <h2 className="text-2xl font-semibold">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logga ut
        </button>

      </section>

      
      <section>
        <h3 className="text-xl font-semibold mb-3">Aktiva Bokningar</h3>
        <div className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-4 space-y-3">
          {activeBookings.length === 0 ? (
            <p className="border-b last:border-none pb-2 last:pb-0">Inga Aktiva bokningar</p>
          ) : (
            activeBookings.map((b) => {
              console.log("Active booking:", b);

              return (
                <div
                  key={b.id}
                  className="border-b last:border-none pb-2 last:pb-0"
                >
                  <p className="font-medium">{b.movieTitle}</p>
                  <p className="text-sm text-gray-600">{b.showtime}</p>
                </div>
              );
            })
          )}

        </div>
      </section>


      <section>
        <h3 className="text-xl font-semibold mb-3">Historik</h3>
        <div className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-600 text-base font-medium py-2">
              Du har inte sett någon film ännu
            </p>
          ) : (
            history.map((h) => {
              console.log("History booking:", h);

              return (
                <div
                  key={h.id}
                  className="border-b last:border-none pb-2 last:pb-0"
                >
                  <p className="font-medium">{h.movieTitle}</p>
                  <p className="text-sm text-gray-600">{h.showtime}</p>
                </div>
              );
            })
          )}

        </div>
      </section>
    </div>
  );
}







// ###########################################
// #                                         #
// #        Down below is my View            #
// #        for MySQL, saving it             #
// #             just in case                #
// #                                         #
// ###########################################


// CREATE OR REPLACE VIEW user_booking_view AS
// SELECT
// b.bookingid AS id,
//   b.userid,
//   b.status,
//   b.date AS bookingDate,
//     s.start AS showtime,
//       f.title AS movieTitle
// FROM booking b
// JOIN screening s ON b.screeningid = s.screeningid
// JOIN film f ON s.filmid = f.filmid;
