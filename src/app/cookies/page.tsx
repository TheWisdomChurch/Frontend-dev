import Link from 'next/link';
import {
  CheckCircle2,
  Cookie,
  Lock,
  Mail,
  ShieldCheck,
  Settings,
} from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';

const privacyCards = [
  {
    title: 'What we store',
    icon: Cookie,
    items: [
      'Session info for forms and cart actions.',
      'Light/dark mode preference when selected.',
      'Basic analytics that are aggregated and non-identifying.',
    ],
  },
  {
    title: 'Data handling',
    icon: ShieldCheck,
    items: [
      'Submitted forms are used only to respond to your request.',
      'Event, testimony, and contact submissions are not sold.',
      'We do not share submitted form data with advertisers.',
    ],
  },
  {
    title: 'Your choices',
    icon: Settings,
    items: [
      'You can clear cookies in your browser at any time.',
      'You may request deletion of your submitted data through the Contact page.',
      'You can choose not to submit optional form fields.',
    ],
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Cookies & Privacy"
        subtitle="How we use essential data to keep the site secure."
        description="We only store what is needed to run the site and respect your privacy."
        compact
      />

      <Section padding="xl" className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(247,222,18,0.13),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,#050505_0%,#080808_50%,#050505_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_50%_30%,black_22%,transparent_78%)]" />

        <Container size="xl" className="relative z-10">
          <div className="mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/35 backdrop-blur-xl sm:rounded-[2rem]">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <aside className="relative border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                  <div className="absolute right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#f7de12]/10 blur-3xl" />

                  <div className="relative">
                    <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-[#f7de12]/10 text-[#f7de12]">
                      <Lock className="h-7 w-7" />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
                      Privacy notice
                    </p>

                    <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Essential cookies only. Clear data practices.
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
                      We use only essential cookies to keep the site running,
                      protect form actions, remember basic preferences, and
                      improve reliability. No advertising trackers are used.
                    </p>

                    <div className="mt-7 rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#f7de12]" />
                        <p className="text-sm leading-6 text-white/68">
                          Your submitted form data is used for church
                          communication and request handling only.
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>

                <section className="p-5 sm:p-6 lg:p-8">
                  <div className="grid gap-4">
                    {privacyCards.map(card => {
                      const Icon = card.icon;

                      return (
                        <article
                          key={card.title}
                          className="rounded-[1.25rem] border border-white/10 bg-black/25 p-5 transition duration-200 hover:border-[#f7de12]/35 hover:bg-white/[0.035] sm:p-6"
                        >
                          <div className="flex items-start gap-4">
                            <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl border border-white/10 bg-[#f7de12]/10 text-[#f7de12]">
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h2 className="text-lg font-semibold text-white">
                                {card.title}
                              </h2>

                              <ul className="mt-4 space-y-3">
                                {card.items.map(item => (
                                  <li
                                    key={item}
                                    className="flex gap-3 text-sm leading-6 text-white/65"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#f7de12]" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-[#f7de12]/10 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-[#f7de12]" />
                          <h2 className="text-lg font-semibold text-white">
                            Questions about privacy?
                          </h2>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-white/65">
                          Reach us through the Contact page or at the church
                          office.
                        </p>
                      </div>

                      <Link
                        href="/contact"
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#f7de12] px-5 text-sm font-extrabold text-black shadow-lg shadow-[#f7de12]/20 transition hover:-translate-y-0.5 hover:bg-[#ffe93d]"
                      >
                        Contact us
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
