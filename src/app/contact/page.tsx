'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowUpRight,
  Camera,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { H2, Caption } from '@/shared/text';
import { Container, Section } from '@/shared/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
import apiClient, { mapValidationErrors } from '@/lib/api';

type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  isAnonymous: boolean;
};

const PRAYER_TOPIC_VALUE = 'prayer';

type SocialLink = {
  platform: string;
  handle: string;
  href: string;
  icon: LucideIcon;
};

const initialFormData: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  topic: '',
  message: '',
  isAnonymous: false,
};

const inputCls =
  'w-full rounded-[3px] border border-[var(--app-ink)]/12 bg-white px-3.5 py-3 font-ui text-[0.875rem] text-[var(--app-ink)] placeholder:text-[var(--app-ink)]/28 outline-none transition-all duration-150 focus:border-l-[3px] focus:border-l-[var(--app-primary)] focus:border-[var(--app-primary)]/40';

const labelCls =
  'block font-ui text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--app-ink)]/45';

function ContactPageContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ContactFormData>(() => ({
    ...initialFormData,
    topic:
      searchParams.get('topic') === PRAYER_TOPIC_VALUE
        ? PRAYER_TOPIC_VALUE
        : initialFormData.topic,
  }));
  const [submitted, setSubmitted] = useState(false);
  const [submittedPrayerRequest, setSubmittedPrayerRequest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socialLinks = useMemo<SocialLink[]>(
    () => [
      {
        platform: 'Instagram',
        handle: '@wisdomchurchhq',
        href: 'https://instagram.com/wisdomchurchhq',
        icon: Camera,
      },
      {
        platform: 'Facebook',
        handle: '@wisdomchurchhq',
        href: 'https://facebook.com/wisdomchurchhq',
        icon: Users,
      },
      {
        platform: 'YouTube',
        handle: 'Wisdom Church',
        href: 'https://youtube.com/@wisdomchurchhq',
        icon: PlayCircle,
      },
    ],
    []
  );

  const updateField =
    (field: keyof ContactFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFormData(cur => ({ ...cur, [field]: e.target.value }));
    };

  const isPrayerRequest = formData.topic === PRAYER_TOPIC_VALUE;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    setError(null);
    try {
      if (isPrayerRequest) {
        await apiClient.submitPrayerRequest({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          request: formData.message,
          isAnonymous: formData.isAnonymous,
        });
      } else {
        await apiClient.submitContactMessage({
          ...formData,
          sourceChannel: 'frontend:web:contact-page',
        });
      }
      setSubmitted(true);
      setSubmittedPrayerRequest(isPrayerRequest);
      setFormData(initialFormData);
    } catch (err) {
      const fields = mapValidationErrors(err);
      setError(
        fields
          ? (Object.values(fields)[0] ??
              'Please check your details and try again.')
          : 'Unable to send your message right now. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Get in touch"
        title="We'd love to hear from you."
        subtitle="Plan a visit, request prayer, or send us a message — we'll get back to you quickly."
        compact
      />

      {/* ── Main content ─────────────────────────────────────── */}
      <Section padding="xl" className="bg-[var(--app-canvas)]">
        <Container size="xl">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20 xl:gap-24">
            {/* ── Left: contact info ───────────────────────── */}
            <ScrollFadeIn>
              <aside className="space-y-10 lg:sticky lg:top-28 lg:h-fit">
                {/* Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                    <p className="font-ui text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
                      Visit us
                    </p>
                  </div>
                  <p className="font-headline text-[1.45rem] font-normal leading-snug text-[var(--app-ink)]">
                    Honor Gardens
                  </p>
                  <div className="space-y-1 font-ui text-[0.82rem] leading-[1.7] text-[var(--app-ink)]/70">
                    <p>Opposite Dominion Church HQ</p>
                    <p>Alasia bus stop, Lekki-Epe Expressway</p>
                    <p>Lagos, Nigeria</p>
                  </div>
                  <div className="pt-1 space-y-0.5">
                    <p className="font-ui text-[0.78rem] font-semibold text-[var(--app-ink)]/70">
                      Sundays · 9:00 AM
                    </p>
                    <p className="font-ui text-[0.78rem] font-semibold text-[var(--app-ink)]/70">
                      Daily Prayer · 7:00 AM
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--app-ink)]/8" />

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                    <p className="font-ui text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
                      Call us
                    </p>
                  </div>
                  <a
                    href="https://wa.me/2347069995333"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-headline text-[1.15rem] font-normal text-[var(--app-ink)] transition hover:text-[var(--app-primary)]"
                  >
                    +234 706 999 5333
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition group-hover:opacity-100" />
                  </a>
                  <p className="font-ui text-[0.76rem] text-[var(--app-ink)]/45">
                    Open on WhatsApp
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--app-ink)]/8" />

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                    <p className="font-ui text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
                      Email us
                    </p>
                  </div>
                  <a
                    href="mailto:wisdomhousehq@gmail.com"
                    className="group inline-flex items-center gap-2 font-ui text-[0.9rem] font-medium text-[var(--app-ink)] transition hover:text-[var(--app-primary)]"
                  >
                    wisdomhousehq@gmail.com
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition group-hover:opacity-100" />
                  </a>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--app-ink)]/8" />

                {/* Social */}
                <div className="space-y-4">
                  <p className="font-ui text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--app-ink)]/40">
                    Follow us
                  </p>
                  <div className="flex flex-col gap-3">
                    {socialLinks.map(s => (
                      <a
                        key={s.platform}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 transition"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-card border border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)] text-[var(--app-ink)]/50 transition group-hover:border-[var(--app-primary)]/30 group-hover:text-[var(--app-primary)]">
                          <s.icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="flex flex-col">
                          <span className="font-ui text-[0.82rem] font-semibold text-[var(--app-ink)]">
                            {s.platform}
                          </span>
                          <span className="font-ui text-[0.72rem] text-[var(--app-ink)]/40">
                            {s.handle}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </ScrollFadeIn>

            {/* ── Right: form ──────────────────────────────── */}
            <ScrollFadeIn delay={0.08}>
              <div className="border border-[var(--app-ink)]/10 bg-white">
                {/* Dark header band */}
                <div className="bg-[var(--app-dark)] px-7 py-6 sm:px-8 sm:py-7">
                  <p className="font-ui text-[0.55rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
                    Message us
                  </p>
                  <H2 className="mt-2 font-headline text-[1.45rem] font-normal leading-snug text-white sm:text-[1.6rem]">
                    Send us a message.
                  </H2>
                  <p className="mt-1.5 font-ui text-[0.78rem] text-white/45">
                    We respond within 24 hours on weekdays.
                  </p>
                </div>

                <form
                  id="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-0 divide-y divide-[var(--app-ink)]/6"
                >
                  {/* Name row */}
                  <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-[var(--app-ink)]/6">
                    <label className="block px-7 py-5 sm:px-8">
                      <span className={labelCls}>First name</span>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={updateField('firstName')}
                        required
                        autoComplete="given-name"
                        className={`${inputCls} mt-2`}
                        placeholder="John"
                      />
                    </label>
                    <label className="block px-7 py-5 sm:px-8">
                      <span className={labelCls}>Last name</span>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={updateField('lastName')}
                        required
                        autoComplete="family-name"
                        className={`${inputCls} mt-2`}
                        placeholder="Doe"
                      />
                    </label>
                  </div>

                  {/* Contact row */}
                  <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-[var(--app-ink)]/6">
                    <label className="block px-7 py-5 sm:px-8">
                      <span className={labelCls}>Email address</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={updateField('email')}
                        required
                        autoComplete="email"
                        className={`${inputCls} mt-2`}
                        placeholder="you@example.com"
                      />
                    </label>
                    <label className="block px-7 py-5 sm:px-8">
                      <span className={labelCls}>
                        Phone{' '}
                        <span className="normal-case font-normal tracking-normal text-[var(--app-ink)]/30">
                          (optional)
                        </span>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={updateField('phone')}
                        autoComplete="tel"
                        className={`${inputCls} mt-2`}
                        placeholder="+234 706 999 5333"
                      />
                    </label>
                  </div>

                  {/* Topic */}
                  <div className="px-7 py-5 sm:px-8">
                    <label className="block">
                      <span className={labelCls}>What is this about?</span>
                      <select
                        name="topic"
                        value={formData.topic}
                        onChange={updateField('topic')}
                        className={`${inputCls} mt-2 cursor-pointer`}
                      >
                        <option value="">Select a topic</option>
                        <option value="visit">Planning a visit</option>
                        <option value={PRAYER_TOPIC_VALUE}>
                          Prayer request
                        </option>
                        <option value="connect">
                          Connect &amp; get involved
                        </option>
                        <option value="events">Events &amp; programmes</option>
                        <option value="media">Media &amp; resources</option>
                        <option value="other">General enquiry</option>
                      </select>
                    </label>
                  </div>

                  {/* Message */}
                  <div className="px-7 py-5 sm:px-8">
                    <label className="block">
                      <span className={labelCls}>
                        {isPrayerRequest
                          ? 'Your prayer request'
                          : 'Your message'}
                      </span>
                      <textarea
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={updateField('message')}
                        required
                        className={`${inputCls} mt-2 min-h-[120px] resize-none`}
                        placeholder={
                          isPrayerRequest
                            ? 'Share what you would like us to pray with you about...'
                            : 'Write your message here...'
                        }
                      />
                    </label>
                    {isPrayerRequest && (
                      <label className="mt-3 flex items-center gap-2.5 font-ui text-[0.8rem] text-[var(--app-ink)]/70">
                        <input
                          type="checkbox"
                          checked={formData.isAnonymous}
                          onChange={e =>
                            setFormData(cur => ({
                              ...cur,
                              isAnonymous: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-[var(--app-ink)]/20 accent-[var(--app-primary)]"
                        />
                        Keep my request anonymous to the prayer team
                      </label>
                    )}
                  </div>

                  {/* Footer row */}
                  <div className="flex flex-col gap-4 bg-[var(--app-canvas)] px-7 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2.5 bg-[var(--app-ink)] px-8 py-3.5 font-ui text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white transition duration-150 hover:bg-[var(--app-primary)] hover:text-[var(--app-ink)] disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Send message'}
                      {!submitting && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 6h10M6 1l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <Caption className="text-[var(--app-ink)]/38">
                      For pastoral care, visit our{' '}
                      <Link
                        href="/pastoral"
                        className="text-[var(--app-primary)] underline underline-offset-2"
                      >
                        Pastoral Care
                      </Link>{' '}
                      page.
                    </Caption>
                  </div>

                  {submitted && (
                    <div
                      className="border-t border-emerald-100 bg-emerald-50 px-7 py-4 font-ui text-[0.82rem] text-emerald-700 sm:px-8"
                      aria-live="polite"
                    >
                      {submittedPrayerRequest
                        ? 'Your prayer request has been received. Our pastoral team will be praying with you.'
                        : 'Message sent. Our team will be in touch within 24 hours.'}
                    </div>
                  )}

                  {error && (
                    <div
                      className="border-t border-rose-100 bg-rose-50 px-7 py-4 font-ui text-[0.82rem] text-rose-700 sm:px-8"
                      aria-live="polite"
                    >
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </ScrollFadeIn>
          </div>
        </Container>
      </Section>

      {/* ── Find us strip ────────────────────────────────────── */}
      <section className="overflow-hidden min-w-0 border-t border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)]">
        <Container size="xl">
          <div className="flex flex-col gap-1.5 py-7 sm:flex-row sm:items-center sm:justify-between sm:py-6">
            <p className="font-ui text-[0.78rem] font-semibold text-[var(--app-ink)]/60">
              Honor Gardens, Alasia bus stop, Lekki-Epe Expressway, Lagos
            </p>
            <Link
              href="/events"
              className="font-ui text-[0.76rem] font-semibold text-[var(--app-primary)] transition hover:text-[var(--app-ink)]"
            >
              See service times →
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  );
}
