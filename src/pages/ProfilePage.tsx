import { useEffect, useState } from "react";
import "../css/ProfilePage.css";
import type { User } from "../utilities/userInterface";
import type { Booking } from "../utilities/bookingInterface";
import useFetchJson from "../utilities/useFetchJson";


// CHANGE PASSWORD BUTTON //

// ------------------------------------------------------------------------
function ChangePasswordButton() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMessage(data.message || "Lösenordet har uppdaterats!");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch {
      setError("Något gick fel. Försök igen.");
    }

    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="change-password-btn">
        Byt lösenord
      </button>

      {open && (
        <div className="popup-restofpage">
          <div className="main-popup">
            <h2 className="popup-title">Byt lösenord</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="subtitles-popup">
                  Nuvarande lösenord
                </label>
                <input
                  type="password"
                  className="popup-innerborder"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="subtitles-popup">
                  Nytt lösenord
                </label>
                <input
                  type="password"
                  className="popup-innerborder"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="popup-cancelbutton"
                >
                  Avbryt
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="popup-updatebutton"
                >
                  {loading ? "Sparar..." : "Uppdatera"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ---------End of Change password button--------------


export default function ProfilePage() {
  const data = useFetchJson<{
    user: User;
    activeBookings: Booking[];
    history: Booking[];
    error?: string;
  }>("/api/profileinformation");

  if (data === null) {
    return (
      <div className="loading-profile">
        <p>Laddar profilsidan</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="login-error-container">
        <h2>Du måste vara inloggad för att se din profil</h2>
        <p>Hur fan kom du ens hit? O_o</p>
      </div>
    );
  }

  const user = data.user;
  const activeBookings = data.activeBookings ?? [];
  const history = data.history ?? [];

  const handleLogout = async () => {
    try {
      await fetch("/api/login", { method: "DELETE" });
      window.location.href = "/";
    } catch (err) {
      console.error("Kunde inte logga ut", err);
    }
  };


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
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover opacity-70 mx-auto"
            />
          ) : (
            <img
              src="/ProfilePics/profile_pic_default.svg"
              alt="Default profile"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover opacity-70 mx-auto"
            />
          )}
        </div>

        <div className="profile-details">
          <h2 className="text-2xl font-semibold">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="profile-actions">
          <ChangePasswordButton />
          <button onClick={handleLogout} className="logout-btn">
            Logga ut
          </button>
        </div>


      </section>

      <section>
        <h3 className="profile_booking_title">Aktiva Bokningar</h3>
        <div className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-4 space-y-3">
          {activeBookings.length === 0 ? (
            <p className="profile_no_bookings_titles">Inga Aktiva bokningar</p>
          ) : (
            activeBookings.map((b) => {
              console.log("Active booking:", b);

              return (
                <div
                  key={b.id}
                  className="flex items-center gap-4 border-b last:border-none pb-2 last:pb-0"
                  onClick={async () => {
                    const res = await fetch(`/api/booking/byid/${b.id}`);
                    const data = await res.json();
                    if (data?.guid) window.location.href = `/confirmbooking?guid=${data.guid}`;
                  }}
                  style={{ cursor: "pointer" }}>
                  
                  <img
                    src={b.poster}
                    alt={b.movieTitle}
                    className="w-16 h-24 object-cover rounded"/>

                  <div>
                  <p className="font-medium">{b.movieTitle}</p>
                  <p className="text-sm text-gray-600">{b.showtime}</p>
                  </div>

                </div>
              );
            })
          )}

        </div>
      </section>

      <section>
        <h3 className="profile_booking_title">Historik</h3>
        <div className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-4 space-y-3">
          {history.length === 0 ? (
            <p className="profile_no_bookings_titles">
              Du har inte sett någon film ännu
            </p>
          ) : (
            history.map((h) => {
              console.log("History booking:", h);

              return (
                <div
                  key={h.id}
                  className="flex items-center gap-4 border-b last:border-none pb-2 last:pb-0">
                  
                  <img
                    src={h.poster}
                    alt={h.movieTitle}
                    className="w-16 h-24 object-cover rounded"/>
                  
                  <div>
                  <p className="font-medium">{h.movieTitle}</p>
                  <p className="text-sm text-gray-600">{h.showtime}</p>
                  </div>

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
// #        for MySQL WITH posters,          #
// #               saving it                 #
// #             just in case                #
// #                                         #
// ###########################################


// CREATE OR REPLACE VIEW user_booking_view AS;
// SELECT;
// b.bookingid AS id,
//   b.userid,
//   b.status,
//   b.date AS bookingDate,
//     s.start AS showtime,
//       f.title AS movieTitle,
//         f.cover_image AS poster
// FROM booking b
// JOIN screening s ON b.screeningid = s.screeningid
// JOIN film f ON s.filmid = f.filmid;
