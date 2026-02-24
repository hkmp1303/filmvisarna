import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import useFetchJson from '../utilities/useFetchJson';
import fetchJson from '../utilities/fetchJson';
import '../css/Booking.css';
import type { Film } from '../utilities/filmInterface';
import type { BriefScreening, Screening } from '../utilities/screeningInterface';
import type { Salon, Res } from '../utilities/salonInterface';
import { formatDateTime } from '../utilities/formatDateTime';

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
        setSalon(salonRes)

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
  const handleClick = () => navigate(`/movieDetails/${film?.filmid}`);
  return (!loading && (<>
    <h2 className='text-center text-4xl font-bold pt-10'>{ film?.title }</h2>
    <article className="columns-2 gap-6 p-10">
      <section className='fifty'>
        <fieldset className="">
          <legend>Visning</legend>
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
          <p>{formatDateTime(screening?.start)} - Salong {salon?.room_number}</p>
        </fieldset>
      </section>
      <section className="fifty">
        <fieldset className=''>
          <legend>Välj plats i Salong {salon?.room_number}</legend>
          <div className='seating-arrangement'>

          </div>
        </fieldset>
      </section>
    </article>
    <button className="btn text-center m-10" onClick={handleClick}>Välj annan föreställning</button>
  </>));
}