export type FellowshipCenter = {
  id: string;
  /** Center name. */
  name: string;
  /** Short neighbourhood label for the card eyebrow. */
  area: string;
  /** Full meeting address. */
  address: string;
  /** When the center meets, e.g. "Every Saturday · 5:00 – 6:00 PM". */
  meetingTime: string;
  /** Display phone number. */
  phone: string;
  /** `tel:` href (E.164). */
  phoneHref: string;
};

// Live centers directory. Update here (or swap for an API feed) as centers open.
export const FELLOWSHIP_CENTERS: readonly FellowshipCenter[] = [
  {
    id: 'rehoboth',
    name: 'Rehoboth',
    area: 'Abraham Adesanya',
    address:
      'Ojaja Mall, opposite Lekki Scheme 2, Ogombo Road, Abraham Adesanya, Lagos',
    meetingTime: 'Every Saturday · 5:00 – 6:00 PM',
    phone: '0703 210 4344',
    phoneHref: 'tel:+2347032104344',
  },
  {
    id: 'greatness-centre',
    name: 'Greatness Centre',
    area: 'Olokonla',
    address: 'Brosis Apartments, University View Estate, Olokonla, Lagos',
    meetingTime: 'Every Friday · 6:00 – 7:00 PM',
    phone: '0806 537 3956',
    phoneHref: 'tel:+2348065373956',
  },
  {
    id: 'maranatha',
    name: 'Maranatha',
    area: 'Goodnews Estate',
    address: 'Plot 4, Pastor Monday Street, Goodnews Estate, Lagos',
    meetingTime: '6:00 – 7:00 PM',
    phone: '0814 460 7363',
    phoneHref: 'tel:+2348144607363',
  },
] as const;
