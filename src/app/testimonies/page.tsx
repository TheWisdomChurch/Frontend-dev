'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeartHandshake, Sparkles, Users } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';
import { SuccessModal } from '@/shared/ui/modals/SuccessModal';
import {
  ActionBanner,
  StatStrip,
} from '@/shared/components/site/PublicPageBlocks';
import apiClient from '@/lib/api';
import type { Testimonial as ApiTestimonial } from '@/lib/apiTypes';

type UiTestimony = {
  id: number | string;
  name: string;
  title: string;
  quote: string;
};

const mapTestimony = (item: ApiTestimonial): UiTestimony => {
  const fullName =
    item.fullName ||
    [item.firstName, item.lastName].filter(Boolean).join(' ').trim() ||
    'Anonymous';
  return {
    id: item.id,
    name: fullName,
    title: item.isAnonymous ? 'Anonymous member' : 'Church member',
    quote: item.testimony,
  };
};

const TESTIMONIAL_FORM_BASE_URL =
  process.env.NEXT_PUBLIC_TESTIMONIAL_FORM_URL || '/forms/share-testimony';

const stats = [
  {
    label: 'Story type',
    value: 'Real church journeys',
    detail:
      'These stories reflect discipleship, care, salvation, healing, and restored hope.',
    icon: Sparkles,
  },
  {
    label: 'Church impact',
    value: 'Faith formed in community',
    detail:
      'Many testimonies come from what happens after the altar moment, not only during it.',
    icon: Users,
  },
  {
    label: 'Care pathway',
    value: 'Prayer and follow-up',
    detail:
      'Personal stories often intersect with pastoral care, teaching, and steady support.',
    icon: HeartHandshake,
  },
  {
    label: 'Encouragement goal',
    value: 'Strengthen others',
    detail:
      'Testimonies remind the church that God is still working in ordinary and difficult seasons.',
    icon: Sparkles,
  },
];

export default function TestimoniesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [testimonies, setTestimonies] = useState<UiTestimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState(TESTIMONIAL_FORM_BASE_URL);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const items = await apiClient.listApprovedTestimonials();
        if (!mounted) return;
        setTestimonies((Array.isArray(items) ? items : []).map(mapTestimony));
      } catch {
        if (!mounted) return;
        setTestimonies([]);
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

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    router.replace('/testimonies');
  };

  const visibleTestimonies = useMemo(
    () => testimonies.slice(0, 24),
    [testimonies]
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Stories of growth, healing, salvation, and real transformation."
        subtitle="Testimonies help the church remember that God is still working through worship, discipleship, care, and faithful obedience."
        note="These stories are not here to decorate the website. They are here to strengthen faith, encourage perseverance, and make God’s faithfulness visible."
        chips={['Faith', 'Healing', 'Family', 'Breakthroughs']}
      />

      <StatStrip items={stats} />

      <Section padding="lg" className="bg-[#050505]">
        <Container size="xl" className="space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
                Testimony stories
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Approved testimonies from the community.
              </h2>
            </div>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#d7bb75] px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Share your testimony
            </a>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white/70">
              Loading approved testimonies...
            </div>
          ) : visibleTestimonies.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white/70">
              No approved testimonies yet.
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
              {visibleTestimonies.map(testimony => (
                <article
                  key={testimony.id}
                  className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(0,0,0,0.22))] p-5 sm:p-6"
                >
                  <p className="text-4xl leading-none text-[#d7bb75]">“</p>
                  <p className="mt-4 text-base leading-relaxed text-white/72">
                    {testimony.quote}
                  </p>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="text-base font-semibold text-white">
                      {testimony.name}
                    </p>
                    <p className="mt-1 text-sm text-white/58">
                      {testimony.title}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <ActionBanner
        eyebrow="Share your story"
        title="If God has done something meaningful in your life through this church season, we would love to hear it."
        description="Testimonies encourage people who are still praying, still waiting, and still trying to trust God well."
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
        message="Thank you. Your testimony has been received and is now in the admin approval queue."
        actionLabel="Continue"
      />
    </div>
  );
}
