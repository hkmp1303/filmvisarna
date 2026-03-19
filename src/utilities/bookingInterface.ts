export interface Booking {
  id: string;
  movieTitle: string;
  showtime: string;
  poster: string;
}

export interface BookingFull {
  bookingid: number;
  total_cost: number;
  date: string;
  guid: string;
  status: 'reserved' | 'booked' | 'canceled' | string;
  screeningid: number;
  userid: number;
  error: string;
}