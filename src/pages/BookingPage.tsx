import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import useFetchJson from '../utilities/useFetchJson';
import fetchJson from '../utilities/fetchJson';
import '../css/Booking.css';
import type { Film } from '../utilities/filmInterface';
import type { BriefScreening, Screening } from '../utilities/screeningInterface';
import type { Salon } from '../utilities/salonInterface';
import { formatDateTime } from '../utilities/formatDateTime';

export default function Booking() {
  const navigate = useNavigate();
  //const { filmid } = useParams<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [screeningid, setScreeningId] = useState<number>();
  const [screening, setScreening] = useState<Screening>();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [film, setFilm] = useState<Film>();
  const [screenings, setScreenings] = useState<BriefScreening[]>([]);
  /*let screeningidRes: number | null = null;
  let screeningRes: Screening | null = null;
  let filmRes: Film | null = null;
  let screeningsRes: BriefScreening[] | null = null;
  let salonsRes: Salon[] | null = null;*/
  const qs = new URLSearchParams(useLocation().search);
  const id = parseInt(qs.get("screeningid") as string, 10);
  useEffect(() => {
    const getData = async () => {
      try {
        //if (!id) throw new Error("Felaktig visning");
        //setScreeningId(id);
        const screeningRes = await fetchJson(`/api/screening/${id}`);
        if (!screeningRes) throw new Error("Kunde inte ladda visning");
        setScreening(screeningRes);

        const filmRes = await fetchJson(`/api/film/${screeningRes?.filmid}`);
        if (!filmRes) throw new Error("Kunde inte ladda visning");
        setFilm(filmRes);

        const salonsRes = await fetchJson(`/api/salon/${screeningRes?.salonid}`);
        if (!salonsRes) throw new Error("Kunde inte ladda visning");
        setSalons(salonsRes)

        const screeningsRes = await fetchJson(`/api/selectScreening/film/${screeningRes?.filmid}`);
        if (!screeningsRes) throw new Error("Kunde inte ladda visning");
        setScreenings(screeningsRes);

        if (!screeningsRes || !filmRes || !salonsRes) {
          throw new Error("Kunde inte ladda");
        }
        /*setFilm(filmRes as Film);
        setScreenings(screeningsRes as BriefScreening[]);
        setSalons(salonsRes as Salon[]);*/
        setLoading(!(!screeningRes || !filmRes || !salonsRes || screeningRes.filmid !== filmRes.filmid));
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  // make sure both film and screening could be retrieved

  return (!loading && (
    <form>
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
    </form>
  ));
}