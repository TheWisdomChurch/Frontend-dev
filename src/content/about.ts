import {
  BookOpen,
  Crown,
  Gem,
  HandHeart,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

export const ABOUT_CONTENT = {
  hero: {
    eyebrow: 'About The Wisdom Church',
    title: 'The Wisdom Church, raising the complete believer.',
    description:
      'We introduce people to Jesus and the balanced doctrine of the Spirit—equipping them with the wisdom and power of God to flourish in every facet of life.',
    images: [
      {
        src: '/Picflow/DSC00268 copy.webp',
        alt: 'Worship at The Wisdom Church',
      },
      {
        src: '/Picflow/DSC00268 copy.webp',
        alt: 'The Word being taught at The Wisdom Church',
      },
      {
        src: '/Picflow/DSC00019 copy.webp',
        alt: 'Community at The Wisdom Church',
      },
    ],
  },
  vision: {
    label: 'Our vision',
    title: 'Wisdom. Power. Faith. Greatness.',
    body: 'To equip a people with the wisdom and power of God, for their establishment in the faith and for manifesting greatness in every facet of life.',
  },
  mission: {
    label: 'Our mission',
    title: 'Introducing people to Jesus.',
    body: 'To introduce men, women, and children to Jesus and the balanced doctrine of the Spirit; helping them experience dimensions found in God and live in the earth as His children.',
  },
  message: {
    label: 'Our message',
    title: 'Christ and Him crucified.',
    themes: ['Good news', 'Hope', 'Love', 'Wisdom', 'Faith', 'Prayer'],
  },
  pillars: [
    {
      title: 'Wisdom',
      body: 'Know the Word. Apply the Word. Act according to the Word.',
    },
    {
      title: 'Leadership',
      body: 'Influence society through Kingdom virtue, integrity, impact, and service.',
    },
    {
      title: 'Excellent Spirit',
      body: 'Live with a sound mind, obedient alignment, superior skill, and Spirit-led execution.',
    },
    {
      title: 'Greatness',
      body: 'Fulfil God’s intent in every area of life—greatness is our covenant and calling.',
    },
    {
      title: 'Dominion',
      body: 'Be fruitful, multiply, fill the earth, and influence every sphere for God’s glory.',
    },
  ],
  churchIdentity: [
    {
      icon: BookOpen,
      title: 'Established by grace',
      body: 'We embrace God’s sovereignty and are established solely by His grace and in His Word.',
    },
    {
      icon: Sparkles,
      title: 'Spirit-filled and yielded',
      body: 'We pursue a life that is filled with the Spirit, yielded to the Spirit, and deep in God.',
    },
    {
      icon: Lightbulb,
      title: 'Wisdom for life',
      body: 'We demonstrate the wisdom of God in our work, decisions, relationships, and everyday lives.',
    },
    {
      icon: Gem,
      title: 'Productivity and excellence',
      body: 'We develop our gifts and execute with excellence as an expression of obedience to God.',
    },
    {
      icon: HandHeart,
      title: 'Love and generosity',
      body: 'We practise love, righteousness, fairness, equity, and generosity toward God and people.',
    },
    {
      icon: Crown,
      title: 'Distinctly Christlike',
      body: 'We represent Christ without compromise and carry His light into every sphere of influence.',
    },
  ],
  practices: [
    'Prayer',
    'The Word',
    'Evangelism',
    'Participation',
    'Giving',
    'Love and humility',
    'Community',
  ],
  declaration:
    'Christ dwells in my heart by faith. I am rooted and grounded in love. I am anointed. I am different.',
} as const;

export type AboutPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    images: (typeof ABOUT_CONTENT.hero.images)[number][];
  };
  vision: typeof ABOUT_CONTENT.vision;
  mission: typeof ABOUT_CONTENT.mission;
  message: typeof ABOUT_CONTENT.message;
  pillars: ReadonlyArray<{ title: string; body: string }>;
  churchIdentity: typeof ABOUT_CONTENT.churchIdentity;
  practices: typeof ABOUT_CONTENT.practices;
  declaration: string;
};

const nonEmpty = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const normalizeChurchBrand = (value: string) =>
  value
    .replace(/\bA\s+Wisdom\s+House\b/gi, 'The Wisdom Church')
    .replace(/\bWisdom\s+House\b/gi, 'Wisdom Church');

/** Adapts the existing CMS response to the editorial page contract. */
export function resolveAboutContent(
  cms: Record<string, unknown> | null
): AboutPageContent {
  const suppliedPillars = Array.isArray(cms?.pillars)
    ? cms.pillars
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === 'object'
        )
        .map(item => ({
          title: normalizeChurchBrand(nonEmpty(item.title, '')),
          body: normalizeChurchBrand(nonEmpty(item.body, '')),
        }))
        .filter(item => item.title && item.body)
    : [];

  return {
    ...ABOUT_CONTENT,
    hero: {
      ...ABOUT_CONTENT.hero,
      eyebrow: normalizeChurchBrand(
        nonEmpty(cms?.eyebrow, ABOUT_CONTENT.hero.eyebrow)
      ),
      title: normalizeChurchBrand(
        nonEmpty(cms?.title, ABOUT_CONTENT.hero.title)
      ),
      description: normalizeChurchBrand(
        nonEmpty(cms?.subtitle, ABOUT_CONTENT.hero.description)
      ),
      images: [...ABOUT_CONTENT.hero.images],
    },
    pillars:
      suppliedPillars.length >= 5
        ? suppliedPillars.slice(0, 5)
        : ABOUT_CONTENT.pillars,
  };
}
