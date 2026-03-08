import { useEffect, useState } from "react";
import "../css/ProfilePage.css";

type Booking = {
  id: string;
  movieTitle: string;
  showtime: string;
};

type User = {
  firstname: string;
  lastname: string;
  email: string;
  profilePic?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();

      if (data.error) {
        console.error("Not logged in");
        setLoading(false);
        return;
      }

      setUser(data.user);
      setActiveBookings(data.activeBookings);
      setHistory(data.history);
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
      <section className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-6 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
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

        <div>
          <h2 className="text-2xl font-semibold">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </section>

      
      <section>
        <h3 className="text-xl font-semibold mb-3">Aktiva Bokningar</h3>
        <div className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-4 space-y-3">
          {activeBookings.length === 0 ? (
            <p className="text-gray-500">Inga Aktiva bokningar</p>
          ) : (
            activeBookings.map((b) => (
              <div
                key={b.id}
                className="border-b last:border-none pb-2 last:pb-0"
              >
                <p className="font-medium">{b.movieTitle}</p>
                <p className="text-sm text-gray-600">{b.showtime}</p>
              </div>
            ))
          )}
        </div>
      </section>


      <section>
        <h3 className="text-xl font-semibold mb-3">Historik</h3>
        <div className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-500">Du har inte sett någon film ännu</p>
          ) : (
            history.map((h) => (
              <div
                key={h.id}
                className="border-b last:border-none pb-2 last:pb-0"
              >
                <p className="font-medium">{h.movieTitle}</p>
                <p className="text-sm text-gray-600">{h.showtime}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}