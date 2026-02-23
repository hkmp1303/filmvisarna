export interface Screening {
  screeningid: number;
  start: string;
  filmid: number;
  salonid: number;
}

// includes join with salon to get room_number
export interface BriefScreening {
  screeningid: number;
  filmid: number;
  start: string;
  room_number: string;
}