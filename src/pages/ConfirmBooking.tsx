import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchJson from '../utilities/fetchJson';
import { formatDateIso, formatDay, formatHourMin } from '../utilities/formatDateTime';

interface BookingReceipt {
  guid: string;
  status: string;
  title: string;
  cover_image: string;
  start: string;
  room_number: number;
  total_cost: number;
  seats: number[];
}

export default function ConfirmBooking() {
  const qs = new URLSearchParams(useLocation().search);
  const guid = qs.get("guid");
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingReceipt | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!guid) { setError("Inget boknings-ID angivet."); return; }
    fetchJson(`/api/booking/${guid}`)
      .then(data => {
        if (data?.error) setError(data.error);
        else setBooking(data);
      })
      .catch(() => setError("Kunde inte ladda bokning."));
  }, [guid]);

  if (error) return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h2 style={{ color: "var(--font-primary)" }}>{error}</h2>
      <button onClick={() => navigate("/")} style={btnStyle}>Gå till startsidan</button>
    </div>
  );

  if (!booking) return (
    <div style={{ textAlign: "center", padding: "4rem", color: "var(--font-primary)" }}>
      Laddar bokning...
    </div>
  );

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>✓ Bokning bekräftad</h2>

        <div style={movieRowStyle}>
          <img src={booking.cover_image} alt={booking.title} style={posterStyle} />
          <div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--font-primary)" }}>
              {booking.title}
            </h3>
            <p style={infoStyle}><b>Datum:</b> {formatDateIso(booking.start)}</p>
            <p style={infoStyle}><b>Dag:</b> {formatDay(booking.start)} kl {formatHourMin(booking.start)}</p>
            <p style={infoStyle}><b>Salong:</b> {booking.room_number}</p>
          </div>
        </div>

        <hr style={{ borderColor: "var(--border-primary)", margin: "1.5rem 0" }} />

        <p style={infoStyle}><b>Platser:</b> {booking.seats.join(", ")}</p>
        <p style={infoStyle}><b>Totalt:</b> {booking.total_cost} kr</p>
        <p style={{ ...infoStyle, fontSize: "0.85rem", opacity: 0.6, marginTop: "0.5rem" }}>
          Boknings-ID: {booking.guid}
        </p>

        <button onClick={() => navigate("/")} style={btnStyle}>
          Gå till startsidan
        </button>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "3rem 1rem",
};

const cardStyle: React.CSSProperties = {
  background: "var(--second-bg)",
  border: "1px solid var(--border-primary)",
  borderRadius: "12px",
  padding: "2rem",
  maxWidth: "540px",
  width: "100%",
};

const titleStyle: React.CSSProperties = {
  color: "var(--font-primary)",
  fontSize: "1.8rem",
  marginBottom: "1.5rem",
  textAlign: "center",
};

const movieRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "1.5rem",
  alignItems: "flex-start",
};

const posterStyle: React.CSSProperties = {
  width: "90px",
  borderRadius: "6px",
  flexShrink: 0,
};

const infoStyle: React.CSSProperties = {
  color: "var(--font-primary)",
  marginBottom: "0.4rem",
};

const btnStyle: React.CSSProperties = {
  marginTop: "1.5rem",
  width: "100%",
  padding: "0.7rem",
  borderRadius: "8px",
  background: "var(--border-primary)",
  color: "var(--font-primary)",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
};
