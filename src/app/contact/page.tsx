'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faYoutube,
  type IconDefinition,
} from '@fortawesome/free-brands-svg-icons';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import Button from '@/shared/utils/buttons/CustomButton';
import apiClient, { mapValidationErrors } from '@/lib/api';

type ContactMethod = {
  title: string;
  description: string;
  details: string[];
  icon: LucideIcon;
  href?: string;
  actionLabel?: string;
};

type SocialLink = {
  platform: string;
  handle: string;
  href: string;
  icon: IconDefinition;
};

type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const initialFormData: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  topic: '',
  message: '',
};

const inputClassName =
  'w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition duration-200 focus:border-[#f7de12]/70 focus:bg-black/45 focus:ring-4 focus:ring-[#f7de12]/10';

const labelClassName =
  'block text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white/55';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactMethods = useMemo<ContactMethod[]>(
    () => [
      {
        title: 'Visit Us',
        description: 'Come worship with us in person',
        details: [
          'Honors gardens, opposite Dominion Church Headquarters',
          'Alasia bus stop, Lekki Epe expressway',
          'Lagos, Nigeria',
          'Sunday Services: 9:00 AM',
        ],
        icon: MapPin,
      },
      {
        title: 'Call Us',
        description: 'Speak with our church office',
        details: ['Phone: +234 706 999 5333'],
        icon: Phone,
        href: 'https://wa.me/2347069995333',
        actionLabel: 'Open WhatsApp',
      },
      {
        title: 'Email Us',
        description: 'Send us a message anytime',
        details: ['wisdomhousehq@gmail.com'],
        icon: Mail,
        href: 'mailto:wisdomhousehq@gmail.com',
        actionLabel: 'Send email',
      },
    ],
    []
  );

  const socialLinks = useMemo<SocialLink[]>(
    () => [
      {
        platform: 'Instagram',
        handle: '@wisdomhousehq',
        href: 'https://instagram.com/wisdomhousehq',
        icon: faInstagram,
      },
      {
        platform: 'Facebook',
        handle: '@wisdomhousehq',
        href: 'https://facebook.com/wisdomhousehq',
        icon: faFacebook,
      },
      {
        platform: 'YouTube',
        handle: 'Wisdom House',
        href: 'https://youtube.com/@wisdomhousehq',
        icon: faYoutube,
      },
    ],
    []
  );

  const updateField =
    (field: keyof ContactFormData) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      setFormData(current => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setSubmitted(false);
    setError(null);

    try {
      await apiClient.submitContactMessage({
        ...formData,
        sourceChannel: 'frontend:web:contact-page',
      });

      setSubmitted(true);
      setFormData(initialFormData);
    } catch (err) {
      const fields = mapValidationErrors(err);

      if (fields) {
        const firstError = Object.values(fields)[0];
        setError(firstError || 'Please check your details and try again.');
      } else {
        setError('Unable to send your message right now. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you"
        note="Whether you’re new or part of the family, reach out and we’ll get back quickly."
        chips={['Visit', 'Call', 'Email', 'Connect']}
        compact
      />

      <Section padding="xl" className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(247,222,18,0.12),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.06),transparent_26%),linear-gradient(180deg,#050505_0%,#080808_50%,#050505_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(circle_at_50%_35%,black_25%,transparent_78%)]" />

        <Container size="xl" className="relative z-10">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              Visit • Call • Email
            </p>
            <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Plan your visit or send us a message.
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              Our team is available to help with service information, prayer
              requests, pastoral care, and general enquiries.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] xl:gap-8">
            <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
              <section className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/30 backdrop-blur-xl sm:rounded-[2rem]">
                <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f7de12]">
                    Reach us
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Visit & contact details
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Multiple ways to connect with leadership and teams.
                  </p>
                </div>

                <div className="divide-y divide-white/10">
                  {contactMethods.map(method => {
                    const Icon = method.icon;

                    const card = (
                      <div className="group flex gap-4 p-5 transition duration-200 hover:bg-white/[0.035] sm:p-6">
                        <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl border border-white/10 bg-[#f7de12]/10 text-[#f7de12]">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-semibold text-white">
                                {method.title}
                              </h3>
                              <p className="mt-1 text-sm leading-6 text-white/55">
                                {method.description}
                              </p>
                            </div>

                            {method.href ? (
                              <ArrowUpRight className="mt-1 h-4 w-4 flex-none text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f7de12]" />
                            ) : null}
                          </div>

                          <div className="mt-3 space-y-1">
                            {method.details.map(detail => (
                              <p
                                key={detail}
                                className="text-sm leading-6 text-white/72"
                              >
                                {detail}
                              </p>
                            ))}
                          </div>

                          {method.href ? (
                            <span className="mt-3 inline-flex text-sm font-bold text-[#f7de12]">
                              {method.actionLabel || 'Reach out'}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );

                    return method.href ? (
                      <a
                        key={method.title}
                        href={method.href}
                        target={
                          method.href.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          method.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        className="block"
                      >
                        {card}
                      </a>
                    ) : (
                      <div key={method.title}>{card}</div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 sm:rounded-[2rem] sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f7de12]">
                      Social
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-white">
                      Follow us
                    </h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {socialLinks.map(social => (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 transition duration-200 hover:border-[#f7de12]/40 hover:bg-white/[0.045]"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#f7de12]/10 text-[#f7de12]">
                          <FontAwesomeIcon
                            icon={social.icon}
                            className="h-4 w-4"
                          />
                        </span>

                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white">
                            {social.platform}
                          </span>
                          <span className="block truncate text-xs text-white/50">
                            {social.handle}
                          </span>
                        </span>
                      </span>

                      <ArrowUpRight className="h-4 w-4 flex-none text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f7de12]" />
                    </a>
                  ))}
                </div>
              </section>
            </aside>

            <section className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/35 backdrop-blur-xl sm:rounded-[2rem]">
              <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#f7de12]/10 blur-3xl" />

              <div className="relative border-b border-white/10 px-5 py-5 sm:px-6 lg:px-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f7de12]">
                  Message us
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  We respond within 24 hours on weekdays.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="relative space-y-5 px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className={labelClassName}>First name</span>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={updateField('firstName')}
                      required
                      autoComplete="given-name"
                      className={inputClassName}
                      placeholder="John"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className={labelClassName}>Last name</span>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={updateField('lastName')}
                      required
                      autoComplete="family-name"
                      className={inputClassName}
                      placeholder="Doe"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className={labelClassName}>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={updateField('email')}
                      required
                      autoComplete="email"
                      className={inputClassName}
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className={labelClassName}>Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={updateField('phone')}
                      autoComplete="tel"
                      className={inputClassName}
                      placeholder="+234 706 999 5333"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className={labelClassName}>Topic</span>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={updateField('topic')}
                    className={inputClassName}
                  >
                    <option value="">Select a topic</option>
                    <option value="visit">Plan a visit</option>
                    <option value="pastoral">Pastoral care</option>
                    <option value="prayer">Prayer request</option>
                    <option value="serve">Serving / volunteering</option>
                    <option value="events">Events / bookings</option>
                    <option value="media">Media / resources</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className={labelClassName}>Message</span>
                  <textarea
                    rows={6}
                    name="message"
                    value={formData.message}
                    onChange={updateField('message')}
                    required
                    className={`${inputClassName} min-h-[150px] resize-y`}
                    placeholder="Tell us how we can help..."
                  />
                </label>

                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                  <p className="text-sm leading-6 text-white/62">
                    We’ll respond by email and phone if provided. Please avoid
                    sending sensitive personal information through this form.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    curvature="xl"
                    disabled={submitting}
                    className="min-h-12 w-full px-7 text-sm font-extrabold text-black sm:w-auto"
                    style={{
                      backgroundColor: '#f7de12',
                      color: '#050505',
                    }}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>

                  <p className="text-xs leading-5 text-white/45">
                    Required fields are marked by the form validation.
                  </p>
                </div>

                {submitted ? (
                  <div
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
                    aria-live="polite"
                  >
                    Message queued successfully. Our team will respond within 24
                    hours.
                  </div>
                ) : null}

                {error ? (
                  <div
                    className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
                    aria-live="polite"
                  >
                    {error}
                  </div>
                ) : null}
              </form>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}
