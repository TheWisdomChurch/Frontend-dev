'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, ShoppingBag, Users } from 'lucide-react';
import { WhatWeDo_3, Deacon_1, wisdomShirt_1 } from '@/shared/assets';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';

const RESOURCES = [
  {
    title: 'Sermons & Messages',
    label: 'Media',
    desc: 'Watch, listen, and grow with life-transforming messages straight from the pulpit.',
    href: '/resources/sermons',
    cta: 'Browse sermons',
    img: WhatWeDo_3,
    icon: BookOpen,
  },
  {
    title: 'Pastoral Care & Prayer',
    label: 'Care',
    desc: 'Connect with shepherds ready to stand in faith with you and provide pastoral guidance.',
    href: '/pastoral',
    cta: 'Request care',
    img: Deacon_1,
    icon: Heart,
  },
  {
    title: 'Wisdom Store & Materials',
    label: 'Store',
    desc: 'Equip your daily walk with books, devotional materials, and church resources.',
    href: '/resources/store',
    cta: 'Visit store',
    img: wisdomShirt_1,
    icon: ShoppingBag,
  },
  {
    title: 'Ministries & Workforce',
    label: 'Community',
    desc: 'Discover your divine gifts and find an active community where you can serve.',
    href: '/ministries',
    cta: 'Explore ministries',
    img: WhatWeDo_3,
    icon: Users,
  },
];

interface ExploreMoreBandProps {
  tone?: 'canvas' | 'dark' | 'brand';
  className?: string;
}

export function ExploreMoreBand({
  tone = 'canvas',
  className,
}: ExploreMoreBandProps) {
  return (
    <Section tone={tone} className={className}>
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Connect & Grow"
            title="You can do"
            accent="more."
            description="Explore our ministries, teachings, and care networks designed to nurture your walk with God."
            tone={tone === 'dark' ? 'dark' : undefined}
          />

          <Link
            href="/resources"
            className="group hidden min-h-[44px] items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-2 font-ui text-body-sm font-semibold text-[var(--app-text)] shadow-sm transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)] sm:inline-flex"
          >
            <span>All resources</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--app-primary)] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-primary)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--app-primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] text-[var(--app-primary-dark)] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-ui text-caption font-bold uppercase tracking-widest text-[var(--app-muted)]">
                      {item.label}
                    </span>
                  </div>

                  <h3 className="mt-5 font-headline text-heading-sm font-semibold text-[var(--app-text)] group-hover:text-[var(--app-primary-dark)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-ui text-body-sm leading-relaxed text-[var(--app-muted)]">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 flex min-h-[44px] items-center gap-2 font-ui text-body-sm font-bold text-[var(--app-primary-dark)]">
                  <span>{item.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
