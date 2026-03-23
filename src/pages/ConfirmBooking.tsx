import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useFetchJson from '../utilities/useFetchJson';
import fetchJson from '../utilities/fetchJson';
import css from '../css/ConfirmBooking.module.css';
import type { Film } from '../utilities/filmInterface';
import type { BriefScreening, Screening } from '../utilities/screeningInterface';
import type { Salon, Res } from '../utilities/salonInterface';
import type { BookingFull, Booking }  from '../utilities/bookingInterface';
import { formatDateIso, formatDateTime, formatDay, formatHourMin } from '../utilities/formatDateTime';
import { displayGenre } from '../utilities/i18n';
import { getFormEntries } from '../utilities/tools';

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const { guid } = useParams();
  const loading = useRef<boolean>(false);
  const [booking, setBooking] = useState<BookingFull>();
  const [film, setFilm] = useState<Film>();
  const [screening, setScreening] = useState<Screening>();
  const [status, setStatus] = useState<string>('');
  const [res, setRes] = useState<Res[]>([]);
  useEffect(() => {
    const getData = async () => {
      loading.current = true;

      const bookingRes = await fetchJson(`/api/bookingByGuid/${guid}`);
      if (bookingRes.error) throw new Error("Kunde inte ladda bokning.")
      setBooking(bookingRes);
      setStatus(bookingRes.status);

      const screeningRes = await fetchJson(`/api/screening/${bookingRes.screeningid}`);
      if (screeningRes.error) throw new Error("Kunde inte ladda visning.");
      setScreening(screeningRes);

      const filmRes = await fetchJson(`/api/film/${screeningRes.filmid}`);
      if (filmRes.error) throw new Error("Kunde inte ladda film.");
      setFilm(filmRes);

      const resRes = await fetchJson(`/api/reservedSeatRes/${guid}`);
      if (resRes.error) throw new Error("Kunde inte ladda reserverationer.");
      setRes(resRes);
    };
    getData();
  }, [guid]);
  /*useEffect(() => {
    fetchJson(`/api/bookingByGuid/${guid}`).then((res) => {
      if (!res.ok) throw new Error("Kan inte hitta bokning");
      return res.json();
    }).then((data) => {
      setBooking(data);
    });
  }, [booking]);*/
  const handleResendBookingLink = (e: any) => {
    e.preventDefault();
    fetch("/api/resendBookingLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: getFormEntries(e.currentTarget)
    }).then((res) => {
      if (!res.ok) throw new Error("Kunde inte skicka länk.");
      return res.json();
    }).then((data) => {
      data.message ?? alert(data.message);
    });
  };
  const handleCancelBooking = (e: any) => {
    e.preventDefault();
    fetch("/api/cancelBooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: getFormEntries(e.currentTarget)
    }).then((res) => {
      if (!res.ok) throw new Error("Kunde inte avbryta bokning.");
      return res.json();
    }).then((data) => {
      data.message && alert(data.message);
    });
  };
  return booking && (<article className={css.article}>
    <h2 className={css.h2}>{film?.title}</h2>
    {booking.status == 'booked' && (<section className={css.section}>
      <h3 className={css.h3}>Tack för din bokning!<br />Välkommen till oss {formatDateTime(screening?.start)}</h3>
    </section>)}
    <section className={css.section}>
      <p>
        <a href={"/confirmbooking/" + guid}>Länk till denna sidan</a>.
      </p>
      <form onSubmit={handleResendBookingLink} className={css.form}>
        <input type="hidden" name="guid" value={guid} />
        <button className={css.button}>Skicka bokningslänk igen</button>
      </form>
    </section>
    {booking.status == 'booked' && (<section className={css.section}>
      <h4 className={css.h4}>Dina biljetter, visa vid dörren.</h4>
      {res.map((r: Res) => (
      <div className={css.ticket}>
        <img src={"https://quickchart.io/qr?text=" + guid} alt="QR-kod" className={css.qr} />
          <div><b>Plats:</b> {r.seat_number}, <b>Rad:</b> {r.row_number}<br />
            <b>Bokningsnummer:</b><br />{guid}</div>
      </div>))}
    </section>)}
    <section className={css.section}>
      {booking.status == 'booked' ? (
        <form onSubmit={handleCancelBooking} className={css.form}>
          <input type="hidden" name="guid" value={guid} />
          <button className={css.button}>Avboka bokningen</button>
        </form>) : (<h3 className={css.h3}>Bokningen är Avbokad.</h3>)}
    </section>
  </article>);
}