'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Quote,
} from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import { Button } from '@/shared/utils/buttons';
import { H2, BodyLG, BodyMD, BodySM, SmallText } from '@/shared/text';
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

const mapTestimony = (item: ApiTestimonial): UiTestimony => {
  const fullName =
    item.fullName ||
    [item.firstName, item.lastName].filter(Boolean).join(' ').trim() ||
    'Anonymous';

  return {
    id: item.id,
    name: fullName,
    title: item.isAnonymous ? 'Shared anonymously' : 'Wisdom Church community',
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
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 !justify-start text-left transition duration-300 ${
        active
          ? 'border-[var(--app-primary)]/45 bg-[var(--app-primary)]/12'
          : 'border-white/10 bg-white/[0.045] hover:border-white/18 hover:bg-white/[0.07]'
      }`}
    >
      <BodySM className="line-clamp-2 text-white/72">{testimony.quote}</BodySM>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="truncate text-sm font-semibold text-white">
          {testimony.name}
        </span>
        <ArrowRight
          className={`h-4 w-4 shrink-0 transition ${
            active
              ? 'text-[var(--app-primary)]'
              : 'text-white/30 group-hover:translate-x-1 group-hover:text-white/70'
          }`}
        />
      </div>
    </Button>
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

    const timer = window.setInterval(goNext, 12000);
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
    <div className="min-h-screen bg-[var(--app-dark)] text-white">
      <PageHero
        title="Stories of growth, healing, salvation, and real transformation."
        subtitle="Testimonies help the church remember that God is still working through worship, discipleship, care, and faithful obedience."
        note="Read stories from the Wisdom Church community, then share what God has done in your own life."
        chips={['Faith', 'Healing', 'Family', 'Breakthroughs']}
      />

      <Section padding="none" className="bg-[var(--app-dark)]">
        <Container size="xl" className="py-14 sm:py-16 lg:py-20">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-label font-bold uppercase tracking-[0.2em] text-[var(--app-primary)]">
                Testimony stories
              </p>
              <H2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                What God is doing in people&apos;s lives.
              </H2>
            </div>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[var(--app-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--app-primary)] transition hover:bg-[var(--app-primary)] hover:text-black"
            >
              Share your story
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div>
            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center border border-white/10">
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading stories...
                </div>
              </div>
            ) : !activeTestimony ? (
              <div className="flex min-h-[360px] items-center justify-center border border-white/10 px-6 text-center">
                <div className="max-w-sm">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--app-primary)]" />
                  <SmallText className="mt-4 leading-6 text-white/60">
                    Be the first to share what God has done in your life.
                  </SmallText>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 bg-[var(--app-primary)] px-5 py-2.5 text-sm font-semibold text-black"
                  >
                    Share your story
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <article className="flex min-h-[360px] flex-col justify-between border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <div>
                    <Quote className="h-8 w-8 text-[var(--app-primary)]" />
                    <BodyLG className="mt-6 line-clamp-4 text-white/80">
                      &ldquo;{activeTestimony.quote}&rdquo;
                    </BodyLG>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <BodyMD className="font-semibold text-white">
                        {activeTestimony.name}
                      </BodyMD>
                      <SmallText className="mt-1 text-white/45">
                        {activeTestimony.title}
                      </SmallText>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={goPrev}
                        aria-label="Previous testimony"
                        className="h-9 w-9 border border-white/12 text-white/60 hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={goNext}
                        aria-label="Next testimony"
                        className="h-9 w-9 border border-white/12 text-white/60 hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>

                <aside className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[360px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
                  {visibleTestimonies.map((testimony, index) => (
                    <div
                      key={testimony.id}
                      className="min-w-[240px] lg:min-w-0"
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
