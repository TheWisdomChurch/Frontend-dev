import type { LeadershipMember } from '@/domain/leadership/types';
import {
  Bishop,
  PstKenny_1,
  Associate_1,
  Associate_2,
  Deacon_1,
  Deacon_2,
} from '@/shared/assets';

// Canonical base members for specific pastoral and board leadership
// requested for the directory spotlights. All department heads and ministry
// leaders are dynamically loaded from the API endpoint (apiClient.listLeadership).

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
    role: 'reverend',
    status: 'approved',
    department: 'Resident Pastor',
    imageUrl: Associate_2.src,
    bio: 'Rev. Victor Jimba serves as Resident Pastor, providing steadfast pastoral administration, sound spiritual counsel, and leadership discipleship throughout the Wisdom Church family.',
  },
  {
    id: 'canon-pastor-2',
    firstName: 'Pastor',
    lastName: 'Bamidele',
    role: 'associate_pastor',
    status: 'approved',
    department: 'Associate Pastor',
    imageUrl: Associate_1.src,
    bio: 'Pastor Bamidele serves as Associate Pastor, actively leading youth discipleship, evangelistic outreaches, and kingdom community mentorship initiatives.',
  },
];

export const CANONICAL_DEACONS: LeadershipMember[] = [
  {
    id: 'canon-deacon-1',
    firstName: 'Deacon',
    lastName: 'Adeyemi',
    role: 'deacon',
    status: 'approved',
    department: 'Board of Deacons',
    imageUrl: null,
    bio: 'Deacon Adeyemi oversees deacon board activities, church administration, and member care ministries with excellence, integrity, and diligence.',
  },
  {
    id: 'canon-deacon-2',
    firstName: 'Deaconess Temisan',
    lastName: 'Adeniran',
    role: 'deaconess',
    status: 'approved',
    department: 'Finance & Stewardship',
    imageUrl: Deacon_1.src,
    bio: 'Deaconess Temisan Adeniran faithfully manages financial stewardship, church records, and biblical principles of kingdom prosperity.',
  },
  {
    id: 'canon-deacon-3',
    firstName: 'Deaconess Bimbo',
    lastName: 'Adeyemi',
    role: 'deaconess',
    status: 'approved',
    department: 'Member Care & Outreach',
    imageUrl: Deacon_2.src,
    bio: 'Deaconess Bimbo Adeyemi faithfully serves in hospitality coordination, family welfare, and benevolent outreach operations across the church.',
  },
];
