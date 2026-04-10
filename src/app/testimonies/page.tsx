'use client';

import { useMemo, useState } from 'react';
import { HeartHandshake, Sparkles, Users, WandSparkles } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import {
  ActionBanner,
  StatStrip,
} from '@/shared/components/site/PublicPageBlocks';

const testimonies = [
  {
    id: 1,
    name: 'Chioma Okonkwo',
    title: 'Marketing Manager',
    category: 'faith',
    quote:
      'The Wisdom Church helped me grow from inspiration alone into real spiritual discipline. The teaching gave structure to my faith again.',
  },
  {
    id: 2,
    name: 'David Adeniran',
    title: 'Software Engineer',
    category: 'healing',
    quote:
      'I came during a difficult season and found both prayer support and a community that stayed present beyond one service.',
  },
  {
    id: 3,
    name: 'Grace Adeyemi',
    title: 'Teacher',
    category: 'family',
    quote:
      'Pastoral counsel and consistent fellowship helped my family recover stability and hope in a very practical way.',
  },
  {
    id: 4,
    name: 'Samuel Olaleye',
    title: 'Business Owner',
    category: 'breakthrough',
    quote:
      'What changed me most was not only the testimony moment but the steady discipleship that followed it.',
  },
  {
    id: 5,
    name: 'Ngozi Isubu',
    title: 'Nurse',
    category: 'faith',
    quote:
      'This church gave me a place to belong while I rebuilt my prayer life and confidence in God’s direction.',
  },
  {
    id: 6,
    name: 'Tunde Okafor',
    title: 'Architect',
    category: 'salvation',
    quote:
      'I came searching for answers and found a house where the gospel was clear, personal, and impossible to ignore.',
  },
] as const;

const categories = [
  { id: 'all', label: 'All stories' },
  { id: 'faith', label: 'Growing in faith' },
  { id: 'healing', label: 'Healing and restoration' },
  { id: 'family', label: 'Family stories' },
  { id: 'breakthrough', label: 'Breakthroughs' },
] as const;

const stats = [
  {
    label: 'Story type',
    value: 'Real church journeys',
    detail:
      'These stories reflect discipleship, care, salvation, healing, and restored hope.',
    icon: Sparkles,
  },
  {
    label: 'Church impact',
    value: 'Faith formed in community',
    detail:
      'Many testimonies come from what happens after the altar moment, not only during it.',
    icon: Users,
  },
  {
    label: 'Care pathway',
    value: 'Prayer and follow-up',
    detail:
      'Personal stories often intersect with pastoral care, teaching, and steady support.',
    icon: HeartHandshake,
  },
  {
    label: 'Encouragement goal',
    value: 'Strengthen others',
    detail:
      'Testimonies remind the church that God is still working in ordinary and difficult seasons.',
    icon: WandSparkles,
  },
];

export default function TestimoniesPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]['id']>('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return testimonies;
    return testimonies.filter(
      testimony => testimony.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Stories of growth, healing, salvation, and real transformation."
        subtitle="Testimonies help the church remember that God is still working through worship, discipleship, care, and faithful obedience."
        note="These stories are not here to decorate the website. They are here to strengthen faith, encourage perseverance, and make God’s faithfulness visible."
        chips={['Faith', 'Healing', 'Family', 'Breakthroughs']}
      />

      <StatStrip items={stats} />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
                Testimony stories
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Filter by the kind of encouragement you need to read right now.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className="rounded-full border px-4 py-2 text-sm font-medium transition"
                  style={
                    activeCategory === category.id
                      ? {
                          borderColor: 'transparent',
                          color: '#050505',
                          background:
                            'linear-gradient(135deg, #d7bb75, #f0deaa)',
                        }
                      : {
                          borderColor: 'rgba(255,255,255,0.12)',
                          color: 'rgba(255,255,255,0.72)',
                          background: 'rgba(255,255,255,0.03)',
                        }
                  }
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {filtered.map(testimony => (
              <article
                key={testimony.id}
                className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(0,0,0,0.22))] p-6"
              >
                <p className="text-4xl leading-none text-[#d7bb75]">“</p>
                <p className="mt-4 text-base leading-relaxed text-white/72">
                  {testimony.quote}
                </p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-base font-semibold text-white">
                    {testimony.name}
                  </p>
                  <p className="mt-1 text-sm text-white/58">
                    {testimony.title}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <ActionBanner
        eyebrow="Share your story"
        title="If God has done something meaningful in your life through this church season, we would love to hear it."
        description="Testimonies encourage people who are still praying, still waiting, and still trying to trust God well."
        primaryHref="/contact"
        primaryLabel="Share a testimony"
        secondaryHref="/events"
        secondaryLabel="Join a service"
      />
    </div>
  );
}
