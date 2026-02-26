import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import useFetchJson from '../utilities/useFetchJson';
import fetchJson from '../utilities/fetchJson';
import '../css/Booking.css';
import type { Film } from '../utilities/filmInterface';
import type { BriefScreening, Screening } from '../utilities/screeningInterface';
import type { Salon, Res } from '../utilities/salonInterface';
import { formatDateIso, formatDay, formatHourMin } from '../utilities/formatDateTime';
import genre from '../utilities/i18n';
import { sumNumArray, csvToNumArray } from '../utilities/tools';

export default function Booking() {
  const navigate = useNavigate();
  //const { filmid } = useParams<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [screeningid, setScreeningId] = useState<number>();
  const [screening, setScreening] = useState<Screening>();
  const [salon, setSalon] = useState<Salon>();
  const [film, setFilm] = useState<Film>();
  const [screenings, setScreenings] = useState<BriefScreening[]>([]);
  const [res, setRes] = useState<Res[]>([]);
  const [totalSeats, setSeats] = useState<number>(0);
  const [ticketTotal, setTicketTotal] = useState<number>(0);

  const qs = new URLSearchParams(useLocation().search);
  const id = parseInt(qs.get("screeningid") as string, 10);
  useEffect(() => {
    const getData = async () => {
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
        setSeats(sumNumArray(salonRes.row_capacity));

        console.log(salonRes?.row_capacity.split(',').map((n:string) => parseInt(n)));

        const screeningsRes = await fetchJson(`/api/selectScreening/film/${screeningRes?.filmid}`);
        if (!screeningsRes) throw new Error("Kunde inte ladda visning");
        setScreenings(screeningsRes);

        const resRes = await fetchJson(`/api/bookedSeatRes/${id}`);
        if (!resRes) throw new Error("Kunde inte ladda reserverade platser");
        setRes(resRes);

        // make sure both film and screening could be retrieved
        if (!screeningsRes || !filmRes || !salonRes || !resRes) {
          throw new Error("Kunde inte ladda");
        }
        /*setFilm(filmRes as Film);
        setScreenings(screeningsRes as BriefScreening[]);
        setSalons(salonsRes as Salon[]);*/
        setLoading(!(!screeningRes || !filmRes || !salonRes || !resRes || screeningRes.filmid !== filmRes.filmid));
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const calcTotal = (e:any) => {
    setTicketTotal(e.target.form["adult"].value * 140
      + e.target.form["senior"].value * 120
      + e.target.form["child"].value * 80
    );
  };

  const handleClick = () => navigate(`/movieDetails/${film?.filmid}`);
  return (!loading && (<>
    <h2 className='movie-title'>{ film?.title }</h2>
    <article className="grid grid-cols-2 gap-6 p-10">
      <div>
        <section className='fifty'>
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
        </section>
        <hr className='div' />
        <section className='fifty'>
          <fieldset>
            <legend>Välj antal biljetter</legend>
            <form className='ticket-count'>
              <table className=''>
                <tbody>
                  <tr>
                    <td className='ticket-label'><label htmlFor="adult">Ordinarie</label></td>
                    <td className='ticket-number'><input onChange={calcTotal} type="number" min="0" max={totalSeats} defaultValue="0" id='adult' /></td>
                    <td className='ticket-price'>140 kr</td>
                  </tr><tr>
                    <td className='ticket-label'><label htmlFor="senior">Pensionär</label></td>
                    <td className='ticket-number'><input onChange={calcTotal} type="number" min="0" max={totalSeats} defaultValue="0" id='senior' /></td>
                    <td className='ticket-price'>120 kr</td>
                  </tr><tr>
                    <td className='ticket-label'><label htmlFor="child">Barn (max 12 år)</label></td>
                    <td className='ticket-number'><input onChange={calcTotal} type="number" min="0" max={totalSeats} defaultValue="0" id='child' /></td>
                    <td className='ticket-price'>80 kr</td>
                  </tr><tr>
                    <td colSpan={3}>Summa: {ticketTotal} kr</td>
                  </tr>
                </tbody>
              </table>
            </form>
          </fieldset>
        </section>
      </div><div>
        <section className="fifty">
        <fieldset className=''>
          <legend>Tillgängliga platser i Salong {salon?.room_number}</legend>
          <div className='seating-arrangement'>

          </div>
        </fieldset>
        </section>
      </div>
    </article>
  </>));
}