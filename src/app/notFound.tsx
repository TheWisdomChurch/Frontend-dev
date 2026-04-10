import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="That page could not be found."
        subtitle="The route may have changed, the page may have moved, or the link may no longer exist."
        note="Use the links below to get back to the main church pages without guessing where to go next."
        chips={['Home', 'Events', 'Resources', 'Contact']}
        compact
      />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="lg">
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/"
              className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.05]"
            >
              <Home className="h-8 w-8 text-[#d7bb75]" />
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Go to homepage
              </h2>
              <p className="mt-2 text-base leading-relaxed text-white/66">
                Start again from the main landing page and navigate to the
                section you need.
              </p>
            </Link>

            <Link
              href="/contact"
              className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.05]"
            >
              <Compass className="h-8 w-8 text-[#d7bb75]" />
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Need help finding something?
              </h2>
              <p className="mt-2 text-base leading-relaxed text-white/66">
                Use the contact page if you were trying to reach the church or
                need the right route quickly.
              </p>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
