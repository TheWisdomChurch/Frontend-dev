import {
  Church,
  Video,
  Radio,
  Calendar,
  ShoppingBag,
  Heart,
} from 'lucide-react';
import { Leader, MinistryLeader, ServiceBox } from './types';

import {
  Associate_1,
  Associate_2,
  ProvidusBank,
  KeystoneBank,
  // Dept_4,
  // What_to_expect_images
  WhatWedo_1,
  WhatWeDo_3,
  WhatWedo_2,
  WhatWedo_4,
  Img_1,
  Children_head,
  PstKenny,
  Min_Adura,
  Deacon_1,
  Deacon_2,
  Bishop,
} from '@/shared/assets';

// What we do
export const whatWeDoData: ServiceBox[] = [
  {
    id: 1,
    title: 'Expect the Word to Work',
    description:
      "We actively apply God's Word in our daily lives, transforming biblical teachings into practical actions that impact our community and deepen our faith journey.",
    image: WhatWedo_1,
    imageAlt: 'Worship service',
  },
  {
    id: 2,
    title: 'Expect the Power of Prayer',
    description:
      "Through fervent prayer, we connect with God's divine power, witnessing miraculous transformations and spiritual breakthroughs in our lives and community.",
    image: WhatWedo_4,
    imageAlt: 'Prayer gathering',
    gradient: 'from-purple-900 to-purple-700',
    imageOpacity: 60,
  },
  {
    id: 3,
    title: 'Expect Powerful Worship',
    description:
      'In heartfelt worship, we glorify God through song, praise, and devotion, creating an atmosphere where His presence transforms hearts and renews spirits.',
    image: WhatWedo_2,
    imageAlt: 'Community service',
  },
  {
    id: 4,
    title: 'Expect Transformative Messages',
    description:
      "We diligently study and receive God's Word, allowing scripture to guide our decisions, shape our character, and illuminate our path forward.",
    image: WhatWeDo_3,
    imageAlt: 'Youth gathering',
    gradient: 'from-blue-900 to-blue-700',
    imageOpacity: 60,
  },
];

export const missionStatement = `At The Wisdom Church, we are committed to spreading the Gospel and empowering believers through the Word of God and the Holy Spirit.
   Our mission is to create a community where faith thrives and transformation is possible.`;

// Real leadership content, not currently rendered anywhere in the frontend.
// The live /leadership page already pulls real leaders from
// apiClient.listLeadership() — these names/bios are the source-of-truth
// reference for entering these people into the admin portal so they start
// showing up there. Not dead/fake data — kept intentionally until entered.
export const pastorsData: Leader[] = [
  {
    id: 1,
    name: 'Bishop Gabriel Ayilara',
    role: 'Senior Pastor',
    image: Bishop,
    description:
      'Provides overall spiritual leadership and vision for the church.',
  },
  {
    id: 2,
    name: 'Pst. Mrs Kehinde Ayilara',
    role: 'Senior Pastor',
    image: PstKenny,
    description:
      'Assist in discipleship, mentorship, and faith-building activities',
  },
  {
    id: 3,
    name: 'Rev. Victor Jimba',
    role: 'Resident Pastor',
    image: Associate_2,
    description:
      'Provides overall spiritual leadership and vision for the church.',
  },

  {
    id: 4,
    name: 'Pastor Bamidele',
    role: 'Associate Pastor',
    image: Associate_1,
    description:
      'Assist in discipleship, mentorship, and faith-building activities',
  },
];

// Same as pastorsData above — real reference content pending admin-portal
// entry, not rendered anywhere in the frontend currently.
export const deaconsData: Leader[] = [
  {
    id: 1,
    name: 'Deacon Adeyemi',
    role: 'Deacon',
    image: Associate_1, // You'll need to import this image
    description:
      'Oversees deacon board activities, church administration, and member care ministries.',
  },
  {
    id: 2,
    name: 'Deaconess Toyosi Jimba',
    role: 'Deaconess ',
    image: Deacon_2, // You'll need to import this image
    description:
      "Leads women's fellowship, coordinates hospitality, and supports new member integration.",
  },
  {
    id: 3,
    name: 'Deaconess Temisan Adeniran',
    role: 'Deacon - Finance & Stewardship',
    image: Deacon_1, // You'll need to import this image
    description:
      'Manages church finances, oversees giving records, and leads financial stewardship teachings.',
  },
  {
    id: 4,
    name: 'Deaconess Abimbola Ademola',
    role: 'Deacon',
    image: WhatWeDo_3, // You'll need to import this image
    description:
      'Coordinates youth programs, community outreach initiatives, and evangelism activities.',
  },
];
// Add this to your data.ts file
export const associatePastorsContent = {
  mainHeader: 'Meet Our Departmental Leaders & Ministry Leaders',
  mainDescription:
    'Our devoted leaders faithfully oversee various departments, guiding the church family with wisdom, compassion, and a shared commitment to spiritual growth and service.',
  pastoralSection: {
    title: 'Pastoral Leadership',
  },
  ministrySection: {
    title: 'Ministry Department Heads',
  },
  seeMoreButton: 'See More',
};
export const ministryLeadersData: MinistryLeader[] = [
  {
    id: 1,
    name: 'Mrs. Blessing Afolayan',
    role: 'Head Ushering and Protocol',
    department: 'Ushering & protocol',
    image: Img_1,
    description: `Oversees the ushering and protocol team, ensuring seamless event coordination, guest hospitality, and orderly services to create a welcoming 
      environment for all attendees.`,
  },
  {
    id: 2,
    name: 'Deacon. Adeyemi',
    role: 'Head Service Preparatory Unit',
    department: 'Logistics & Security & Safety',
    image: Associate_1,
    description: `Oversees the Service Preparatory Unit, managing logistics, security, and safety protocols to ensure efficient setup, risk mitigation, 
     and a secure environment for all church events and gatherings.`,
  },
  {
    id: 3,
    name: 'Mrs Mojisola Oladejo',
    role: "Children's Ministry Director",
    department: "Children's Ministry",
    image: Children_head,
    description:
      'Creates engaging and safe environments for children to learn about God.',
  },
  {
    id: 4,
    name: 'Rev. Victor Jimba ',
    role: 'Outreach Coordinator',
    department: 'Outreach & Missions',
    image: Associate_2,
    description:
      'Coordinates community outreach and mission initiatives and programs.',
  },
  {
    id: 5,
    name: 'Mr. Aduragbemi Adekoya ',
    role: 'Music Department',
    department: 'Music & Instrumentation Mgt.',
    image: Min_Adura,
    description: `Leads the music department, managing instrumentation and Performances.`,
  },
  {
    id: 5,
    name: 'Pst. Mrs Kehinde Ayilara',
    role: "Women's Ministry Leader",
    department: "Women's Ministry",
    image: PstKenny,
    description:
      'Empowers women through Bible study and fellowship and also organizes outreaches and conferences',
  },
  {
    id: 6,
    name: 'Mr. Tosin',
    role: "Men's Ministry Leader",
    department: "Men's Ministry",
    image: Associate_1,
    description:
      'Builds strong Christian men through discipleship and accountability.',
  },
];

// popup content
export const confessionContent = `
    I AM BLESSED, PROSPEROUS, REDEEMED, FORGIVEN, HEALTHY, WHOLE, TALENTED, CREATIVE, CONFIDENT, SECURE, DISCIPLINED, FOCUSED,
    PREPARED, QUALIFIED, MOTIVATED, VALUABLE, FREE, DETERMINED, EQUIPPED, EMPOWERED, ANOINTED, ACCEPTED, AND APPROVED

    AM NOT AVERAGE, NOT MEDIOCRE, I AM A CHILD OF GOD, I WILL BECOME ALL I WAS CREATED TO BECOME 
    IN JESUS NAME.

    THANK YOU JESUS FOR HOLDING MY HANDS AND GUIDING ME THROUGH THIS WEEK, I'M CONFIDENT THAT YOU HAVE
    WALKED THROUGH THIS WEEK AND YOUR EYES WILL WATCH OVER ME IN IT, THIS WEEK IS A WALK OVER FOR ME.

    I ACHIEVE GREATNESS WITH EASE, BECAUSE YOUR OIL OF FAVOUR IS UPON MY LIFE, MY LIFE BECOMES A WONDER.
    I HAVE SOUND MIND AND I'M FILLED WITH WISDOM, I GET IT FASTER IN THE NAME OF JESUS.

    THIS WEEK MY WORK PROSPERS, MY FAMILY PROSPERS, MY HEALTH PROSPERS, MY LIFE MOVES FORWARD.
    I ATTRACT THE RIGHT CLIENTELE, THE RIGHT CUSTOMERS, THE RIGHT RELATIONSHIPS, I'M AT RIGHT PLACE AT THE RIGHT TIME,
    SUPERNATURAL COINCIDENCE FOR LIFTINGS HAPPENS FOR ME.

    THE LORD TEACHES ME TO PROFIT AND LEADS ME BY THE WAY I SHOULD GO. ( ISAIAH 48 VS 17).

    OH LORD, YOU ARE THE PORTION OF MY INHERITANCE AND MY CUP, YOU MAINTAIN MY LOT, THE LINES HAVE FALLEN 
    TO ME IN PLEASANT PLACES; YES, I HAVE A GOOD INHERITANCE (PSALMS 16 VS 5 - 6).

    YOU UPHOLD MY STEPS IN YOUR PATHS, THAT MY FOOTSTEPS MAY NOT SLIP. (PSALM 17 VS 5)

    THE DEVIL HOLDS NO POWER OVER ME BECAUSE I BELONG TO GOD AND I AM A MEMBER OF THE WISDOM CHURCH

    I HAVE SPOKEN YOUR WORDS OVER MY LIFE THIS WEEK LET IT BE ESTABLISHED AS A LAW.
  `;

// JoinCommunity
export const communityLinks = [
  {
    icon: 'whatsapp',
    iconFA: true,
    title: 'Join Our WhatsApp Community',
    description: 'Connect with fellow believers in our active WhatsApp group',
    url: 'https://wa.me/2347069995333',
    bgColor: 'from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700',
  },
  {
    icon: 'instagram',
    iconFA: true,
    title: 'Follow Us on Instagram',
    description: 'Stay updated with our latest posts and stories',
    url: 'https://www.instagram.com/wisdomchurchhq',
    bgColor: 'from-pink-500 to-pink-600',
    hoverColor: 'hover:from-pink-600 hover:to-pink-700',
  },
  {
    icon: 'youtube',
    iconFA: true,
    title: 'Subscribe to Our YouTube',
    description: 'Watch our sermons and inspirational content',
    url: 'https://www.youtube.com/channel/UCJuXOj075x81CYK-cCuXwdg',
    bgColor: 'from-red-500 to-red-600',
    hoverColor: 'hover:from-red-600 hover:to-red-700',
  },
];
// Add this to your givingOptions data structure
export const OnlinegivingOptions = [
  {
    title: 'Tithes & Offerring & Seeds',
    description: 'Give your tithes as an act of worship and obedience to God.',
    icon: Church, // Your existing icon
    accounts: [
      {
        bank: 'Keystone Bank',
        accountNumber: '1012525608',
        accountName: 'The Wisdom Church',
        image: KeystoneBank, // Optional
      },
      // {
      //   bank: "Providus Bank",
      //   accountNumber: "9876 5432 1098",
      //   accountName: "Wisdom House Church",
      //   image:ProvidusBank// Optional
      // },
    ],
  },
  {
    title: 'Building Projects & Outreach & Partnership',
    description: 'Support us in building a church for all ',
    icon: Church, // Your existing icon
    accounts: [
      {
        bank: 'Keystone',
        accountNumber: '1012879868',
        accountName: 'The Wisdom Church',
        image: KeystoneBank, // Optional
      },
    ],
  },
  {
    title: 'Offerring & Seeds & Tithe - Disaspora',
    description: 'May God Continually Replenish your Pocket.',
    icon: Church, // Your existing icon
    accounts: [
      {
        bank: 'Providus Bank',
        accountNumber: '5403892948',
        accountName: 'The Wisdom Church',
        image: ProvidusBank, // Optional
      },
    ],
  },
  // Add similar structure for other giving options...
];

// Sermons
export const seriesGroups = [
  {
    name: 'Monday Morning Prayers',
    searchTerms: ['MONDAY MORNING PRAYER MOMENT WITH BISHOP'],
    description: 'Start your week with powerful prayer sessions',
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: 'The Incense',
    searchTerms: ['INCENSE', 'INCENSE (SOUNDS OF VICTORY)'],
    description: 'Prayer and worship moments',
    color: 'from-orange-400 to-orange-600',
  },
  {
    name: 'Wisdom Power Conference',
    searchTerms: ['WISDOM POWER CONFERENCE'],
    description: 'Annual wisdom and power conference',
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Celebration & Communion',
    searchTerms: [
      'CELEBRATION & COMMUNION SERVICE',
      'THANKSGIVING & COMMUNION SERVICE',
      'END OF THE YEAR THANKSGIVING',
      'NOVEMBER SUPERNATURAL SERVICE',
      'CELEBRATION SERVICE',
    ],
    description: 'Special services of celebration and communion',
    color: 'from-green-400 to-green-600',
  },
  {
    name: 'Supernatural Services',
    searchTerms: [
      'SUPERNATURAL SERVICE',
      'OCTOBER SUPERNATURAL SERVICE',
      'SEPTEMBER SUPERNATURAL SERVICE',
      'AUGUST SUPERNATURAL SERVICE',
      'JULY SUPERNATURAL SERVICE',
      'FEBRUARY SUPERNATURAL SERVICE',
    ],
    description: 'Monthly supernatural services',
    color: 'from-red-400 to-red-600',
  },
  {
    name: 'Sunday Services',
    searchTerms: [
      'SUNDAY SERVICE',
      'GAINING WISDOM SERVICE',
      'SECOND SERVICE',
      'SUNDAY WORSHIP SERVICE',
    ],
    description: 'Regular Sunday worship and teaching',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    name: 'Fasting & Prayer',
    searchTerms: [
      'FASTING AND PRAYERS',
      '40 DAYS FASTING AND PRAYERS',
      '7 DAYS FASTING AND PRAYERS',
      '3 DAYS FASTING AND PRAYERS',
      '21 DAYS FASTING AND PRAYERS',
    ],
    description: 'Powerful prayer and fasting sessions',
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    name: 'Teaching Series',
    searchTerms: [
      'FAITH CONTEMPLATIONS',
      'THE WORD AND THE BELIEVER',
      'DIVINE INSTRUCTIONS',
      'THE LAW OF CONFESSION',
      'FAITH SERIES',
    ],
    description: 'Biblical teaching and faith series',
    color: 'from-teal-400 to-teal-600',
  },
  {
    name: 'Special Events',
    searchTerms: [
      'CONVERSATIONAL SERVICE',
      'NEXT LEVEL SERVICE',
      'CROSSOVER SERVICE',
      'SPECIAL SERVICE',
      'APOSTOLIC SERVICE',
    ],
    description: 'Special events and services',
    color: 'from-pink-400 to-pink-600',
  },
  {
    name: 'Midweek Services',
    searchTerms: ['MIDWEEK SERVICE', 'MDWK SERVICE'],
    description: 'Midweek teaching and fellowship',
    color: 'from-gray-400 to-gray-600',
  },
];

// AboutPastor: // lib/data/seniorPastorData.ts
export const seniorPastorData = {
  title: 'Meet Our Senior Pastor',
  description: [
    `
    


Our dear esteemed Pastor Bishop Gabriel Ayilara, is the Senior Pastor of the Wisdom Church. Over the years, he has faithfully discipled and mentored countless 
    individuals,  demonstrating the practical workings of God's Word in everyday life. He is lawfully wedded to Pastor Kenny Ayilara, 
    and together they are blessed with godly children. Through their exemplary marriage and ministry, they continue to inspire, equip, and impact lives for the Kingdom of God.",
    "His vision for The Wisdom Church is to create a place where everyone can encounter God's transformative love and discover their unique purpose. Through powerful preaching, 
    genuine relationships, and Spirit-led worship, Our Senior Pastor guides our church family toward a deeper relationship with Christ.
    `,
  ],
  buttonText: 'Connect with our Pastor',
  instagramUrl:
    'https://www.instagram.com/gabrielayilara?igsh=MXZpMHhnNGloMnViZw==',
};

//If Needed
//Bishop Gabriel Ayilara stands as a visionary
// leader, anointed with the gift of practical
// teaching that illuminates the Word of God. As
// a faithful steward of the Spirit, he is driven by a
// divine mandate to nurture and raise a
// generation of remarkable men and women,
// imbuing them with the wisdom and power of
// God. His ministry is distinguished by
// unwavering obedience, unrelenting excellence,
// boundless love, supernatural demonstrations
// of the spirit and an unshakeable commitment
// to building a transgenerational ministry where
// Transformation happens. Through his
// dedication, lives are forever changed, and a
// legacy of faith, hope, and impact is being
// etched into eternity.
// Define the missing type for resource links

export const resourceLinks = [
  {
    title: 'Sermons & Teachings',
    subtitle: 'Messages that transform lives',
    description: 'Watch, listen, and grow through powerful biblical teaching',
    path: '/resources/sermons',
    icon: Video,
    gradient: 'from-yellow-400/20 to-amber-600/10',
    glow: 'rgba(251, 191, 36, 0.4)',
    actionText: 'Listen Now →',
  },
  {
    title: 'Live Services',
    subtitle: 'Join us in real-time',
    description:
      'Stream Sunday services, prayer meetings, and special events live',
    path: '#',
    icon: Radio,
    gradient: 'from-amber-500/20 to-orange-600/10',
    glow: 'rgba(251, 146, 60, 0.5)',
    isLiveService: true,
    actionText: 'Get Notified →',
  },
  {
    title: 'Events & Programs',
    subtitle: 'Be part of something greater',
    description:
      'Conferences, revivals, outreaches, and life-changing gatherings',
    path: '/events',
    icon: Calendar,
    gradient: 'from-orange-500/20 to-red-600/10',
    glow: 'rgba(239, 68, 68, 0.4)',
    actionText: 'Join Events →',
  },
  {
    title: 'Wisdom Church Store',
    subtitle: 'Wear your faith',
    description: 'Merchandise that carries a message of hope and identity',
    path: '/resources/store',
    icon: ShoppingBag,
    gradient: 'from-red-500/20 to-pink-600/10',
    glow: 'rgba(236, 72, 153, 0.4)',
    actionText: 'Shop Now →',
  },
  {
    title: 'Pastoral Care',
    subtitle: "We're here for life's moments",
    description: 'Weddings, dedications, counseling, and sacred celebrations',
    path: '/pastoral',
    icon: Heart,
    gradient: 'from-purple-500/20 to-indigo-600/10',
    glow: 'rgba(99, 102, 241, 0.4)',
    actionText: 'Get Support →',
  },
];
