export interface Salon {
  salonid: number;
  room_number: string;
  description: string;
  row_capacity: number[];
  amenities: string;
  priceid: number;
}
export interface Res {
  seat_number: number;
  row_number: number;
  status: 'booked' | 'reserved' | 'canceled' | string;
}