'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  GraduationCap,
  HeartHandshake,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Container, Section, SectionHeader } from '@/shared/ui/layout';
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

interface PathwayDockItem {
  id: string;
  icon: typeof Compass;
  title: string;
  description: string;
  badge: string;
  targetId?: string;
  actionType: 'scroll' | 'register';
  classItem?: ClassItem;
}

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

  // Interactive slider controls for the floating pathway dock
  const dockScrollRef = useRef<HTMLDivElement>(null);
  const [activeDockIndex, setActiveDockIndex] = useState(0);

  const pathwayDockItems: PathwayDockItem[] = [
    {
      id: 'dock-new-convert',
      icon: Compass,
      title: 'New Convert Class',
      description: 'Foundations of salvation & the new birth',
      badge: '4 Weeks',
      targetId: 'new-convert',
      actionType: 'scroll',
    },
    {
      id: 'dock-equipping',
      icon: Sparkles,
      title: 'Believers Equipping',
      description: 'Spiritual authority & kingdom dominion',
      badge: '6 Weeks',
      targetId: 'believers-equipping',
      actionType: 'scroll',
    },
    {
      id: 'dock-membership',
      icon: Users,
      title: 'Membership Class',
      description: 'Covenant community & 5 church pillars',
      badge: '3 Weeks',
      targetId: 'membership-foundational',
      actionType: 'scroll',
    },
    {
      id: 'dock-mentorship',
      icon: HeartHandshake,
      title: 'Pastoral Mentorship',
      description: 'One-on-one personal spiritual guidance',
      badge: 'Continuous',
      actionType: 'register',
      classItem: GROWTH_CLASSES[1],
    },
    {
      id: 'dock-cohort',
      icon: GraduationCap,
      title: 'Cohort Registration',
      description: 'Secure your place in the upcoming intake',
      badge: 'Enrolling Now',
      actionType: 'register',
      classItem: GROWTH_CLASSES[0],
    },
  ];

  const scrollDock = (direction: 'left' | 'right') => {
    const container = dockScrollRef.current;
    if (!container) return;
    const cardEl = container.querySelector<HTMLElement>('[data-dock-card]');
    const step = cardEl ? cardEl.offsetWidth + 16 : 300;
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - step
        : container.scrollLeft + step;

    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  const handleDockScroll = () => {
    const container = dockScrollRef.current;
    if (!container) return;
    const cardEl = container.querySelector<HTMLElement>('[data-dock-card]');
    const step = cardEl ? cardEl.offsetWidth + 16 : 300;
    const currentIndex = Math.round(container.scrollLeft / step);
    setActiveDockIndex(
      Math.min(Math.max(currentIndex, 0), pathwayDockItems.length - 1)
    );
  };

  const scrollToDockIndex = (index: number) => {
    const container = dockScrollRef.current;
    if (!container) return;
    const cardEl = container.querySelector<HTMLElement>('[data-dock-card]');
    const step = cardEl ? cardEl.offsetWidth + 16 : 300;
    container.scrollTo({ left: index * step, behavior: 'smooth' });
    setActiveDockIndex(index);
  };

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

  const handleDockClick = (item: PathwayDockItem) => {
    if (item.actionType === 'scroll' && item.targetId) {
      const el = document.getElementById(item.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    if (item.classItem) {
      handleOpenModal(item.classItem);
    } else {
      handleOpenModal(GROWTH_CLASSES[0]);
    }
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
      <section
        aria-label="Growth Pathways Quick Access"
        className="relative z-20 -mt-10 sm:-mt-14 pb-8 sm:pb-12"
      >
        <Container>
          <div className="relative rounded-3xl border border-white/10 bg-[var(--app-dark-2)]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            {/* Ambient gold glow behind dock */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--app-primary)_20%,transparent)_0%,transparent_70%)]"
            />

            {/* Slider Top Bar: Header label + navigation arrow controls */}
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-[var(--app-primary)]" />
                <span className="font-ui text-caption font-bold uppercase tracking-wider text-[var(--app-primary-light)]">
                  Growth Pathways Track · Step {activeDockIndex + 1} of{' '}
                  {pathwayDockItems.length}
                </span>
              </div>

              {/* Slider Left / Right Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollDock('left')}
                  disabled={activeDockIndex === 0}
                  aria-label="Scroll to previous pathway"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:border-[var(--app-primary)]/50 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollDock('right')}
                  disabled={activeDockIndex === pathwayDockItems.length - 1}
                  aria-label="Scroll to next pathway"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:border-[var(--app-primary)]/50 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable / Slidable Track (Initial card visible, others smoothly slid in on scroll) */}
            <div
              ref={dockScrollRef}
              onScroll={handleDockScroll}
              className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
            >
              {pathwayDockItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeDockIndex === idx;

                return (
                  <button
                    key={item.id}
                    data-dock-card
                    type="button"
                    onClick={() => {
                      scrollToDockIndex(idx);
                      handleDockClick(item);
                    }}
                    className={`group relative flex w-[85vw] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-300 sm:w-[320px] lg:w-[310px] ${
                      isActive
                        ? 'border-[var(--app-primary)] bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-xl shadow-black/70'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* Top Row: Icon badge + top-right arrow */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                          isActive
                            ? 'border-[var(--app-primary)]/60 bg-[var(--app-primary)]/20 text-[var(--app-primary-light)]'
                            : 'border-white/15 bg-[var(--app-dark)] text-[var(--app-primary-light)] group-hover:border-[var(--app-primary)]/40 group-hover:bg-[var(--app-primary)]/15'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                          isActive
                            ? 'text-[var(--app-primary-light)]'
                            : 'text-white/40 group-hover:text-[var(--app-primary-light)]'
                        }`}
                      >
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="mt-4 space-y-1">
                      <h2
                        className={`font-ui text-body-sm font-bold tracking-tight transition-colors ${
                          isActive
                            ? 'text-[var(--app-primary-light)]'
                            : 'text-white group-hover:text-[var(--app-primary-light)]'
                        }`}
                      >
                        {item.title}
                      </h2>
                      <p className="font-ui text-caption text-white/70 leading-snug line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom: Pill indicator */}
                    <div className="mt-4 border-t border-white/5 pt-2.5 flex items-center justify-between">
                      <span className="font-ui text-[11px] font-semibold uppercase tracking-wider text-[var(--app-primary-light)]">
                        {item.badge}
                      </span>
                      <span className="font-ui text-[11px] text-white/40">
                        0{idx + 1}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Slider Bottom Pagination Dots */}
            <div className="mt-3 flex items-center justify-center gap-2 pt-1 border-t border-white/5">
              {pathwayDockItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToDockIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${item.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeDockIndex === idx
                      ? 'w-7 bg-[var(--app-primary)]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. The 3 Core Discipleship Classes (Scroll-Triggered Slide-in Effect) ── */}
      {GROWTH_CLASSES.map((item, index) => {
        const isInverse = item.layout === 'inverse';

        return (
          <Section
            key={item.id}
            id={item.id}
            tone="dark"
            className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-32 bg-[var(--app-dark)] text-white"
          >
            {/* Thematic Background Image Layer (No face portraits, purely architectural / thematic) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-20 overflow-hidden opacity-25"
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
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_55%_at_50%_25%,color-mix(in_srgb,var(--app-primary)_15%,transparent)_0%,transparent_70%),linear-gradient(to_bottom,var(--app-dark)_0%,color-mix(in_srgb,var(--app-dark)_85%,transparent)_40%,var(--app-dark)_100%)]"
            />

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
                      className="pointer-events-none absolute -inset-2 rounded-3xl bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,color-mix(in_srgb,var(--app-primary)_35%,transparent)_0%,transparent_70%)] opacity-70 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                    />

                    {/* Main Card with Deep Obsidian Shell & Modern Border */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[var(--app-dark-2)] via-[var(--app-dark)] to-black/95 p-6 shadow-2xl shadow-black/80 sm:p-8 lg:p-9 transition-transform duration-500 group-hover:scale-[1.01]">
                      {/* Diagonal Accent Slices */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rotate-45 transform bg-gradient-to-b from-[var(--app-primary-light)]/20 to-transparent"
                      />

                      {/* Card Header & Badge */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-ui text-caption font-bold uppercase tracking-wider text-[var(--app-primary-light)] backdrop-blur-sm">
                          <Sparkles className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                          {item.badge}
                        </span>
                        <span className="font-headline text-heading-lg font-bold italic text-white/30">
                          0{index + 1}
                        </span>
                      </div>

                      {/* Curriculum List */}
                      <div className="mt-7 space-y-3.5">
                        <h2 className="font-ui text-caption font-bold uppercase tracking-widest text-[var(--app-primary-light)]">
                          Core Curriculum Modules
                        </h2>
                        <div className="space-y-2.5">
                          {item.curriculum.map((mod, i) => (
                            <div
                              key={mod}
                              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-3.5 transition-colors hover:border-[var(--app-primary)]/30 hover:bg-white/[0.06]"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)]/25 font-ui text-caption font-bold text-[var(--app-primary-light)]">
                                {i + 1}
                              </span>
                              <span className="font-ui text-body-sm font-medium leading-snug text-white/95">
                                {mod}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Format & Logistics Footer */}
                      <div className="mt-7 border-t border-white/10 pt-5">
                        <div className="flex flex-col gap-2 font-ui text-caption font-medium text-white/70">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 shrink-0 text-[var(--app-primary-light)]" />
                            <span>{item.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 shrink-0 text-[var(--app-primary-light)]" />
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
                      tone="dark"
                      size="lg"
                    />

                    <p className="font-ui text-body leading-[1.8] text-white/85 sm:text-body-lg">
                      {item.description}
                    </p>

                    {/* Benefits & Cohort Features List */}
                    <div className="grid gap-3 pt-2 sm:grid-cols-2">
                      {item.features.map(feat => (
                        <div
                          key={feat}
                          className="flex items-center gap-3 font-ui text-body-sm font-medium text-white/90"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--app-primary-light)]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action CTA Button (Solid Radiant Luminous Gold Pill with Dark Text) */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--app-primary-dark)] via-[var(--app-primary)] to-[var(--app-primary-light)] px-7 py-3.5 font-ui text-xs font-bold uppercase tracking-wider text-[var(--app-dark)] shadow-[0_4px_20px_color-mix(in_srgb,var(--app-primary)_40%,transparent)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--app-primary)_70%,transparent)] hover:brightness-105 active:scale-[0.98]"
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
