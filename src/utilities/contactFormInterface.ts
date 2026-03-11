export interface contactForm {
  name: string;
  email: string;
  subject: 'None' | 'Föreställning' | 'Biljettfråga' | 'Kiosken' | 'Betalning' | 'Förslag' | 'TemaDagar' | 'Övrigt' | string;
  message: string;
}