'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
import SectionFlowDock, {
  type FlowDockItem,
} from '@/shared/components/SectionFlowDock';
import {
  WhatWeDo_3, // teaching.svg (Word & Doctrine)
  WhatWedo_4, // prayer_gathering.svg (Prayer & Spiritual Equipping)
  WhatWedo_1, // Worship_service.svg (Sanctuary & Covenant Community)
} from '@/shared/assets';

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
  thematicImage: typeof WhatWeDo_3;
  thematicAlt: string;
  curriculum: string[];
  features: string[];
  buttonText: string;
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
    thematicImage: WhatWeDo_3,
    thematicAlt: 'Thematic teaching and scripture study illustration',
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
    thematicImage: WhatWedo_4,
    thematicAlt: 'Thematic prayer gathering and spiritual warfare illustration',
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
    thematicImage: WhatWedo_1,
    thematicAlt: 'Thematic covenant sanctuary worship illustration',
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
    layout: 'normal',
  },
];

const GROWTH_FLOW_DOCK_ITEMS: readonly FlowDockItem[] = [
  {
    id: 'dock-new-convert',
    icon: 'compass',
    title: 'New Convert Class',
    description: 'Foundations of salvation & the new birth',
    badge: '4 Weeks',
    targetId: 'new-convert',
  },
  {
    id: 'dock-equipping',
    icon: 'sparkles',
    title: 'Believers Equipping',
    description: 'Spiritual authority & kingdom dominion',
    badge: '6 Weeks',
    targetId: 'believers-equipping',
  },
  {
    id: 'dock-membership',
    icon: 'users',
    title: 'Membership Class',
    description: 'Covenant community & 5 church pillars',
    badge: '3 Weeks',
    targetId: 'membership-foundational',
  },
  {
    id: 'dock-mentorship',
    icon: 'heart-handshake',
    title: 'Pastoral Mentorship',
    description: 'One-on-one personal spiritual guidance',
    badge: 'Continuous',
    targetId: 'believers-equipping',
  },
  {
    id: 'dock-cohort',
    icon: 'graduation-cap',
    title: 'Cohort Registration',
    description: 'Secure your place in the upcoming intake',
    badge: 'Enrolling Now',
    targetId: 'new-convert',
  },
];

export function GrowthPortal() {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredSchedule: 'In-Person Sanctuary (Honor Gardens)',
  });

  const handleOpenModal = (item: ClassItem) => {
    setSelectedClass(item);
    setSubmitted(false);
    setError(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      preferredSchedule: 'In-Person Sanctuary (Honor Gardens)',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const classLabel = selectedClass
      ? `${selectedClass.title} ${selectedClass.accent}`
      : 'General Growth Discipleship';

    const parts = formData.fullName.trim().split(/\s+/);
    const firstName = parts[0] || 'Friend';
    const lastName = parts.slice(1).join(' ') || '';

    try {
      // 1. Dispatch real registration to backend & admin portal inbox
      await apiClient.submitContactMessage({
        firstName,
        lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        topic: 'Growth Portal Class Registration',
        sourceChannel: 'frontend:web:growth-portal',
        metadata: {
          classTrack: classLabel,
          trackCode: selectedClass?.badge ?? 'N/A',
          attendanceMode: formData.preferredSchedule,
        },
        message: [
          `Training Portal Registration Details:`,
          `-------------------------------------`,
          `Applicant Name: ${formData.fullName.trim()}`,
          `Email Address: ${formData.email.trim()}`,
          `Phone / WhatsApp: ${formData.phone.trim()}`,
          `Class Track: ${classLabel}`,
          `Track Code: ${selectedClass?.badge ?? 'N/A'}`,
          `Preferred Attendance Mode: ${formData.preferredSchedule}`,
          `Submitted Via: frontend:web:growth-portal`,
        ].join('\n'),
      });

      // 2. Also forward to public forms engine if configured on admin portal
      apiClient
        .submitPublicForm('growth-portal', {
          values: {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            classTrack: classLabel,
            attendanceMode: formData.preferredSchedule,
          },
        })
        .catch(() => {
          // Graceful fallback if standalone CMS form slug is not yet created
        });

      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to complete registration. Please check your network and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── 1. Floating Feature Cards Dock with Interactive Scroll Slider ─────── */}
      <SectionFlowDock
        label="Growth Pathways Track"
        items={GROWTH_FLOW_DOCK_ITEMS}
      />

      {/* ── 2. The 3 Core Discipleship Classes (Balanced Editorial Rhythm matching Landing Page) ── */}
      {GROWTH_CLASSES.map((item, index) => {
        const isInverse = item.layout === 'inverse';
        const isDarkClass = index === 1; // Middle class (Believers Equipping) is deep obsidian; others are warm editorial canvas

        return (
          <Section
            key={item.id}
            id={item.id}
            tone={isDarkClass ? 'dark' : 'canvas'}
            className={
              isDarkClass
                ? 'scroll-mt-24 relative isolate overflow-hidden border-b border-white/10 py-20 sm:py-28 lg:py-32 bg-[radial-gradient(ellipse_75%_55%_at_50%_25%,color-mix(in_srgb,var(--app-primary)_14%,transparent)_0%,transparent_70%),var(--app-dark)] text-white'
                : 'scroll-mt-24 relative isolate overflow-hidden border-b border-[var(--app-border)] py-20 sm:py-28 lg:py-32 bg-[radial-gradient(ellipse_80%_60%_at_15%_40%,color-mix(in_srgb,var(--app-primary-10)_80%,transparent)_0%,transparent_65%),var(--app-canvas-2)] text-[var(--app-text)]'
            }
          >
            {/* Thematic Background Image Layer (No face portraits, purely architectural / thematic) */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 -z-20 overflow-hidden ${
                isDarkClass ? 'opacity-25' : 'opacity-15'
              }`}
            >
              <Image
                src={item.thematicImage}
                alt={item.thematicAlt}
                fill
                sizes="100vw"
                className={`h-full w-full object-cover object-center ${
                  isInverse ? 'scale-x-[-1]' : ''
                }`}
              />
            </div>

            {/* Cinematic Gradient Overlays for 100% High Definition Contrast */}
            {isDarkClass ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_55%_at_50%_25%,color-mix(in_srgb,var(--app-primary)_15%,transparent)_0%,transparent_70%),linear-gradient(to_bottom,var(--app-dark)_0%,color-mix(in_srgb,var(--app-dark)_85%,transparent)_40%,var(--app-dark)_100%)]"
              />
            ) : null}

            <Container className="relative z-10">
              <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-16">
                {/* ── Column A: Diagonal Structured Curriculum Card (Slides in from Left/Right) ── */}
                <motion.div
                  initial={{ opacity: 0, x: isInverse ? 70 : -70, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.85, ease: [0.19, 1, 0.22, 1] }}
                  className={`lg:col-span-5 ${
                    isInverse ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="group relative">
                    {/* Ambient Aura */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute -inset-2 rounded-3xl blur-xl transition-opacity duration-500 group-hover:opacity-100 ${
                        isDarkClass
                          ? 'bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,color-mix(in_srgb,var(--app-primary)_35%,transparent)_0%,transparent_70%)] opacity-70'
                          : 'bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,color-mix(in_srgb,var(--app-primary-10)_50%,transparent)_0%,transparent_70%)] opacity-50'
                      }`}
                    />

                    {/* Main Card Shell */}
                    <div
                      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-9 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01] ${
                        isDarkClass
                          ? 'border border-white/15 bg-gradient-to-b from-[var(--app-dark-2)] via-[var(--app-dark)] to-black/95 text-white shadow-black/80'
                          : 'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] shadow-black/10'
                      }`}
                    >
                      {/* Diagonal Accent Slices */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rotate-45 transform bg-gradient-to-b from-[var(--app-primary)]/20 to-transparent"
                      />

                      {/* Card Header & Badge */}
                      <div className="flex items-center justify-between gap-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-ui text-caption font-bold uppercase tracking-wider backdrop-blur-sm ${
                            isDarkClass
                              ? 'border-white/15 bg-white/5 text-[var(--app-primary-light)]'
                              : 'border-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] text-[var(--app-primary-dark)]'
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                          {item.badge}
                        </span>
                      </div>

                      {/* Curriculum List */}
                      <div className="mt-7 space-y-3.5">
                        <h2
                          className={`font-ui text-caption font-bold uppercase tracking-widest ${
                            isDarkClass
                              ? 'text-[var(--app-primary-light)]'
                              : 'text-[var(--app-primary-dark)]'
                          }`}
                        >
                          Core Curriculum Modules
                        </h2>
                        <div className="space-y-2.5">
                          {item.curriculum.map((mod, i) => (
                            <div
                              key={mod}
                              className={`flex items-start gap-3 rounded-2xl border p-3 sm:p-3.5 transition-colors ${
                                isDarkClass
                                  ? 'border-white/10 bg-white/[0.04] text-white/95 hover:border-[var(--app-primary)]/30 hover:bg-white/[0.06]'
                                  : 'border-[var(--app-border)] bg-[var(--app-canvas)] text-[var(--app-text)] hover:border-[var(--app-primary)]/40 hover:bg-[var(--app-surface)]'
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-ui text-caption font-bold ${
                                  isDarkClass
                                    ? 'bg-[var(--app-primary)]/25 text-[var(--app-primary-light)]'
                                    : 'bg-[color-mix(in_srgb,var(--app-primary)_18%,transparent)] text-[var(--app-primary-dark)]'
                                }`}
                              >
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
                        className={`mt-7 border-t pt-5 ${
                          isDarkClass
                            ? 'border-white/10'
                            : 'border-[var(--app-border)]'
                        }`}
                      >
                        <div
                          className={`flex flex-col gap-2 font-ui text-caption font-medium ${
                            isDarkClass
                              ? 'text-white/85'
                              : 'text-[var(--app-muted)]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock
                              className={`h-4 w-4 shrink-0 ${
                                isDarkClass
                                  ? 'text-[var(--app-primary-light)]'
                                  : 'text-[var(--app-primary-dark)]'
                              }`}
                            />
                            <span>{item.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar
                              className={`h-4 w-4 shrink-0 ${
                                isDarkClass
                                  ? 'text-[var(--app-primary-light)]'
                                  : 'text-[var(--app-primary-dark)]'
                              }`}
                            />
                            <span>{item.schedule}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── Column B: Editorial Content & Action Button (Slides in from Opposite Side) ── */}
                <motion.div
                  initial={{ opacity: 0, x: isInverse ? -70 : 70, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.12,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className={`lg:col-span-7 ${
                    isInverse ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="space-y-6">
                    <SectionHeader
                      eyebrow={item.eyebrow}
                      title={item.title}
                      accent={item.accent}
                      description={item.subtitle}
                      tone={isDarkClass ? 'dark' : undefined}
                      size="lg"
                    />

                    <p
                      className={`font-ui text-body leading-[1.8] sm:text-body-lg ${
                        isDarkClass
                          ? 'text-white/85'
                          : 'text-[var(--app-muted)]'
                      }`}
                    >
                      {item.description}
                    </p>

                    {/* Benefits & Cohort Features List */}
                    <div className="grid gap-3 pt-2 sm:grid-cols-2">
                      {item.features.map(feat => (
                        <div
                          key={feat}
                          className={`flex items-center gap-3 font-ui text-body-sm font-medium ${
                            isDarkClass
                              ? 'text-white/95'
                              : 'text-[var(--app-text)]'
                          }`}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${
                              isDarkClass
                                ? 'text-[var(--app-primary-light)]'
                                : 'text-[var(--app-primary-dark)]'
                            }`}
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action CTA Button */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        className={
                          isDarkClass
                            ? 'group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--app-primary-dark)] via-[var(--app-primary)] to-[var(--app-primary-light)] px-7 py-3.5 font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-dark)] shadow-[0_4px_20px_color-mix(in_srgb,var(--app-primary)_40%,transparent)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--app-primary)_70%,transparent)] hover:brightness-105 active:scale-[0.98]'
                            : 'group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[var(--app-dark)] px-7 py-3.5 font-ui text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[var(--app-primary-dark)] hover:text-white transition-all duration-300 active:scale-[0.98]'
                        }
                      >
                        <span>{item.buttonText}</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Container>
          </Section>
        );
      })}

      {/* ── 3. Real Backend-Connected Registration Modal ───────────────────── */}
      {selectedClass && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Backdrop */}
          <div
            onClick={() => !loading && setSelectedClass(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-lg my-8 overflow-hidden rounded-3xl border border-white/20 bg-[var(--app-dark-2)] p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="space-y-1">
                <span className="font-ui text-caption font-bold uppercase tracking-widest text-[var(--app-primary-light)]">
                  Wisdom Church Training Portal
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
                disabled={loading}
                onClick={() => setSelectedClass(null)}
                aria-label="Close modal"
                className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
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
                <p className="font-ui text-body-sm text-white/80 max-w-sm mx-auto leading-relaxed">
                  Thank you,{' '}
                  <span className="font-bold text-white">
                    {formData.fullName}
                  </span>
                  ! Your registration for the{' '}
                  <span className="text-[var(--app-primary-light)] font-semibold">
                    {selectedClass.title} {selectedClass.accent}
                  </span>{' '}
                  has been routed directly to church leadership. Our
                  discipleship coordinator will contact you at{' '}
                  <span className="font-semibold text-white">
                    {formData.email}
                  </span>{' '}
                  with your syllabus and onboarding details.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedClass(null)}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--app-primary-dark)] via-[var(--app-primary)] to-[var(--app-primary-light)] px-7 py-3 font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-dark)] shadow-lg hover:brightness-105"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-2xl border border-[var(--status-error)]/30 bg-[var(--status-error)]/10 p-3.5 text-white"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 text-[var(--status-error)] mt-0.5" />
                    <span className="font-ui text-caption leading-snug">
                      {error}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block font-ui text-caption font-bold uppercase tracking-wider text-white/80">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={formData.fullName}
                    onChange={e =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="e.g. Bro. David Adebayo"
                    className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-ui text-body-sm text-white placeholder:text-white/40 focus:border-[var(--app-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--app-primary)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-ui text-caption font-bold uppercase tracking-wider text-white/80">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="david@example.com"
                    className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-ui text-body-sm text-white placeholder:text-white/40 focus:border-[var(--app-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--app-primary)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-ui text-caption font-bold uppercase tracking-wider text-white/80">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    disabled={loading}
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+234 800 000 0000"
                    className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-ui text-body-sm text-white placeholder:text-white/40 focus:border-[var(--app-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--app-primary)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-ui text-caption font-bold uppercase tracking-wider text-white/80">
                    Preferred Attendance Mode
                  </label>
                  <select
                    disabled={loading}
                    value={formData.preferredSchedule}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        preferredSchedule: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-2xl border border-white/15 bg-[var(--app-dark)] px-4 py-3 font-ui text-body-sm text-white focus:border-[var(--app-primary)] focus:outline-none disabled:opacity-50"
                  >
                    <option value="In-Person Sanctuary (Honor Gardens)">
                      In-Person Sanctuary (Honor Gardens, Lekki-Epe)
                    </option>
                    <option value="Online Interactive Virtual Cohort">
                      Online Interactive Virtual Cohort (Zoom / Stream)
                    </option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--app-primary-dark)] via-[var(--app-primary)] to-[var(--app-primary-light)] px-7 py-3.5 font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-dark)] shadow-[0_4px_20px_color-mix(in_srgb,var(--app-primary)_40%,transparent)] transition-all duration-300 hover:brightness-105 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[var(--app-dark)]" />
                        <span>Sending to Admin Portal...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Registration</span>
                      </>
                    )}
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
