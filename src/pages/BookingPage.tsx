import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
//import useFetchJson from '../utilities/useFetchJson';
import fetchJson from '../utilities/fetchJson';
import '../css/Booking.css';
import type { Film } from '../utilities/filmInterface';
import type { BriefScreening, Screening } from '../utilities/screeningInterface';
import type { Salon, Res } from '../utilities/salonInterface';
import { formatDateIso, formatDay, formatHourMin } from '../utilities/formatDateTime';
import genre from '../utilities/i18n';
import { sumNumArray, csvToNumArray } from '../utilities/tools';
import type { LoginContext } from './Login';
import useFetchJson from '../utilities/useFetchJson';

export default function Booking() {
  const adultCnt = useRef<HTMLInputElement>(null);
  const seniorCnt = useRef<HTMLInputElement>(null);
  const childCnt = useRef<HTMLInputElement>(null);
  const loading = useRef<boolean>(false);
  const navigate = useNavigate();
  const [error, setError] = useState<any>();
  //const [screeningid, setScreeningId] = useState<number>(); // to select screening, unreferenced
  //const [screenings, setScreenings] = useState<BriefScreening[]>([]);  // to select screening, unreferenced
  const [screening, setScreening] = useState<Screening>();
  const [salon, setSalon] = useState<Salon>();
  const [film, setFilm] = useState<Film>();
  const [res, setRes] = useState<Res[]>([]);
  const [totalSeats, setSeats] = useState<number>(0);
  const [ticketTotal, setTicketTotal] = useState<number>(0);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const { user } = useOutletContext<LoginContext>();
  const [bookingGuid, setBookingGuid] = useState<string>("");

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
    console.log(salonTotalSeats + " " + ticketCount + " " + res.length);
    // calculate total ticket price
    setTicketTotal(f["adult"].value * 140
      + f["senior"].value * 120
      + f["child"].value * 80
    );
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

  const handleClickSeat = (e: any) => {
    const btns = document.querySelectorAll(".seating-arrangement input[type=checkbox]");
    console.log(btns);
  };

  const handleClick = () => navigate(`/movieDetails/${film?.filmid}`);

  const handleReservation = (e: any) => {
    e.preventDefault();
    if (ticketTotal == 0) {
      return alert("Du måste boka minst en biljett");
    }
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const res = fetch("/api/reserveSeatRes/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      }).then((res) => {
        if (!res.ok) throw new Error("Kunde inte spara bokning.");
      }).then((data) => {
        console.log(data);
        alert("Bokningen har sparats");
      });
    } catch (e:any) {
      alert(e.message)
    }
    //navigate(`/confirmBooking/${film?.filmid}`);
  };

  const handleBooking = (e: any) => {
    e.preventDefault();
    navigate("/confirmbooking");
  };

  return (!loading.current && (<>
    <h2 className='movie-title'>{ film?.title }</h2>
    <article className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10">
      <div>
        <section className='fifty'>
          <form>
            <fieldset className="">
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
                  <img className="float-right mx-5" src={film?.cover_image} alt="Film Affisch" width="200" height="300" /></div>
                <div>
                  <p>Åldersgräns: {film?.viewer_rating}</p>
                  <p>Speltid: {film?.duration} min</p>
                  <p>Genre: {genre(film?.genre ?? "")}</p>
                  <p>Tal: {film?.language}</p>
                  <p>Undertext: {film?.subtitle_language}</p>
                  <p> {formatDateIso(screening?.start)}</p>
                  <p>{(formatDay(screening?.start))} - kl {formatHourMin(screening?.start) }</p>
                  <p>Salong {salon?.room_number}</p>
                </div>
              </div>
              <div className='items-center text-center'>
                <button className="screen-select-btn" onClick={handleClick}>Välj annan föreställning</button>
              </div>
            </fieldset>
          </form>
        </section>
        <hr className='div' />
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
                    <td className='ticket-label'><label htmlFor="senior">Pensionär</label></td>
                    <td className='ticket-number'><input ref={seniorCnt} onChange={calcTotal} type="number" min="0" max={totalSeats + (parseInt(seniorCnt.current?.value as string) || 0)} defaultValue="0" id='senior' /></td>
                    <td className='ticket-price'>120 kr</td>
                  </tr><tr>
                    <td className='ticket-label'><label htmlFor="child">Barn (max 12 år)</label></td>
                    <td className='ticket-number'><input ref={childCnt} onChange={calcTotal} type="number" min="0" max={totalSeats + (parseInt(childCnt.current?.value as string) || 0)} defaultValue="0" id='child' /></td>
                    <td className='ticket-price'>80 kr</td>
                  </tr><tr>
                    <td colSpan={3}>Summa: {ticketTotal} kr</td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </form>
        </section>
      </div>
      <div>
        <section className="fifty">
          <fieldset className=''>
            <legend>Tillgängliga platser i Salong {salon?.room_number}</legend>
            <form onSubmit={handleReservation}>
              <input type="hidden" name="total_cost" value={ticketTotal} />
              <input type="hidden" name="guid" value={bookingGuid} />
              <div className='seating-arrangement'>
                <p className="screen"> Filmduk</p>
                {salon?.row_capacity.map((r: number, row_index) => {
                  return <div key={"row-"+row_index}>{Array(r).fill(null).map((v,index) =>{
                    return <label key={"seat-"+index}>
                      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" >
                        <rect width="20" height="20" rx="3" ry="3" className={seatTaken(index, row_index)?"booked": "vacant"} />
                      </svg>
                      <input type="checkbox" key={calcSeatNum(index, row_index)}
                        name={"seat[" + calcSeatNum(index, row_index) + "]"}
                        checked={seatTaken(index, row_index)}
                        onChange={handleClickSeat}
                        data-row={row_index +1}
                        disabled={seatTaken(index, row_index)} // ignored on submit, prevent changes to booked seats
                      />
                    </label>}
                  )}</div>}
                )}
              </div>
              <button className="book-seats-btn">Reservera platser</button>

            </form>
          </fieldset>
        </section>
        <form className='text-center' onSubmit={handleBooking}>
          <button className="book-seats-btn">Boka platser</button>
        </form>
      </div>
    </article>
  </>));
}