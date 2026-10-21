'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import { ScrollFadeIn } from '@/shared/ui/motion';
import { buttonClass } from '@/shared/ui/button';

interface ClassItem {
  id: string;
  badge: string;
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  description: string;
  duration: string;
  schedule: string;
  curriculum: string[];
  features: string[];
  buttonText: string;
  tone: 'dark' | 'canvas';
  layout: 'normal' | 'inverse';
}

const GROWTH_CLASSES: ClassItem[] = [
  {
    id: 'new-convert',
    badge: 'Foundation Track · 01',
    eyebrow: 'First Steps of Faith',
    title: 'New Convert',
    accent: 'Class.',
    subtitle: 'Begin your journey by registering.',
    description:
      'Specially designed for newly saved believers and anyone making a fresh commitment to Jesus Christ. Learn the unshakeable fundamentals of salvation, the reality of the new birth, the authority of the believer, and how to build a daily personal walk in prayer and the Word.',
    duration: '4-Week Interactive Discipleship Track',
    schedule: 'Sundays · 8:00 AM (WAT) & Online Cohorts',
    curriculum: [
      'The New Birth, Grace & Justification',
      'Assurance of Salvation & The Holy Spirit',
      'The Power of Prayer & Scripture Study',
      'Water Baptism & Overcoming Temptation',
    ],
    features: [
      'Personal Discipleship Mentor',
      'Complimentary New Believer Study Bible',
      'Interactive Q&A Session Every Week',
      'Official Certificate of Completion',
    ],
    buttonText: 'Register for New Convert Class',
    tone: 'dark',
    layout: 'normal',
  },
  {
    id: 'believers-equipping',
    badge: 'Maturity Track · 02',
    eyebrow: 'Spiritual Dominion & Ministry',
    title: 'Believers Equipping',
    accent: 'Class.',
    subtitle: 'Deepening your walk in the Spirit and Truth.',
    description:
      'Move beyond foundational milk into solid spiritual meat. This intensive discipleship pathway is structured to ignite your spiritual authority, train you in kingdom stewardship, help you discern the voice of the Holy Spirit, and unlock your divine potential for lasting kingdom greatness.',
    duration: '6-Week Intensive Training Cohort',
    schedule: 'Wednesdays · 6:00 PM (WAT) & On-Demand Replay',
    curriculum: [
      'Hearing the Voice of God & Discerning Spirits',
      'The Gifts and Operations of the Holy Spirit',
      'Kingdom Stewardship, Prosperity & Faith',
      'Spiritual Warfare & Kingdom Authority',
    ],
    features: [
      'Deep Theological & Practical Study Modules',
      'Spiritual Gifts Assessment & Mentorship',
      'Hands-On Ministry Practice & Impartation',
      'Pastoral Equipping Graduation',
    ],
    buttonText: 'Register for Equipping Class',
    tone: 'canvas',
    layout: 'inverse',
  },
  {
    id: 'membership-foundational',
    badge: 'Covenant Family Track · 03',
    eyebrow: 'Church DNA & Covenant Community',
    title: 'Membership & Foundational',
    accent: 'Class.',
    subtitle: 'Discover our vision, values, and community.',
    description:
      'Step fully into the covenant family of The Wisdom Church. Understand our apostolic vision, the five core spiritual pillars, our leadership culture, and how to actively plug into church departments and cell fellowship centers to fulfill your purpose.',
    duration: '3-Week Comprehensive Induction',
    schedule: 'Saturdays · 10:00 AM (WAT) & In-Person Sanctuary',
    curriculum: [
      'Our Vision, Mission & 5 Core Pillars',
      'The Covenant of Fellowship & Mutual Care',
      'Servant Leadership Culture & Ministry Ethics',
      'Connecting to Cell Fellowships & Serving',
    ],
    features: [
      'Personal Welcome from Senior Pastoral Board',
      'Direct Placement into Active Ministry Teams',
      'Cell Fellowship Family Integration',
      'Formal Induction Ceremony on Sunday Service',
    ],
    buttonText: 'Join Membership Class',
    tone: 'dark',
    layout: 'normal',
  },
];

export function GrowthPortal() {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredSchedule: 'In-Person Sanctuary',
  });

  const handleOpenModal = (item: ClassItem) => {
    setSelectedClass(item);
    setSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      preferredSchedule: 'In-Person Sanctuary',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* ── 3 Core Discipleship Sections (Diagonal 2-Column Inverted Architecture) ── */}
      {GROWTH_CLASSES.map((item, index) => {
        const isDark = item.tone === 'dark';
        const isInverse = item.layout === 'inverse';

        return (
          <Section
            key={item.id}
            id={item.id}
            tone={item.tone}
            className={`relative overflow-hidden py-20 sm:py-28 lg:py-32 ${
              isDark
                ? 'bg-[radial-gradient(ellipse_75%_55%_at_50%_25%,color-mix(in_srgb,var(--app-primary)_12%,transparent)_0%,transparent_70%),var(--app-dark)] text-white'
                : 'bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,color-mix(in_srgb,var(--app-primary-10)_80%,transparent)_0%,transparent_65%),var(--app-canvas-2)] text-[var(--app-text)]'
            }`}
          >
            {/* Dynamic Angled Diagonal Accent Stripe in Background */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 -top-8 -bottom-8 -z-10 origin-center opacity-40 ${
                isInverse ? 'rotate-[-2.5deg]' : 'rotate-[2.5deg]'
              } ${
                isDark
                  ? 'bg-gradient-to-r from-transparent via-white/[0.03] to-transparent'
                  : 'bg-gradient-to-r from-transparent via-[var(--app-primary-10)]/40 to-transparent'
              }`}
            />

            <Container className="relative z-10">
              <div
                className={`grid items-center gap-12 lg:grid-cols-12 lg:gap-16 ${
                  isInverse ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* ── Visual / Graphic Column (Diagonal Structured Card) ────── */}
                <div
                  className={`lg:col-span-5 ${
                    isInverse ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <ScrollFadeIn delay={0.1}>
                    <div className="group relative">
                      {/* Decorative Diagonal Background Cut & Soft Ambient Glow */}
                      <div
                        className={`absolute -inset-2 rounded-3xl opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100 ${
                          isDark
                            ? 'bg-gradient-to-tr from-[var(--app-primary)]/20 via-[var(--app-primary-light)]/30 to-transparent'
                            : 'bg-gradient-to-tr from-[var(--app-primary-10)] via-[var(--app-primary)]/20 to-transparent'
                        }`}
                      />

                      {/* Main Card with Angular Cut Aesthetic */}
                      <div
                        className={`relative overflow-hidden rounded-3xl border p-8 sm:p-10 transition-all duration-500 group-hover:scale-[1.01] ${
                          isDark
                            ? 'border-white/15 bg-gradient-to-b from-[var(--app-dark-2)] via-[var(--app-dark)] to-black/90 shadow-2xl shadow-black/80'
                            : 'border-[var(--app-border)] bg-[var(--app-surface)] shadow-2xl shadow-black/5'
                        }`}
                      >
                        {/* Diagonal Accent Ribbon */}
                        <div
                          className={`absolute -right-12 -top-12 h-36 w-36 rotate-45 transform opacity-80 ${
                            isDark
                              ? 'bg-gradient-to-b from-[var(--app-primary-light)]/20 to-transparent'
                              : 'bg-gradient-to-b from-[var(--app-primary)]/15 to-transparent'
                          }`}
                        />

                        {/* Track Badge & Index Chip */}
                        <div className="flex items-center justify-between gap-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-ui text-caption font-bold uppercase tracking-wider ${
                              isDark
                                ? 'border border-white/15 bg-white/5 text-[var(--app-primary-light)]'
                                : 'border border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-text)]'
                            }`}
                          >
                            <Sparkles className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                            {item.badge}
                          </span>
                          <span
                            className={`font-headline text-heading-lg font-bold italic opacity-30 ${
                              isDark ? 'text-white' : 'text-[var(--app-ink)]'
                            }`}
                          >
                            0{index + 1}
                          </span>
                        </div>

                        {/* Curriculum Overview Box */}
                        <div className="mt-8 space-y-4">
                          <h2
                            className={`font-ui text-label font-bold uppercase tracking-widest ${
                              isDark
                                ? 'text-[var(--app-primary-light)]'
                                : 'text-[var(--app-primary-dark)]'
                            }`}
                          >
                            Core Curriculum Modules
                          </h2>
                          <div className="space-y-3">
                            {item.curriculum.map((mod, i) => (
                              <div
                                key={mod}
                                className={`flex items-start gap-3 rounded-2xl border p-3.5 transition-colors ${
                                  isDark
                                    ? 'border-white/10 bg-white/[0.03] text-white/90'
                                    : 'border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-text)]'
                                }`}
                              >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)]/20 font-ui text-caption font-bold text-[var(--app-primary)]">
                                  {i + 1}
                                </span>
                                <span className="font-ui text-body-sm font-medium leading-snug">
                                  {mod}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Format & Logistics Footer */}
                        <div
                          className={`mt-8 border-t pt-6 ${
                            isDark
                              ? 'border-white/10'
                              : 'border-[var(--app-border)]'
                          }`}
                        >
                          <div className="flex flex-col gap-2 font-ui text-caption font-medium">
                            <div className="flex items-center gap-2 text-[var(--app-muted)]">
                              <Clock className="h-4 w-4 shrink-0 text-[var(--app-primary)]" />
                              <span>{item.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--app-muted)]">
                              <Calendar className="h-4 w-4 shrink-0 text-[var(--app-primary)]" />
                              <span>{item.schedule}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollFadeIn>
                </div>

                {/* ── Content Column ─────────────────────────────────────────── */}
                <div
                  className={`lg:col-span-7 ${
                    isInverse ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <ScrollFadeIn delay={0.15}>
                    <div className="space-y-6">
                      <SectionHeader
                        eyebrow={item.eyebrow}
                        title={item.title}
                        accent={item.accent}
                        description={item.subtitle}
                        tone={isDark ? 'dark' : 'light'}
                        size="lg"
                      />

                      <p
                        className={`font-ui text-body leading-[1.8] sm:text-body-lg ${
                          isDark ? 'text-white/80' : 'text-[var(--app-muted)]'
                        }`}
                      >
                        {item.description}
                      </p>

                      {/* Benefits & Cohort Features List */}
                      <div className="grid gap-3 pt-2 sm:grid-cols-2">
                        {item.features.map(feat => (
                          <div
                            key={feat}
                            className="flex items-center gap-3 font-ui text-body-sm font-medium"
                          >
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--app-primary)]" />
                            <span
                              className={
                                isDark
                                  ? 'text-white/90'
                                  : 'text-[var(--app-text)]'
                              }
                            >
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action CTA Button */}
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(item)}
                          className={buttonClass(
                            isDark ? 'primary' : 'dark',
                            'lg',
                            'group cursor-pointer font-ui text-label uppercase tracking-wider shadow-lg'
                          )}
                        >
                          <span>{item.buttonText}</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </ScrollFadeIn>
                </div>
              </div>
            </Container>
          </Section>
        );
      })}

      {/* ── Registration Modal ────────────────────────────────────────────── */}
      {selectedClass && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            onClick={() => setSelectedClass(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[var(--app-dark-2)] p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="space-y-1">
                <span className="font-ui text-caption font-bold uppercase tracking-widest text-[var(--app-primary-light)]">
                  Registration Portal
                </span>
                <h3
                  id="register-dialog-title"
                  className="font-ui text-heading-md font-bold tracking-tight text-white"
                >
                  {selectedClass.title} {selectedClass.accent}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                aria-label="Close modal"
                className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--app-primary)]/20 text-[var(--app-primary)]">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h4 className="font-headline text-heading-md font-bold text-white">
                  Registration Received!
                </h4>
                <p className="font-ui text-body-sm text-white/80 max-w-sm mx-auto">
                  Thank you for registering for the{' '}
                  <span className="text-[var(--app-primary-light)] font-semibold">
                    {selectedClass.title} {selectedClass.accent}
                  </span>
                  . Our discipleship coordinator will contact you shortly with
                  your cohort syllabus and onboarding link.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedClass(null)}
                  className={buttonClass('primary', 'md', 'mt-4')}
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block font-ui text-caption font-bold uppercase tracking-wider text-white/80">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="e.g. John Adebayo"
                    className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-ui text-body-sm text-white placeholder:text-white/40 focus:border-[var(--app-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--app-primary)]"
                  />
                </div>

                <div>
                  <label className="block font-ui text-caption font-bold uppercase tracking-wider text-white/80">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-ui text-body-sm text-white placeholder:text-white/40 focus:border-[var(--app-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--app-primary)]"
                  />
                </div>

                <div>
                  <label className="block font-ui text-caption font-bold uppercase tracking-wider text-white/80">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+234 800 000 0000"
                    className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-ui text-body-sm text-white placeholder:text-white/40 focus:border-[var(--app-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--app-primary)]"
                  />
                </div>

                <div>
                  <label className="block font-ui text-caption font-bold uppercase tracking-wider text-white/80">
                    Preferred Attendance Mode
                  </label>
                  <select
                    value={formData.preferredSchedule}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        preferredSchedule: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-2xl border border-white/15 bg-[var(--app-dark)] px-4 py-3 font-ui text-body-sm text-white focus:border-[var(--app-primary)] focus:outline-none"
                  >
                    <option value="In-Person Sanctuary">
                      In-Person at Sanctuary (Honor Gardens)
                    </option>
                    <option value="Online Virtual Cohort">
                      Online Interactive Virtual Cohort
                    </option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={buttonClass(
                      'primary',
                      'lg',
                      'w-full justify-center font-ui text-label uppercase tracking-wider shadow-lg'
                    )}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Complete Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
