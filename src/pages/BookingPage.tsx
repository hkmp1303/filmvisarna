import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
//import useFetchJson from '../utilities/useFetchJson';
import fetchJson from '../utilities/fetchJson';
import '../css/Booking.css';
import type { Film } from '../utilities/filmInterface';
import type { Screening } from '../utilities/screeningInterface';
import type { Salon, Res } from '../utilities/salonInterface';
import { formatDateIso, formatDay, formatHourMin } from '../utilities/formatDateTime';
import { displayGenre } from '../utilities/i18n';
import { sumNumArray, csvToNumArray } from '../utilities/tools';
import type { LoginContext } from './Login';

export default function Booking() {
  const adultCnt = useRef<HTMLInputElement>(null);
  const seniorCnt = useRef<HTMLInputElement>(null);
  const childCnt = useRef<HTMLInputElement>(null);
  const loading = useRef<boolean>(false);
  const navigate = useNavigate();
  const [, setError] = useState<any>();
  //const [screeningid, setScreeningId] = useState<number>(); // to select screening, unreferenced
  //const [screenings, setScreenings] = useState<BriefScreening[]>([]);  // to select screening, unreferenced
  const [screening, setScreening] = useState<Screening>();
  const [salon, setSalon] = useState<Salon>();
  const [film, setFilm] = useState<Film>();
  const [res, setRes] = useState<Res[]>([]);
  const [totalSeats, setSeats] = useState<number>(0);
  const [ticketTotal, setTicketTotal] = useState<number>(0);
  const [, setTicketCount] = useState<number>(0);
  const { user } = useOutletContext<LoginContext>();
  const bookingGuid = useRef<string>(crypto.randomUUID());
  const ticketTotalRef = useRef<number>(0);
  const ticketCountRef = useRef<number>(0);
  const selectedSeatsRef = useRef<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [emailInput, setEmailInput] = useState<string>("");

  const qs = new URLSearchParams(useLocation().search);
  const id = parseInt(qs.get("screeningid") as string, 10);
  useEffect(() => {
    const getData = async () => {
      loading.current = true;
      try {
        if (!id) throw new Error("Felaktig visning");

        const screeningRes = await fetchJson(`/api/screening/${id}`);
        if (!screeningRes) throw new Error("Kunde inte ladda visning");
        setScreening(screeningRes);

        const filmRes = await fetchJson(`/api/film/${screeningRes?.filmid}`);
        if (!filmRes) throw new Error("Kunde inte ladda film");
        setFilm(filmRes);

        const salonRes = await fetchJson(`/api/salon/${screeningRes?.salonid}`);
        if (!salonRes) throw new Error("Kunde inte ladda salon");
        salonRes.row_capacity = csvToNumArray(salonRes?.row_capacity);
        setSalon(salonRes);

        /* // to select screening, unreferenced
        const screeningsRes = await fetchJson(`/api/selectScreening/film/${screeningRes?.filmid}`);
        if (!screeningsRes) throw new Error("Kunde inte ladda visning");
        setScreenings(screeningsRes);
        */

        const resRes = await fetchJson(`/api/bookedSeatRes/${id}`);
        if (!resRes) throw new Error("Kunde inte ladda reserverade platser");
        console.log(resRes);
        setRes(resRes);
        setSeats(sumNumArray(salonRes.row_capacity)-resRes.length);

        // make sure film, salon and reservation could be retrieved
        if (!filmRes || !salonRes || !resRes) {
          throw new Error("Kunde inte ladda");
        }
        /*setFilm(filmRes as Film);
        setScreenings(screeningsRes as BriefScreening[]);
        setSalons(salonsRes as Salon[]);*/
        loading.current = !(!screeningRes || !filmRes || !salonRes || !resRes || screeningRes.filmid !== filmRes.filmid);
      } catch (e) {
        setError(e);
      } finally {
        loading.current = false;
      }
    };
    getData();
  }, [id]);

  const calcTotal = (e: any) => {
    const f = e.target.form,
      salonTotalSeats = sumNumArray(salon?.row_capacity ?? []),
      ticketCount = (parseInt(f["adult"].value) || 0) + (parseInt(f["senior"].value) || 0) + (parseInt(f["child"].value) || 0);
    // calculate total vacant seats
    setSeats(salonTotalSeats - ticketCount - res.length);
    setTicketCount(ticketCount);
    ticketCountRef.current = ticketCount;
    console.log(salonTotalSeats + " " + ticketCount + " " + res.length);
    // calculate total ticket price
    setTicketTotal(f["adult"].value * 140
      + f["senior"].value * 120
      + f["child"].value * 80
    );
    ticketTotalRef.current = f["adult"].value * 140
      + f["senior"].value * 120
      + f["child"].value * 80;
  };

  const seatTaken = (index: number, row_index: number): boolean => {
    const currentSeatNum = calcSeatNum(index, row_index);
    return res.some(s => s.seat_number === currentSeatNum);
  };

  const calcSeatNum = (index: number, row_index: number): number => {
    let currentSeatFromIndex: number = 0;
    let loops = 0;
    for (let i of salon?.row_capacity ?? []) {
      if (loops >= row_index && index < i) {
        break;
      }
      currentSeatFromIndex += i;
      loops++;
    }
    return currentSeatFromIndex + index + 1;
  };

  const handleClick = () => navigate(`/movieDetails/${film?.filmid}`);

  const handleBooking = async (e: any) => {
    e.preventDefault();
    if (!bookingGuid.current) {
      return alert("Du måste välja platser innan du bokar.");
    }
    if (ticketTotal === 0) {
      return alert("Du måste boka minst en biljett.");
    }

    const emailToUse = user?.email ?? emailInput;
    if (!emailToUse) {
      return alert("Ange din e-postadress för att slutföra bokningen.");
    }

    try {
      const res = await fetch("/api/sendBookingEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse, guid: bookingGuid.current })
      });
      if (!res.ok) throw new Error("Kunde inte skicka bekräftelse.");
      navigate(`/confirmbooking?guid=${bookingGuid.current}`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (!loading.current && (<>
    <h2 className='movie-title'>{ film?.title }</h2>
    <article className="booking-grid-all">
      <section className='fifty'>
        <form>
          <fieldset className="screening-w-counter">
            <legend>Vald föreställning </legend>
            {/*<form>
              {screenings && (screenings as BriefScreening[]).length > 1 ? (<>
              <label htmlFor="screening">Visning</label>
              <select name="screeningid" id="screening" required>
              <option value="">Välj en visning</option>
              {(screenings as BriefScreening[]).map((s: BriefScreening, index: number) => (
                <option key={index} value={s.screeningid}>
                {formatDateTime(s.start)} - Salong {s.room_number}
                </option>
                ))}
                </select>
              </>) : (
                <p>{error}</p>
                )}
                </form>*/}
            <div className='screening-info'>
              <div>
                <img className="screen-info-img" src={film?.cover_image} alt="Film Affisch" width="200" height="300" />
              </div>
              <dl className='text-screening-info'>
                <dt><b>Film detaljer</b></dt><dd></dd>
                <dt>Åldersgräns:</dt><dd>{film?.viewer_rating}</dd>
                <dt>Speltid:</dt><dd>{film?.duration} min</dd>
                <dt>Genre:</dt><dd>{displayGenre(film?.genre ?? "")}</dd>
                <dt>Tal:</dt><dd>{film?.language}</dd>
                <dt>Undertext:</dt><dd>{film?.subtitle_language}</dd>
                <dt></dt><dd></dd>
                <dt><b>Tid och plats</b></dt><dd></dd>
                <dt></dt><dd>{formatDateIso(screening?.start)}</dd>
                <dt>{(formatDay(screening?.start))} - kl {formatHourMin(screening?.start) }</dt><dd></dd>
                <dt>Salong {salon?.room_number}</dt><dd></dd>
              </dl>
            </div>
            <div className='items-center text-center'>
              <button className="screen-select-btn" onClick={handleClick}>Välj annan föreställning</button>
            </div>
          </fieldset>
        </form>
      </section>
      <section className='fifty'>
        <form>
          <fieldset>
            <legend>Välj antal biljetter</legend>
            <table className='ticket-count'>
              <tbody>
                <tr>
                  <td className='ticket-label'><label htmlFor="adult">Ordinarie</label></td>
                  <td className='ticket-number'><input ref={adultCnt} onChange={calcTotal} type="number" min="0" max={totalSeats + (parseInt(adultCnt.current?.value as string) || 0)} defaultValue="0" id='adult' /></td>
                  <td className='ticket-price'>140 kr</td>
                </tr><tr>
                  <td className='ticket-label'><label htmlFor="senior">Pensionär (+65 år)</label></td>
                  <td className='ticket-number'><input ref={seniorCnt} onChange={calcTotal} type="number" min="0" max={totalSeats + (parseInt(seniorCnt.current?.value as string) || 0)} defaultValue="0" id='senior' /></td>
                  <td className='ticket-price'>120 kr</td>
                </tr><tr>
                  <td className='ticket-label'><label htmlFor="child">Barn (till 12 år)</label></td>
                  <td className='ticket-number'><input ref={childCnt} onChange={calcTotal} type="number" min="0" max={totalSeats + (parseInt(childCnt.current?.value as string) || 0)} defaultValue="0" id='child' /></td>
                  <td className='ticket-price'>80 kr</td>
                </tr><tr>
                  <td>Summa: </td><td>{ticketTotal} kr</td><td></td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </form>
      </section>
      <section className="fifty">
        <fieldset className=''>
          <legend>Tillgängliga platser i Salong {salon?.room_number}</legend>
          <span>
            <form>
              <input type="hidden" name="total_cost" value={ticketTotal} />
              <input type="hidden" name="guid" value={bookingGuid.current} />
              <div className='seating-arrangement'>
                <p className="screen"> Filmduk</p>
                {salon?.row_capacity.map((r: number, row_index) => {
                  return <div key={"row-"+row_index}>{Array(r).fill(null).map((_,index) =>{
                    return <label key={"seat-"+index} onClick={() => {
                      if (seatTaken(index, row_index)) return;
                      if (ticketTotalRef.current === 0) return alert("Du måste välja antal biljetter först.");
                      const seatNum = calcSeatNum(index, row_index);
                      const current = selectedSeatsRef.current;
                      const isSelected = current.includes(seatNum);
                      if (!isSelected && current.length >= ticketCountRef.current) return alert("Du har redan valt det antal platser du bokat biljetter för.");
                      const newSeats = isSelected
                        ? current.filter(s => s !== seatNum)
                        : [...current, seatNum];
                      selectedSeatsRef.current = newSeats;
                      setSelectedSeats([...newSeats]);
                      fetch("/api/reserveSeatRes/" + id, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          total_cost: ticketTotalRef.current,
                          guid: bookingGuid.current,
                          seat: newSeats.map(s => Number(s))
                        })
                      }).then(r => r.json()).then(data => {
                        if (data?.guid) bookingGuid.current = data.guid;
                      }).catch(() => alert("Kunde inte spara bokning."));
                    }}>
                      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="20" rx="3" ry="3"
                          className={seatTaken(index, row_index) ? "booked" : selectedSeats.includes(calcSeatNum(index, row_index)) ? "reserved" : "vacant"} />
                      </svg>
                    </label>}
                  )}</div>}
                )}
              </div>
            </form>
            <form className='text-center' onSubmit={handleBooking}>
              <input type="hidden" name="total_cost" value={ticketTotal} />
              <input type="hidden" name="guid" value={bookingGuid.current} />
              {!user && (
                <div className="items-center text-center" style={{ marginBottom: "1rem" }}>
                  <label htmlFor="guestEmail" style={{ display: "block", marginBottom: "0.5rem" }}>
                    Din e-postadress (för bokningsbekräftelse)
                  </label>
                  <input
                    id="guestEmail"
                    type="email"
                    placeholder="din@epost.se"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{
                      background: "var(--input-bg)",
                      border: "2px solid var(--border-primary)",
                      color: "var(--font-primary)",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      width: "80%",
                      marginBottom: "0.5rem"
                    }}
                  />
                </div>
              )}
              <button className="book-seats-btn">Boka platser</button>
            </form>
          </span>
        </fieldset>
      </section>
    </article>
  </>));
}