import { Church } from 'lucide-react';
import {
  NavLink,
  ExtendedNavLink,
  Leader,
  MinistryLeader,
  Sermon,
  Ministry,
  ServiceBox,
  // GivingOption,
  Photo,
  Slide,
} from './types';

import {
  WhatWeDo_3,
  hero_bg_1,
  hero_bg_2,
  hero_bg_3,
  Whatwedo_1,
  Associate_1,
  Associate_2,
  Whatwedo_2,
  ProvidusBank,
  KeystoneBank,
  Dept_1,
  Dept_2,
  Dept_3,
  // Dept_4,
  Whatwedo_4,
  Img_1,
  Children_head,
  PstKenny,
  Min_Adura,
} from '@/components/assets';
import { Instagram, MessageCircle, Youtube } from 'lucide-react';

export const slides: Slide[] = [
  {
    image: hero_bg_1,
    title: 'We Are Transformed',
    subtitle: "Experience God's Transforming Power",
    description:
      'Welcome to The Wisdom House Church where lives are transformed through faith, community, and divine guidance.',
  },
  {
    image: hero_bg_2,
    title: 'Growing In Faith',
    subtitle: 'Deepen Your Spiritual Journey',
    description:
      'Join our vibrant community as we grow together in faith, love, and service to others.',
  },
  {
    image: hero_bg_3,
    title: 'Building Community',
    subtitle: 'Connect With Believers',
    description:
      'Experience the warmth of genuine fellowship and build lasting relationships in Christ.',
  },
];

// Extended navigation links with icons and dropdowns
export const extendedNavLinks: ExtendedNavLink[] = [
  {
    label: 'Home',
    href: '/',
    icon: 'Home',
    isActive: true,
  },
  {
    label: 'About',
    href: '/about',
    icon: 'Users',
    dropdown: [
      // { label: 'Our Story', href: '/about/story' },
      // { label: 'Our Beliefs', href: '/about/beliefs' },
      { label: 'Leadership', href: '/about/leadership' },
      { label: 'Mission & Vision', href: '/about/mission' },
    ],
  },
  {
    label: 'Ministries',
    href: '/ministries',
    icon: 'Users',
    // dropdown: [
    //   { label: 'Children Ministry', href: '/ministries/children' },
    //   { label: 'Youth Ministry', href: '/ministries/youth' },
    //   { label: 'Women Ministry', href: '/ministries/women' },
    //   { label: 'Men Ministry', href: '/ministries/men' },
    //   { label: 'Outreach', href: '/ministries/outreach' },
    // ],
  },
  {
    label: 'Events',
    href: '/events',
    icon: 'Calendar',
    dropdown: [
      { label: 'Upcoming Events', href: '/events/upcoming' },
      // { label: 'Weekly Services', href: '/events/weekly' },
      // { label: 'Special Events', href: '/events/special' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    icon: 'BookOpen',
    dropdown: [
      { label: 'Sermons', href: '/resources/sermons' },
      // { label: 'Blog', href: '/resources/blogs' },
      { label: 'Publications', href: '/resources/publications' },
      { label: 'Store', href: '/resources/store' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: 'Phone',
  },
];

// Keep your existing data
export const navLinks: NavLink[] = [
  { href: '#sermons', label: 'Sermons' },
  { href: '#livestream', label: 'Livestream' },
  { href: '#ministries', label: 'Ministries' },
  { href: '#community', label: 'Community' },
  { href: '/generate', label: 'Generate' },
];

export const leaders: Leader[] = [
  {
    id: 1,
    name: 'Rev. Victor Jimba',
    role: 'Resident Pastor',
    image: Associate_2,
    description:
      'Provides overall spiritual leadership and vision for the church.',
  },
  {
    id: 2,
    name: 'Pastor Kenny Ayilara',
    role: 'Assistant Pastor',
    image: PstKenny,
    description: 'Supports the senior pastor in ministry and pastoral care.',
  },
  {
    id: 3,
    name: 'Deacon Adeyemi ',
    role: 'Head Service Preparatory Unit',
    image: Associate_1,
    description: 'Oversees service preparation and logistics.',
  },
  {
    id: 4,
    name: 'Deacon Bamidele',
    role: 'Head Technical',
    image: Associate_1,
    description: 'Manages technical operations and equipment.',
  },
];

export const sermons: Sermon[] = [
  {
    title: 'Faith Over Fear',
    preacher: 'Pastor John Doe',
    date: 'July 14, 2024',
    imageId: 'sermon-1',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    title: 'The Power of Grace',
    preacher: 'Pastor John Doe',
    date: 'July 7, 2024',
    imageId: 'sermon-2',
    videoId: '3tmd-ClafbY',
  },
  {
    title: 'Living a Purpose-Driven Life',
    preacher: 'Guest Speaker',
    date: 'June 30, 2024',
    imageId: 'sermon-3',
    videoId: '6-x1g_c1g4o',
  },
];

export const ministries: Ministry[] = [
  {
    name: 'Kids Ministry',
    description: 'Fun and faith for the next generation.',
    imageId: Children_head,
  },
  {
    name: 'Youth Group',
    description: 'Connecting teens with God and each other.',
    imageId: 'ministry-2',
  },
  {
    name: 'Worship Team',
    description: 'Leading the congregation in praise.',
    imageId: Min_Adura,
  },
  {
    name: 'Community Outreach',
    description: 'Serving our city with love and action.',
    imageId: Associate_2,
  },
];

export const youtubeLivestreams = {
  current: 'jfKfPfyJRdk',
  previous: ['3tmd-ClafbY', '6-x1g_c1g4o', 'dQw4w9WgXcQ'],
};

// What we do
export const whatWeDoData: ServiceBox[] = [
  {
    id: 1,
    title: ' Expect the word to work  ',
    description:
      "We actively apply God's Word in our daily lives, transforming biblical teachings into practical actions that impact our community and deepen our faith journey.",
    image: Whatwedo_4,
    imageAlt: 'Worship service',
  },
  {
    id: 2,
    title: 'Expect the power of prayer',
    description:
      "Through fervent prayer, we connect with God's divine power, witnessing miraculous transformations and spiritual breakthroughs in our lives and community.",
    image: Whatwedo_2,
    imageAlt: 'Prayer gathering',
    gradient: 'from-purple-900 to-purple-700',
    imageOpacity: 60,
  },
  {
    id: 3,
    title: 'Expect Powerful Worship',
    description:
      'In heartfelt worship, we glorify God through song, praise, and devotion, creating an atmosphere where His presence transforms hearts and renews spirits.',
    image: Whatwedo_1,
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

export const missionStatement =
  'At The Wisdom Church, we are committed to spreading the Gospel and empowering believers through the Word of God and the Holy Spirit. Our mission is to create a community where faith thrives and transformation is possible.';

export const pastorsData: Leader[] = [
  {
    id: 1,
    name: 'Rev. Victor Jimba',
    role: 'Resident Pastor',
    image: Associate_2,
    description:
      'Provides overall spiritual leadership and vision for the church.',
  },
  {
    id: 2,
    name: 'Deacon Bamidele',
    role: 'Head Technical & Sound Unit',
    image: Associate_1,
    description: 'Oversees technical operations and sound systems',
  },
  {
    id: 3,
    name: 'Deacon Adeyemi',
    role: 'Head Service Preparatory Unit',
    image: Associate_1,
    description: 'Manages service preparation and logistics.',
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

export const photos: Photo[] = [
  {
    title: 'Media Department',
    image: Dept_3,
    link: '#',
  },
  {
    title: 'Service Preparatory Unit',
    image: Dept_2,
    link: '#',
  },
  {
    title: 'Music(WaveCityMusic)',
    image: Dept_1,
    link: '#',
  },
  {
    title: 'Prayer/Intercessory Unit',
    image: Whatwedo_2,
    link: '#',
  },
  {
    title: 'Protocol/Ushering Department',
    image: Img_1,
    link: '#',
  },
  {
    title: 'Children Department',
    image: Children_head,
    link: '#',
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

    THE DEVIL HOLDS NO POWER OVER ME BECAUSE I BELONG TO GOD AND I AM A MEMBER OF THE WISDOM CHURCH (HOUSE)

    I HAVE SPOKEN YOUR WORDS OVER MY LIFE THIS WEEK LET IT BE ESTABLISHED AS A LAW.
  `;

// JoinCommunity
export const communityLinks = [
  {
    icon: MessageCircle,
    title: 'Join Our WhatsApp Community',
    description: 'Connect with fellow believers in our active WhatsApp group',
    url: 'https://wa.me/2347069995333',
    bgColor: 'from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700',
  },
  {
    icon: Instagram,
    title: 'Follow Us on Instagram',
    description: 'Stay updated with our latest posts and stories',
    url: 'https://www.instagram.com/wisdomchurchhq',
    bgColor: 'from-pink-500 to-pink-600',
    hoverColor: 'hover:from-pink-600 hover:to-pink-700',
  },
  {
    icon: Youtube,
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
    


Our dear esteemed Pastor Bishop Gabriel Ayilara, is the Senior Pastor of the Wisdom House Church. Over the years, he has faithfully discipled and mentored countless 
    individuals,  demonstrating the practical workings of God's Word in everyday life. He is lawfully wedded to Pastor Kenny Ayilara, 
    and together they are blessed with godly children. Through their exemplary marriage and ministry, they continue to inspire, equip, and impact lives for the Kingdom of God.",
    "His vision for The Wisdom Church is to create a place where everyone can encounter God's transformative love and discover their unique purpose. Through powerful preaching, 
    genuine relationships, and Spirit-led worship, Our Senior Pastor guides our church family toward a deeper relationship with Christ.
    `,
  ],
  buttonText: 'Learn More About Our Pastor',
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
