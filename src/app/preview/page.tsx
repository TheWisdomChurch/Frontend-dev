import Link from 'next/link';

import { Container, Section } from '@/shared/layout';
import PageHero from '@/features/hero/PageHero';

const previewLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Leadership', href: '/leadership' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
  { label: 'Pastoral Care', href: '/pastoral' },
  { label: 'Testimonies', href: '/testimonies' },
  { label: 'Store', href: '/resources/store' },
];

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Preview portal for the new Wisdom Church website."
        subtitle="Use this page to review the redesigned layout before publishing."
        note="This portal is for internal review. Share feedback on spacing, typography, and section structure."
        chips={['Preview', 'Layout Review', 'Content QA']}
        compact
      />

      <Section padding="xl" className="bg-[#050505]">
        <Container size="xl" className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
              Review pages
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Open each page and review spacing, typography, and alignment.
            </h2>
            <p className="text-base leading-relaxed text-white/70">
              The main goal is to keep sections breathable, align content to a
              consistent grid, and ensure the header and footer feel balanced.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previewLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm font-semibold text-white/80 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
