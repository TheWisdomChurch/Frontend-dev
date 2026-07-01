import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, ShieldCheck, Eye, Mail, UserCheck } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { H1, H2, BodySM, Eyebrow } from '@/shared/text';
import { Container, Section } from '@/shared/layout';

export const metadata: Metadata = {
  title: 'Privacy Policy — Wisdom Church',
  description:
    'How Wisdom Church collects, uses, and protects your personal information.',
};

const sections = [
  {
    title: 'Information we collect',
    icon: Eye,
    items: [
      'Name and contact details submitted through forms (contact, prayer, pastoral care).',
      'Event registration information provided when signing up for church programs.',
      'Testimony submissions shared voluntarily through the testimonies feature.',
      'Giving intent records when you interact with our online giving options.',
      'Basic analytics data to understand how people navigate the site (aggregated, non-identifying).',
    ],
  },
  {
    title: 'How we use your information',
    icon: UserCheck,
    items: [
      'To respond to your contact, prayer, or pastoral care requests.',
      'To process event registrations and communicate event details.',
      'To display approved testimonies (only with your consent at submission).',
      'To improve the website experience using aggregated analytics.',
      'We do not sell, trade, or share your personal data with third parties for marketing.',
    ],
  },
  {
    title: 'Data protection',
    icon: ShieldCheck,
    items: [
      'All form submissions are transmitted over HTTPS (encrypted).',
      'Personal data is stored on secured servers and access is restricted to authorized staff.',
      'We retain submitted data only as long as necessary to fulfill the purpose for which it was shared.',
      'You may request correction or deletion of your data at any time via the Contact page.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--app-dark)] text-white">
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information."
        compact
      />

      <Section
        padding="xl"
        className="relative overflow-hidden bg-[var(--app-dark)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(201,150,26,0.10),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,#050505_0%,#080808_50%,#050505_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_50%_30%,black_22%,transparent_78%)]" />

        <Container size="xl" className="relative z-10">
          <div className="mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/35 backdrop-blur-xl sm:rounded-[2rem]">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                {/* Sidebar */}
                <aside className="relative border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                  <div className="absolute right-0 top-0 h-56 w-56 translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--app-primary)]/10 blur-3xl" />
                  <div className="relative">
                    <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
                      <Lock className="h-7 w-7" />
                    </div>
                    <Eyebrow className="text-[var(--app-primary)]">
                      Your privacy matters
                    </Eyebrow>
                    <H1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      We handle your information with care and respect.
                    </H1>
                    <BodySM className="mt-4 text-white/65 sm:text-base">
                      Wisdom Church is committed to protecting the privacy of
                      everyone who interacts with our website and services. This
                      policy explains what we collect, why we collect it, and
                      how it is handled.
                    </BodySM>
                    <p className="mt-6 font-ui text-[0.75rem] text-white/35">
                      Last updated: July 2026
                    </p>
                    <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4">
                      <p className="font-ui text-[0.78rem] leading-[1.75] text-white/60">
                        By using this site you agree to this policy. If you have
                        questions, reach out through our Contact page.
                      </p>
                    </div>
                  </div>
                </aside>

                {/* Main content */}
                <section className="p-5 sm:p-6 lg:p-8">
                  <div className="grid gap-4">
                    {sections.map(item => {
                      const Icon = item.icon;
                      return (
                        <article
                          key={item.title}
                          className="rounded-[1.25rem] border border-white/10 bg-black/25 p-5 transition duration-200 hover:border-[var(--app-primary)]/35 hover:bg-white/[0.035] sm:p-6"
                        >
                          <div className="flex items-start gap-4">
                            <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl border border-white/10 bg-[var(--app-primary)]/10 text-[var(--app-primary)]">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <H2 className="text-lg font-semibold text-white">
                                {item.title}
                              </H2>
                              <ul className="mt-4 space-y-3">
                                {item.items.map(point => (
                                  <li
                                    key={point}
                                    className="flex gap-3 text-sm leading-6 text-white/65"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--app-primary)]" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* Contact CTA */}
                  <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-[var(--app-primary)]/10 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-[var(--app-primary)]" />
                          <H2 className="text-lg font-semibold text-white">
                            Privacy questions?
                          </H2>
                        </div>
                        <BodySM className="mt-2 text-white/65">
                          Contact us to request access, correction, or deletion
                          of your data.
                        </BodySM>
                      </div>
                      <Link
                        href="/contact"
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--app-primary)] px-5 text-sm font-extrabold text-black shadow-lg shadow-[var(--app-primary)]/20 transition hover:-translate-y-0.5 hover:bg-[#ffe93d]"
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
