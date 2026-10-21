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

export const CANONICAL_DEACONS: LeadershipMember[] = [
  {
    id: '5d55c2ab-0096-4796-94f8-e26bae885b3d',
    firstName: 'Ademola',
    lastName: 'Adeyemi',
    role: 'deacon',
    status: 'approved',
    department: null,
    imageUrl:
      'https://zecqbhqstwhiwwjpphep.supabase.co/storage/v1/object/public/wisdomchurch-media/uploads/uploads/image/9241f8ee-28f9-415e-9cc5-3c985efd8c0b/original.jpg',
    bio: 'Ademola Adeyemi is a professional auto dealer with over a decade of experience across the automotive industry. He is the founder of Igbalode Automobile Limited, an automotive company committed to making quality vehicles accessible to customers without hassles.\n\nHe holds a Bachelor’s degree in Transport Planning and Management from Olabisi Onabanjo University and a Master’s degree in Transportation Geography from the University of Lagos.\n\nBeyond his professional achievements, Ademola is a Deacon and serves as the Head of Protocol at The Wisdom Church. He is a lover of God, a man of faith and humility, a devoted husband, and an intentional father who values family, godly character, and purposeful living.',
  },
  {
    id: '0826c732-414a-498d-b1aa-4bbd27814d01',
    firstName: 'Abimbola',
    lastName: 'Adeyemi',
    role: 'deaconess',
    status: 'approved',
    department: null,
    imageUrl:
      'https://zecqbhqstwhiwwjpphep.supabase.co/storage/v1/object/public/wisdomchurch-media/uploads/uploads/image/64b53678-b169-4865-97e3-c8933bb6f610/original.jpg',
    bio: 'I am Abimbola Adeyemi a passionate baker, food enthusiast, devoted wife, loving mother of two beautiful children, and lover of Jesus. I serve as a Deacon at the Wisdom Church also the Deputy Leader of the Prayer and Intercessory Department, and the Head of a Cell Fellowship. I love God and my love for people inspires my commitment to prayer, service, and spiritual growth. I find joy and therapy in baking, I have a deep love for cooking, and enjoy offering counsel and guidance to others. I’m currently pursuing a course in Marriage and Family Therapy, with certification underway, this reflecting my passion for helping individuals and families build healthier, stronger relationships.',
  },
  {
    id: '76658b4b-8523-4eac-957a-43d82cf2464b',
    firstName: 'Temisan',
    lastName: 'Oloyede',
    role: 'deaconess',
    status: 'approved',
    department: null,
    imageUrl:
      'https://zecqbhqstwhiwwjpphep.supabase.co/storage/v1/object/public/wisdomchurch-media/uploads/uploads/image/d71425f0-8034-4224-b3dc-d7e815c2e806/original.jpg',
    bio: 'My name is Temisan, I’m married and mother to a beautiful daughter. I am Deacon in the Wisdom Church, heading the Prayer and Intercessory department.\n\nI work as a Financial Analyst in an organization in the Financial services sector. I love to write, dance, and be in places where merry happens.\n\nI love the work of God and really really enjoy going to church. To add to that, church is really my therapy.\n\nThree values I hold dearly; Integrity, honesty (there’s no need to lie, I really can’t beat you), trust.\n\nWhooshhh and glory. Bye.',
  },
  {
    id: '6735ac1d-f7c5-4628-b820-4ab8146aa9b4',
    firstName: 'Jimba',
    lastName: 'Oluwatoyosi Victoria',
    role: 'deacon',
    status: 'approved',
    department: null,
    imageUrl:
      'https://zecqbhqstwhiwwjpphep.supabase.co/storage/v1/object/public/wisdomchurch-media/uploads/uploads/image/7ce63823-390d-4d44-bfae-b1b3905d06d9/original.jpg',
    bio: 'I am Oluwatoyosi Jimba, I am privileged to serve as a Deacon in the wisdom church. I currently hold the office as the Head of experience and also serve in the welfare and beautification unit',
  },
];
