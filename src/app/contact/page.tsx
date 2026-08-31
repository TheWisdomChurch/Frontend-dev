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

import Arrow from '@/shared/ui/icons/Arrow';
import SiteHero from '@/features/hero/SiteHero';
import { LocationMap } from '@/shared/ui/LocationMap';
import JsonLd from '@/shared/seo/JsonLd';
import {
  buildBreadcrumbSchema,
  canonicalUrl,
  ORG_ID,
  SITE_NAME,
} from '@/lib/seo';
import apiClient, { mapValidationErrors } from '@/lib/api';
import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { PhoneNumberField } from '@/shared/ui/forms';
import {
  DEFAULT_PHONE_COUNTRY,
  isValidNationalPhone,
  toE164,
} from '@/lib/validation/phone';
import type { CountryCode } from 'libphonenumber-js';
import {
  Actions,
  Container,
  CtaLink,
  Eyebrow,
  Page,
  Panel,
  Section,
  SectionHeader,
  fieldClass,
  fieldHelpClass,
  fieldLabelClass,
} from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';

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
const VISIT_TOPIC_VALUE = 'visit';
const CONNECT_TOPIC_VALUE = 'connect';
const PREFILLABLE_TOPICS = [
  PRAYER_TOPIC_VALUE,
  VISIT_TOPIC_VALUE,
  CONNECT_TOPIC_VALUE,
];

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

const inputCls = fieldClass;
const labelCls = fieldLabelClass;

const MAP_QUERY = SERVICE_INFO.venue.full;
const DIRECTIONS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAP_QUERY
)}`;

function ContactPageContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ContactFormData>(() => {
    const requestedTopic = searchParams.get('topic');
    return {
      ...initialFormData,
      topic: PREFILLABLE_TOPICS.includes(requestedTopic ?? '')
        ? (requestedTopic as string)
        : initialFormData.topic,
    };
  });
  const [submitted, setSubmitted] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(
    DEFAULT_PHONE_COUNTRY
  );
  const [submittedPrayerRequest, setSubmittedPrayerRequest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socialLinks = useMemo<SocialLink[]>(
    () => [
      {
        platform: 'Instagram',
        handle: SOCIAL_LINKS.handle,
        href: SOCIAL_LINKS.instagram,
        icon: Camera,
      },
      {
        platform: 'Facebook',
        handle: SOCIAL_LINKS.handle,
        href: SOCIAL_LINKS.facebook,
        icon: Users,
      },
      {
        platform: 'YouTube',
        handle: SOCIAL_LINKS.handle,
        href: SOCIAL_LINKS.youtube,
        icon: PlayCircle,
      },
    ],
    []
  );

  const contactChannels = useMemo(
    () => [
      {
        icon: MapPin,
        label: 'Visit',
        value: SERVICE_INFO.venue.name,
        detail: SERVICE_INFO.venue.short,
        href: DIRECTIONS_HREF,
      },
      {
        icon: Phone,
        label: 'Call or WhatsApp',
        value: CONTACT_INFO.phone,
        detail: 'Weekdays · same-day reply',
        href: SOCIAL_LINKS.whatsapp,
      },
      {
        icon: Mail,
        label: 'Email',
        value: CONTACT_INFO.email,
        detail: 'Within 24 hours on weekdays',
        href: `mailto:${CONTACT_INFO.email}`,
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
      if (
        formData.phone.trim() &&
        !isValidNationalPhone(formData.phone, phoneCountry)
      ) {
        setError('Enter a valid phone number for the selected country.');
        return;
      }
      const phone = formData.phone.trim()
        ? toE164(formData.phone, phoneCountry) || undefined
        : undefined;
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
          phone,
          sourceChannel: 'frontend:web:contact-page',
        });
      }
      setSubmitted(true);
      setSubmittedPrayerRequest(isPrayerRequest);
      setFormData(initialFormData);
      setPhoneCountry(DEFAULT_PHONE_COUNTRY);
    } catch (err) {
      const fields = mapValidationErrors(err);
      setError(
        fields
          ? (Object.values(fields)[0] ??
              'Please check your details and try again.')
          : 'Unable to send your message right now. Your details are still here—please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: `Contact ${SITE_NAME}`,
          url: canonicalUrl('/contact'),
          about: { '@id': ORG_ID },
          mainEntity: { '@id': ORG_ID },
        }}
      />

      <SiteHero
        backgroundImage="/Picflow/DSC00048-copy.webp"
        imagePositionClassName="object-[center_10%] [filter:brightness(1.06)_contrast(1.03)]"
        eyebrow="Get in touch"
        title="We'd love to hear from you."
        subtitle="Plan a visit, request prayer, or send us a message — we'll get back to you quickly."
      />

      <Section tone="canvas">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
            {/* ── Contact rail ─────────────────────────────── */}
            <div data-gsap="reveal">
              <div className="lg:sticky lg:top-28">
                <SectionHeader
                  eyebrow="Reach us"
                  title="Every message reaches a real person."
                  description="Pick whichever way is easiest — we read all of them."
                  size="sm"
                />

                <ul className="mt-8 space-y-3">
                  {contactChannels.map(channel => {
                    const ChannelIcon = channel.icon;
                    const external = channel.href.startsWith('http');
                    return (
                      <li key={channel.label}>
                        <a
                          href={channel.href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noreferrer' : undefined}
                          className="group flex items-start gap-4 rounded-card border border-[var(--app-border)] bg-[var(--app-surface)] p-4 transition hover:border-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] hover:shadow-sm sm:p-5"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-[var(--app-primary-10)] text-[var(--app-primary-dark)]">
                            <ChannelIcon
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="font-ui text-eyebrow font-bold uppercase tracking-[0.16em] text-[var(--app-subtle)]">
                              {channel.label}
                            </span>
                            <span className="mt-1 block break-words font-ui text-body-md font-semibold text-[var(--app-ink)]">
                              {channel.value}
                            </span>
                            <span className="mt-0.5 block font-ui text-label text-[var(--app-muted)]">
                              {channel.detail}
                            </span>
                          </span>
                          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--app-subtle)] transition group-hover:text-[var(--app-primary)]" />
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 border-t border-[var(--app-border)] pt-6">
                  <Eyebrow>Follow the church</Eyebrow>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {socialLinks.map(s => {
                      const SocialIcon = s.icon;
                      return (
                        <a
                          key={s.platform}
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={s.platform}
                          className="flex h-10 w-10 items-center justify-center rounded-button border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-subtle)] transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary-dark)]"
                        >
                          <SocialIcon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Message form ─────────────────────────────── */}
            <div data-gsap="reveal">
              <Panel>
                <div className="border-b border-[var(--app-border)] px-6 py-6 sm:px-8 sm:py-7">
                  <SectionHeader
                    eyebrow="Message us"
                    title="Send us a message"
                    description="We respond within 24 hours on weekdays."
                    as="h3"
                    size="sm"
                  />
                </div>

                <form
                  id="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-5 p-6 sm:p-8"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
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
                    <label className="block">
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

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
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
                    <div className="block">
                      <span className={labelCls}>
                        Phone{' '}
                        <span className="font-normal normal-case tracking-normal text-[var(--app-muted)]">
                          (optional)
                        </span>
                      </span>
                      <PhoneNumberField
                        id="contact-phone"
                        country={phoneCountry}
                        number={formData.phone}
                        onCountryChange={setPhoneCountry}
                        onNumberChange={phone =>
                          setFormData(current => ({ ...current, phone }))
                        }
                        inputClassName={inputCls}
                        selectClassName={`${inputCls} cursor-pointer px-2`}
                        className="mt-2"
                        placeholder="706 999 5333"
                      />
                    </div>
                  </div>

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
                      <option value={PRAYER_TOPIC_VALUE}>Prayer request</option>
                      <option value="connect">
                        Connect &amp; get involved
                      </option>
                      <option value="events">Events &amp; programmes</option>
                      <option value="media">Media &amp; resources</option>
                      <option value="other">General enquiry</option>
                    </select>
                  </label>

                  <div className="block">
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
                        className={`${inputCls} mt-2 min-h-[140px] resize-none`}
                        placeholder={
                          isPrayerRequest
                            ? 'Share what you would like us to pray with you about...'
                            : 'Write your message here...'
                        }
                      />
                    </label>
                    {isPrayerRequest && (
                      <label className="mt-3 flex items-center gap-2.5 font-ui text-body-sm text-[var(--app-muted)]">
                        <input
                          type="checkbox"
                          checked={formData.isAnonymous}
                          onChange={e =>
                            setFormData(cur => ({
                              ...cur,
                              isAnonymous: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-[var(--app-border)] accent-[var(--app-primary)]"
                        />
                        Keep my request anonymous to the prayer team
                      </label>
                    )}
                  </div>

                  {submitted && (
                    <div
                      className="rounded-input border border-[var(--status-success)]/25 bg-[var(--status-success)]/10 px-4 py-3 font-ui text-body-sm text-[var(--status-success)]"
                      aria-live="polite"
                    >
                      {submittedPrayerRequest
                        ? 'Your prayer request has been received. Our pastoral team will be praying with you.'
                        : 'Message sent. Our team will be in touch within 24 hours.'}
                    </div>
                  )}

                  {error && (
                    <div
                      className="rounded-input border border-[var(--status-error)]/25 bg-[var(--status-error)]/10 px-4 py-3 font-ui text-body-sm text-[var(--status-error)]"
                      aria-live="polite"
                    >
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col gap-4 border-t border-[var(--app-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={buttonClass('dark')}
                    >
                      {submitting ? 'Sending...' : 'Send message'}
                      {!submitting && <Arrow />}
                    </button>
                    <p className={fieldHelpClass}>
                      For pastoral care, visit our{' '}
                      <Link
                        href="/pastoral"
                        className="text-[var(--app-primary-dark)] underline underline-offset-2"
                      >
                        Pastoral Care
                      </Link>{' '}
                      page.
                    </p>
                  </div>
                </form>
              </Panel>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Find us — map + getting here ────────────────────── */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
            <div data-gsap="reveal" className="flex flex-col">
              <SectionHeader
                eyebrow="Find us"
                title="Getting here."
                description="We gather at Honor Gardens on the Lekki-Epe Expressway, directly opposite Dominion City."
                size="sm"
              />
              <LocationMap
                query={MAP_QUERY}
                title="Map to Honor Gardens, Lekki-Epe Expressway"
                className="mt-6 flex-1"
              />
            </div>

            <div
              data-gsap="reveal"
              className="flex flex-col gap-6 rounded-card border border-[var(--app-border)] bg-[var(--app-canvas)] p-6 sm:p-8"
            >
              <div>
                <Eyebrow>Address</Eyebrow>
                <p className="mt-2 font-ui text-heading-sm font-semibold text-[var(--app-ink)]">
                  {SERVICE_INFO.venue.name}
                </p>
                <p className="mt-2 font-ui text-body-sm leading-[1.7] text-[var(--app-muted)]">
                  {SERVICE_INFO.venue.streetAddress}
                </p>
                <p className="font-ui text-body-sm leading-[1.7] text-[var(--app-muted)]">
                  {SERVICE_INFO.venue.locality}, Nigeria
                </p>
              </div>

              <div className="border-t border-[var(--app-border)] pt-6">
                <Eyebrow>When we gather</Eyebrow>
                <ul className="mt-3 space-y-2 font-ui text-body-sm text-[var(--app-muted)]">
                  <li className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold text-[var(--app-ink)]">
                      {SERVICE_INFO.sunday.day}
                    </span>
                    <span>
                      {SERVICE_INFO.sunday.time} {SERVICE_INFO.sunday.timezone}
                    </span>
                  </li>
                  <li className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold text-[var(--app-ink)]">
                      {SERVICE_INFO.dailyPrayer.label}
                    </span>
                    <span>
                      {SERVICE_INFO.dailyPrayer.daysShort} ·{' '}
                      {SERVICE_INFO.dailyPrayer.time}
                    </span>
                  </li>
                </ul>
              </div>

              <Actions className="mt-auto border-t border-[var(--app-border)] pt-6">
                <a
                  href={DIRECTIONS_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClass('primary')}
                >
                  Get directions <Arrow />
                </a>
                <CtaLink href="/events/weekly" variant="text">
                  Service details
                </CtaLink>
              </Actions>
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  );
}
