import type { LeadershipMember } from '@/domain/leadership/types';
import { Bishop, PstKenny_1, Associate_1, Associate_2 } from '@/shared/assets';

// Canonical base members for pastoral leadership not yet in the API
export const CANONICAL_SENIOR_PASTORS: LeadershipMember[] = [
  {
    id: 'canon-senior-1',
    firstName: 'Bishop Gabriel',
    lastName: 'Ayilara',
    role: 'senior_pastor',
    status: 'approved',
    department: 'Spiritual Oversight',
    imageUrl: Bishop.src,
    bio: 'Bishop Gabriel Ayilara is the Senior Pastor of The Wisdom Church. An apostolic voice and compassionate teacher of the Word, he carries a divine mandate to raise believers of excellence, wisdom, and kingdom impact across Lagos and worldwide. Under his oversight, the church continues to witness radical life transformations, community outreach, and deep spiritual revival.',
  },
  {
    id: 'canon-senior-2',
    firstName: 'Pastor Kehinde',
    lastName: 'Ayilara',
    role: 'senior_pastor',
    status: 'approved',
    department: 'Spiritual Oversight',
    imageUrl: PstKenny_1.src,
    bio: 'Pastor Mrs Kehinde Ayilara serves as Senior Pastor, ministering with maternal grace, prayer fervor, and life-changing discipleship. She has an enduring passion for mentoring families, building authentic believers, and empowering women and youth to step boldly into God’s sovereign plan.',
  },
];

export const CANONICAL_CO_MINISTERS: LeadershipMember[] = [
  {
    id: 'canon-pastor-1',
    firstName: 'Rev. Victor',
    lastName: 'Jimba',
    role: 'resident_pastor',
    status: 'approved',
    department: null,
    imageUrl: Associate_2.src,
    bio: 'Rev. Victor Jimba serves as Resident Pastor, providing steadfast pastoral administration, sound spiritual counsel, and leadership discipleship throughout the Wisdom Church family.',
  },
  {
    id: 'canon-pastor-2',
    firstName: 'Pastor',
    lastName: 'Bamidele',
    role: 'pastor',
    status: 'approved',
    department: null,
    imageUrl: Associate_1.src,
    bio: 'Pastor Bamidele serves as Pastor, actively shepherding the congregation, leading discipleship ministries, and guiding kingdom community mentorship initiatives.',
  },
];
