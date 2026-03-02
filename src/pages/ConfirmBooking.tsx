import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import useFetchJson from '../utilities/useFetchJson';
import fetchJson from '../utilities/fetchJson';
import css from '../css/ConfirmBooking.module.css';
import type { Film } from '../utilities/filmInterface';
import type { BriefScreening, Screening } from '../utilities/screeningInterface';
import type { Salon, Res } from '../utilities/salonInterface';
import { formatDateIso, formatDay, formatHourMin } from '../utilities/formatDateTime';
import genre from '../utilities/i18n';

export default function ConfirmBooking() {
    return <>test</>;
}