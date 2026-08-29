export type FellowshipCenter = {
  id: string;
  name: string;
  area: string;
  address: string;
  /** Display format. */
  phone: string;
  /** tel: href. */
  phoneHref: string;
};

// MOCK DATA — replace with the real centers directory (or an API feed) when it
// is ready. Shape is stable; only the values change.
export const FELLOWSHIP_CENTERS: readonly FellowshipCenter[] = [
  {
    id: 'lekki-phase-1',
    name: 'Fellowship Center 1',
    area: 'Lekki Phase 1',
    address: '12 Admiralty Way, Lekki Phase 1, Lagos',
    phone: '0809 001 2345',
    phoneHref: 'tel:+2348090012345',
  },
  {
    id: 'ajah',
    name: 'Fellowship Center 2',
    area: 'Ajah',
    address: '5 Addo Road, Ajah, Lagos',
    phone: '0809 002 3456',
    phoneHref: 'tel:+2348090023456',
  },
  {
    id: 'sangotedo',
    name: 'Fellowship Center 3',
    area: 'Sangotedo',
    address: '9 Monastery Road, Sangotedo, Lagos',
    phone: '0809 003 4567',
    phoneHref: 'tel:+2348090034567',
  },
  {
    id: 'ikota',
    name: 'Fellowship Center 4',
    area: 'Ikota',
    address: '3 Ikota Villa Estate, Lekki, Lagos',
    phone: '0809 004 5678',
    phoneHref: 'tel:+2348090045678',
  },
  {
    id: 'chevron',
    name: 'Fellowship Center 5',
    area: 'Chevron Drive',
    address: '21 Chevron Drive, Lekki, Lagos',
    phone: '0809 005 6789',
    phoneHref: 'tel:+2348090056789',
  },
  {
    id: 'awoyaya',
    name: 'Fellowship Center 6',
    area: 'Awoyaya',
    address: '7 Eputu Road, Awoyaya, Lekki-Epe, Lagos',
    phone: '0809 006 7890',
    phoneHref: 'tel:+2348090067890',
  },
] as const;
