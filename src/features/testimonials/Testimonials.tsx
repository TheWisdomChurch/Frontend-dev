'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
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
    label: 'Real stories',
    value: 'Faith journeys',
    detail: 'Stories of salvation, healing, care, hope, and transformation.',
    icon: Sparkles,
  },
  {
    label: 'Community impact',
    value: 'Shared strength',
    detail: 'Each testimony helps someone else keep trusting God.',
    icon: Users,
  },
  {
    label: 'Care pathway',
    value: 'Prayer & follow-up',
    detail: 'Testimonies often connect to pastoral care and discipleship.',
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
    title: item.isAnonymous ? 'Anonymous member' : 'Church member',
    quote: item.testimony,
  };
};

function TestimonyCard({ testimony }: { testimony: UiTestimony }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#d7bb75]/35 hover:bg-white/[0.075] sm:p-6">
      <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-[#d7bb75]/10 blur-3xl transition group-hover:bg-[#d7bb75]/20" />

      <Quote className="h-8 w-8 text-[#d7bb75]" />

      <p className="mt-5 line-clamp-6 text-[0.95rem] leading-7 text-white/72">
        {testimony.quote}
      </p>

      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="font-semibold text-white">{testimony.name}</p>
        <p className="mt-1 text-sm text-white/50">{testimony.title}</p>
      </div>
    </article>
  );
}

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
            <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d7bb75]/25 bg-[#d7bb75]/10 px-3 py-1.5 text-[#d7bb75]">
                  <MessageCircleHeart className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                    Testimony stories
                  </span>
                </div>

                <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Approved testimonies from the community.
                </h2>

                <p className="mt-4 max-w-lg text-[0.95rem] leading-7 text-white/62">
                  Every testimony is reviewed before publishing, so the stories
                  shown here remain clear, honouring, and helpful to the church.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
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
                  <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white/70">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading approved testimonies...
                    </div>
                  </div>
                ) : visibleTestimonies.length === 0 ? (
                  <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20 px-6 text-center">
                    <div className="max-w-sm">
                      <CheckCircle2 className="mx-auto h-9 w-9 text-[#d7bb75]" />
                      <p className="mt-4 text-sm leading-6 text-white/62">
                        No approved testimonies yet. Once testimonies are
                        reviewed and approved, they will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid max-h-[760px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleTestimonies.map(testimony => (
                      <TestimonyCard key={testimony.id} testimony={testimony} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
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
