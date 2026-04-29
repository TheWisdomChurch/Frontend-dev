'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ArrowRight, PlayCircle, Radio, Video } from 'lucide-react';

import PageHero from '@/features/hero/PageHero';
import SermonUtil from '@/shared/ui/Sermons';
import Button from '@/shared/utils/buttons/CustomButton';
import { Container, Section } from '@/shared/layout';
import { AppDispatch } from '@/lib/store';
import { fetchSermons } from '@/lib/store/slices/sermonsSlice';

export default function SermonPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSermons());
  }, [dispatch]);

  const handleYouTubeRedirect = () => {
    window.open(
      'https://www.youtube.com/@wisdomhousehq',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Sermons & Teachings"
        subtitle="Catch up on every message"
        note="Transformative messages from Sundays, conferences, and midweek gatherings. Practical biblical teaching for daily life."
        chips={[
          'Platform: YouTube',
          'Format: Video + Audio',
          'New: Weekly uploads',
          'Live: Sun & Thu',
        ]}
      />

      <SermonUtil />

      <Section
        padding="lg"
        fullHeight={false}
        className="relative overflow-hidden bg-[#050505]"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(247,222,18,0.12),transparent_32%),radial-gradient(circle_at_86%_18%,rgba(255,0,0,0.08),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(247,222,18,0.07),transparent_34%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
        </div>

        <Container size="xl" className="relative z-10">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ff0000]/25 bg-[#ff0000]/10 px-3 py-1.5 text-[#ff4d4d]">
                  <Radio className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                    Watch & Listen Anywhere
                  </span>
                </div>

                <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Stay connected to every message from Wisdom House.
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-white/62 sm:text-base">
                  Watch full video messages, revisit powerful teachings, and
                  subscribe for weekly uploads from Sundays, conferences, and
                  midweek gatherings.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {[
                    ['Full messages', 'Video teachings'],
                    ['Weekly uploads', 'Fresh sermons'],
                    ['Live services', 'Sun & Thu'],
                  ].map(([title, value]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4"
                    >
                      <p className="text-sm font-semibold text-white">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-white/50">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />

                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-7">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-[#ff0000] shadow-[0_18px_50px_rgba(255,0,0,0.22)]">
                      <Video className="h-9 w-9 text-white" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-white/45">
                        Platform
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        YouTube
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        Full video messages with interactive features.
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <div className="flex items-start gap-3">
                      <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff4d4d]" />
                      <p className="text-sm leading-6 text-white/65">
                        Subscribe to the Wisdom House channel to receive new
                        uploads, live service alerts, and replay access.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleYouTubeRedirect}
                    variant="primary"
                    size="lg"
                    curvature="full"
                    elevated
                    leftIcon={<Video className="h-5 w-5 text-white" />}
                    className="mt-6 h-12 w-full font-bold transition hover:scale-[1.01] active:scale-[0.98]"
                    style={{
                      backgroundColor: '#FF0000',
                      color: '#FFFFFF',
                    }}
                  >
                    <span className="inline-flex items-center justify-center gap-2 text-white">
                      Subscribe to Channel
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
