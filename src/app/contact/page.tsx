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
import { Caption } from '@/shared/text';
import JsonLd from '@/shared/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/seo';
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
  EditorialContainer,
  EditorialHeader,
  EditorialLink,
  EditorialPanel,
  EditorialSection,
  editorialActionClass,
  editorialFieldClass,
  editorialLabelClass,
} from '@/shared/ui/editorial';

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

const inputCls = editorialFieldClass;
const labelCls = editorialLabelClass;

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
    <main className="min-h-screen">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />

      <SiteHero
        eyebrow="Get in touch"
        title="We'd love to hear from you."
        subtitle="Plan a visit, request prayer, or send us a message — we'll get back to you quickly."
        compact
      />

      <EditorialSection tone="canvas">
        <EditorialContainer>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20 xl:gap-24">
            <div data-gsap="reveal">
              <aside className="space-y-10 lg:sticky lg:top-28 lg:h-fit">
                {/* Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                    <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
                      Visit us
                    </p>
                  </div>
                  <p className="font-ui text-heading-sm font-semibold leading-snug text-[var(--app-ink)]">
                    {SERVICE_INFO.venue.name}
                  </p>
                  <div className="space-y-1 font-ui text-body-sm leading-[1.7] text-[var(--app-ink)]/70">
                    <p>{SERVICE_INFO.venue.streetAddress}</p>
                    <p>
                      {SERVICE_INFO.venue.locality},{' '}
                      {SERVICE_INFO.venue.country === 'NG'
                        ? 'Nigeria'
                        : SERVICE_INFO.venue.country}
                    </p>
                  </div>
                  <div className="pt-1 space-y-0.5">
                    <p className="font-ui text-label font-semibold text-[var(--app-ink)]/70">
                      {SERVICE_INFO.sunday.day}s · {SERVICE_INFO.sunday.time}
                    </p>
                    <p className="font-ui text-label font-semibold text-[var(--app-ink)]/70">
                      {SERVICE_INFO.dailyPrayer.label} ·{' '}
                      {SERVICE_INFO.dailyPrayer.time}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--app-ink)]/8" />

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                    <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
                      Call us
                    </p>
                  </div>
                  <a
                    href="https://wa.me/2347069995333"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-ui text-heading-sm font-semibold text-[var(--app-ink)] transition hover:text-[var(--app-primary-dark)]"
                  >
                    +234 706 999 5333
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition group-hover:opacity-100" />
                  </a>
                  <p className="font-ui text-label text-[var(--app-ink)]/45">
                    Open on WhatsApp
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--app-ink)]/8" />

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                    <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
                      Email us
                    </p>
                  </div>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="group inline-flex items-center gap-2 font-ui text-body-md font-medium text-[var(--app-ink)] transition hover:text-[var(--app-primary)]"
                  >
                    {CONTACT_INFO.email}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition group-hover:opacity-100" />
                  </a>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--app-ink)]/8" />

                {/* Social */}
                <div className="space-y-4">
                  <p className="font-ui text-eyebrow font-bold uppercase tracking-[0.2em] text-[var(--app-ink)]/60">
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
                          <span className="font-ui text-body-sm font-semibold text-[var(--app-ink)]">
                            {s.platform}
                          </span>
                          <span className="font-ui text-label text-[var(--app-ink)]/60">
                            {s.handle}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            <div data-gsap="reveal">
              <EditorialPanel>
                <div className="bg-[var(--app-dark)] px-7 py-7 sm:px-8 sm:py-8">
                  <EditorialHeader
                    eyebrow="Message us"
                    title="Send us a message."
                    description="We respond within 24 hours on weekdays."
                    tone="dark"
                    size="sm"
                  />
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
                    <div className="block px-7 py-5 sm:px-8">
                      <span className={labelCls}>
                        Phone{' '}
                        <span className="normal-case font-normal tracking-normal text-[var(--app-ink)]/60">
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
                      <label className="mt-3 flex items-center gap-2.5 font-ui text-body-sm text-[var(--app-ink)]/70">
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
                      className={editorialActionClass.dark}
                    >
                      {submitting ? 'Sending...' : 'Send message'}
                      {!submitting && <Arrow />}
                    </button>
                    <Caption className="text-[var(--app-ink)]/60">
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
                      className="border-t border-emerald-100 bg-emerald-50 px-7 py-4 font-ui text-body-sm text-emerald-700 sm:px-8"
                      aria-live="polite"
                    >
                      {submittedPrayerRequest
                        ? 'Your prayer request has been received. Our pastoral team will be praying with you.'
                        : 'Message sent. Our team will be in touch within 24 hours.'}
                    </div>
                  )}

                  {error && (
                    <div
                      className="border-t border-rose-100 bg-rose-50 px-7 py-4 font-ui text-body-sm text-rose-700 sm:px-8"
                      aria-live="polite"
                    >
                      {error}
                    </div>
                  )}
                </form>
              </EditorialPanel>
            </div>
          </div>
        </EditorialContainer>
      </EditorialSection>

      <EditorialSection compact tone="surface">
        <EditorialContainer>
          <div className="flex flex-col gap-1.5 py-7 sm:flex-row sm:items-center sm:justify-between sm:py-6">
            <p className="font-ui text-label font-semibold text-[var(--app-ink)]/60">
              {SERVICE_INFO.venue.full}
            </p>
            <EditorialLink href="/events/weekly" variant="dark">
              See service times
            </EditorialLink>
          </div>
        </EditorialContainer>
      </EditorialSection>
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
