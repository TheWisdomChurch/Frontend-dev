'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Loader2,
  MessageCircleHeart,
  Quote,
  Sparkles,
  Users,
} from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import { ActionBanner } from '@/shared/components/site/PublicPageBlocks';
import apiClient from '@/lib/api';
import type { Testimonial as ApiTestimonial } from '@/lib/apiTypes';

type UiTestimony = {
  id: number | string;
  name: string;
  title: string;
  quote: string;
};

const TESTIMONIAL_FORM_BASE_URL =
  process.env.NEXT_PUBLIC_TESTIMONIAL_FORM_URL || '/forms/share-testimony';

const stats = [
  {
    label: 'Faith stories',
    value: 'Real journeys',
    detail: 'Stories of salvation, healing, hope, care, and transformation.',
    icon: Sparkles,
  },
  {
    label: 'Shared strength',
    value: 'Community impact',
    detail: 'Every story can encourage someone still trusting God.',
    icon: Users,
  },
  {
    label: 'Next step',
    value: 'Prayer & care',
    detail: 'Some stories open the door to prayer, support, and follow-up.',
    icon: HeartHandshake,
  },
];

const mapTestimony = (item: ApiTestimonial): UiTestimony => {
  const fullName =
    item.fullName ||
    [item.firstName, item.lastName].filter(Boolean).join(' ').trim() ||
    'Anonymous';

  return {
    id: item.id,
    name: fullName,
    title: item.isAnonymous ? 'Shared anonymously' : 'Wisdom House family',
    quote: item.testimony,
  };
};

function TestimonyPreview({
  testimony,
  active,
  onClick,
}: {
  testimony: UiTestimony;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-left transition duration-300 ${
        active
          ? 'border-[#d7bb75]/45 bg-[#d7bb75]/12'
          : 'border-white/10 bg-white/[0.045] hover:border-white/18 hover:bg-white/[0.07]'
      }`}
    >
      <p className="line-clamp-2 text-sm leading-6 text-white/72">
        {testimony.quote}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="truncate text-sm font-semibold text-white">
          {testimony.name}
        </span>
        <ArrowRight
          className={`h-4 w-4 shrink-0 transition ${
            active
              ? 'text-[#d7bb75]'
              : 'text-white/30 group-hover:translate-x-1 group-hover:text-white/70'
          }`}
        />
      </div>
    </button>
  );
}

export default function TestimoniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [testimonies, setTestimonies] = useState<UiTestimony[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState(TESTIMONIAL_FORM_BASE_URL);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const items = await apiClient.listApprovedTestimonials();

        if (mounted) {
          setTestimonies((Array.isArray(items) ? items : []).map(mapTestimony));
        }
      } catch {
        if (mounted) setTestimonies([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const returnTo = `${window.location.origin}/testimonies?testimonial_submitted=1`;
      const resolved = new URL(
        TESTIMONIAL_FORM_BASE_URL,
        window.location.origin
      );

      resolved.searchParams.set('return_to', returnTo);
      resolved.searchParams.set('return_delay_ms', '1800');
      setShareUrl(resolved.toString());
    } catch {
      setShareUrl(TESTIMONIAL_FORM_BASE_URL);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('testimonial_submitted') === '1') {
      setShowSuccessModal(true);
    }
  }, [searchParams]);

  const visibleTestimonies = useMemo(
    () => testimonies.slice(0, 12),
    [testimonies]
  );

  const activeTestimony = visibleTestimonies[activeIndex];

  const goNext = useCallback(() => {
    setActiveIndex(prev =>
      visibleTestimonies.length ? (prev + 1) % visibleTestimonies.length : 0
    );
  }, [visibleTestimonies.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev =>
      visibleTestimonies.length
        ? (prev - 1 + visibleTestimonies.length) % visibleTestimonies.length
        : 0
    );
  }, [visibleTestimonies.length]);

  useEffect(() => {
    if (visibleTestimonies.length <= 1) return;

    const timer = window.setInterval(goNext, 7000);
    return () => window.clearInterval(timer);
  }, [goNext, visibleTestimonies.length]);

  useEffect(() => {
    if (activeIndex >= visibleTestimonies.length) setActiveIndex(0);
  }, [activeIndex, visibleTestimonies.length]);

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    router.replace('/testimonies');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Stories of growth, healing, salvation, and real transformation."
        subtitle="Testimonies help the church remember that God is still working through worship, discipleship, care, and faithful obedience."
        note="Read stories from the Wisdom House family, then share what God has done in your own life."
        chips={['Faith', 'Healing', 'Family', 'Breakthroughs']}
      />

      <Section padding="none" className="relative overflow-hidden bg-[#050505]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(215,187,117,0.13),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.07),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(215,187,117,0.08),transparent_34%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
        </div>

        <Container size="xl" className="relative z-10 py-14 sm:py-18 lg:py-20">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(item => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d7bb75]/15 text-[#d7bb75]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="mt-5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/45">
                    {item.label}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/58">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section padding="none" className="relative bg-[#050505]">
        <Container size="xl" className="py-4 sm:py-6 lg:py-8">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d7bb75]/25 bg-[#d7bb75]/10 px-3 py-1.5 text-[#d7bb75]">
                  <MessageCircleHeart className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                    Testimony stories
                  </span>
                </div>

                <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Be encouraged by what God is doing in people’s lives.
                </h2>

                <p className="mt-4 max-w-lg text-[0.95rem] leading-7 text-white/62">
                  Browse recent stories from the Wisdom House family. Each story
                  is shared to strengthen faith, build gratitude, and remind
                  someone that God is still working.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d7bb75] px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:opacity-95"
                  >
                    Share your testimony
                    <ArrowRight className="h-4 w-4" />
                  </a>

                  <a
                    href="/events"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.09]"
                  >
                    Join a service
                  </a>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                {loading ? (
                  <div className="flex min-h-[420px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white/70">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading stories...
                    </div>
                  </div>
                ) : !activeTestimony ? (
                  <div className="flex min-h-[420px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20 px-6 text-center">
                    <div className="max-w-sm">
                      <CheckCircle2 className="mx-auto h-9 w-9 text-[#d7bb75]" />
                      <p className="mt-4 text-sm leading-6 text-white/62">
                        Stories will appear here soon. You can be the first to
                        share what God has done in your life.
                      </p>

                      <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#d7bb75] px-5 py-3 text-sm font-bold text-black"
                      >
                        Share your story
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <article className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/30 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.35)] sm:p-8">
                      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d7bb75]/10 blur-3xl" />

                      <div className="relative z-10">
                        <Quote className="h-10 w-10 text-[#d7bb75]" />

                        <p className="mt-7 text-xl leading-9 text-white/82 sm:text-2xl sm:leading-10">
                          “{activeTestimony.quote}”
                        </p>
                      </div>

                      <div className="relative z-10 mt-8 flex flex-col gap-5 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {activeTestimony.name}
                          </p>
                          <p className="mt-1 text-sm text-white/48">
                            {activeTestimony.title}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={goPrev}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white transition hover:bg-white/[0.1]"
                            aria-label="Previous testimony"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          <button
                            type="button"
                            onClick={goNext}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white transition hover:bg-white/[0.1]"
                            aria-label="Next testimony"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </article>

                    <aside className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[420px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
                      {visibleTestimonies.map((testimony, index) => (
                        <div
                          key={testimony.id}
                          className="min-w-[280px] lg:min-w-0"
                        >
                          <TestimonyPreview
                            testimony={testimony}
                            active={index === activeIndex}
                            onClick={() => setActiveIndex(index)}
                          />
                        </div>
                      ))}
                    </aside>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <ActionBanner
        eyebrow="Share your story"
        title="If God has done something meaningful in your life, your story may encourage someone else."
        description="Share your testimony and help the church celebrate God’s faithfulness with gratitude and wisdom."
        primaryHref={shareUrl}
        primaryLabel="Share a testimony"
        primaryTargetBlank
        secondaryHref="/events"
        secondaryLabel="Join a service"
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        title="Testimony submitted"
        message="Thank you. Your testimony has been received and will be reviewed before it appears publicly."
        actionLabel="Continue"
      />
    </div>
  );
}
