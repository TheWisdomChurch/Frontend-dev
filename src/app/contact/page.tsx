'use client';

import { useEffect, useState } from 'react';
import { Clock3, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { useNotification } from '@/shared/contexts/NotificationContext';
import { useAnalyticsTracking } from '@/shared/analytics/useTracking';
import { Container, Section } from '@/shared/layout';
import {
  ActionBanner,
  StatStrip,
} from '@/shared/components/site/PublicPageBlocks';

const stats = [
  {
    label: 'Location',
    value: 'Honor Gardens, Lagos',
    detail: 'Opposite Dominion City, Alasia, Lekki-Epe Expressway.',
    icon: MapPin,
  },
  {
    label: 'Phone',
    value: '0706 999 5333',
    detail: 'Reach the church team directly for guidance or scheduling help.',
    icon: Phone,
  },
  {
    label: 'Email',
    value: 'Wisdomhousehq@gmail.com',
    detail: 'Use email for enquiries, follow-up, or pastoral requests.',
    icon: Mail,
  },
  {
    label: 'Office rhythm',
    value: 'Weekday follow-up',
    detail: 'We aim to respond promptly and route requests to the right team.',
    icon: Clock3,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const { notify } = useNotification();
  const { trackFormStart, trackFormComplete, trackFormError } =
    useAnalyticsTracking();

  useEffect(() => {
    trackFormStart('contact_form');
  }, [trackFormStart]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      trackFormComplete('contact_form', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        messageLength: formData.message.length,
      });

      setSubmitStatus('success');
      notify(
        "Message sent successfully. We'll get back to you soon.",
        'success',
        6000
      );
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      trackFormError(
        'contact_form',
        (error as Error)?.message || 'Unknown error'
      );
      setSubmitStatus('error');
      notify('Failed to send message. Please try again.', 'error', 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Need directions, prayer, or a clear next step? Reach the church team here."
        subtitle="Use this page to plan a visit, ask a question, request support, or start a conversation with Wisdom Church."
        note="We want contact to feel simple. The goal is to help you reach the right person without confusion or delay."
        chips={[
          'Visit info',
          'Prayer requests',
          'General enquiries',
          'Pastoral care',
        ]}
      />

      <StatStrip items={stats} />

      <Section padding="lg" className="bg-[#050505]">
        <Container
          size="xl"
          className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="space-y-5 rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <div className="space-y-3">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
                Contact form
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Send a message and we will route it properly.
              </h2>
              <p className="text-base leading-relaxed text-white/68">
                Use the form for visit planning, ministry questions, pastoral
                support, or general enquiries.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
                <Field
                  label="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  type="email"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Optional"
                />
                <div className="grid gap-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-white/78"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d7bb75]"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="First visit">First visit</option>
                    <option value="Prayer request">Prayer request</option>
                    <option value="Pastoral care">Pastoral care</option>
                    <option value="Ministry enquiry">Ministry enquiry</option>
                    <option value="General enquiry">General enquiry</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-white/78"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help"
                  rows={6}
                  required
                  className="rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d7bb75]"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-white/58">
                  We treat enquiries with care and route support requests
                  responsibly.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-[#d7bb75] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </button>
              </div>

              {submitStatus !== 'idle' ? (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    borderColor:
                      submitStatus === 'success'
                        ? 'rgba(34,197,94,0.35)'
                        : 'rgba(239,68,68,0.35)',
                    backgroundColor:
                      submitStatus === 'success'
                        ? 'rgba(34,197,94,0.08)'
                        : 'rgba(239,68,68,0.08)',
                    color: submitStatus === 'success' ? '#86efac' : '#fca5a5',
                  }}
                >
                  {submitStatus === 'success'
                    ? 'Your message has been received. The team will follow up shortly.'
                    : 'There was a problem submitting the form. Please try again.'}
                </div>
              ) : null}
            </form>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'Visit information',
                description:
                  'Need directions, service times, or help planning your first Sunday? We can help you arrive prepared.',
                icon: MapPin,
              },
              {
                title: 'Prayer and pastoral care',
                description:
                  'If your request is spiritual, personal, or time-sensitive, our pastoral team can respond with care and discretion.',
                icon: ShieldCheck,
              },
              {
                title: 'Ministry and volunteering',
                description:
                  'If you want to join a ministry team or learn where you fit, this is the right starting point.',
                icon: Phone,
              },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <Icon className="h-5 w-5 text-[#d7bb75]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/66">
                    {item.description}
                  </p>
                </div>
              );
            })}

            <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(0,0,0,0.25))] p-6">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
                Direct contact
              </p>
              <div className="mt-5 grid gap-3 text-sm text-white/70">
                <a
                  href="tel:07069995333"
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:text-white"
                >
                  Phone: 0706 999 5333
                </a>
                <a
                  href="mailto:Wisdomhousehq@gmail.com"
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:text-white"
                >
                  Email: Wisdomhousehq@gmail.com
                </a>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  Address: Honor Gardens, opposite Dominion City, Alasia,
                  Lekki-Epe Expressway, Lagos
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <ActionBanner
        eyebrow="Need a first next step?"
        title="If you are trying to plan a visit, ask for prayer, or connect to a ministry, this page is the right entry point."
        description="The church team will help route you to the right person and make the process clear."
        primaryHref="/events"
        primaryLabel="See church rhythm"
        secondaryHref="/pastoral"
        secondaryLabel="View pastoral care"
      />
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium text-white/78">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d7bb75]"
      />
    </div>
  );
}
