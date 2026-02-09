'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Calendar, MapPin, Sparkles, X } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Button } from '@/components/utils/buttons';
import { H2, BodySM, BodyMD } from '@/components/text';
import apiPublic from '@/lib/api';

type EventAdConfig = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  startAt?: string; // ISO string
  location?: string;
  imageUrl?: string;
  formSlug?: string | null;
  ctaLabel?: string;
};

type Props = {
  event: EventAdConfig;
  open: boolean;
  onClose: () => void;
  onRemindLater?: () => void;
};

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const computeCountdown = (iso?: string) => {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return null;
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return { days, hours };
};

export default function EventAdModal({ event, open, onClose, onRemindLater }: Props) {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const countdown = useMemo(() => computeCountdown(event.startAt), [event.startAt]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => setCanClose(true), 1500);
    return () => {
      document.body.style.overflow = original;
      clearTimeout(timer);
      setCanClose(false);
    };
  }, [open]);

  if (!mounted || !open) return null;

  const dateLabel = formatDate(event.startAt);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setError('Please add your name and email to continue.');
      return;
    }

    try {
      setSubmitting(true);
      if (event.formSlug) {
        await apiPublic.submitPublicForm(event.formSlug, {
          answers: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            eventId: event.id,
          },
        });
      } else {
        await apiPublic.subscribe({ name: form.name.trim(), email: form.email.trim() });
      }
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to submit right now.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(251,191,36,0.16), transparent 40%), rgba(3,3,3,0.82)',
        backdropFilter: 'blur(10px)',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
        style={{
          boxShadow: `0 40px 120px ${colorScheme.opacity.primary10}`,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={!canClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition disabled:cursor-not-allowed disabled:opacity-30 hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-black via-[#0b0b0b] to-[#0f0f0f] p-6 sm:p-8 lg:p-10">
            <div className="absolute -left-20 -top-16 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />
            <div className="absolute -bottom-24 right-8 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-200 animate-pulse">
                <Sparkles className="h-4 w-4" />
                Featured Event
              </div>

              <div className="space-y-3">
                <H2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
                  {event.title}
                </H2>
                <BodyMD className="text-white/70">{event.subtitle}</BodyMD>
              </div>

              <BodySM className="text-white/70 leading-relaxed">
                {event.description}
              </BodySM>

              <div className="space-y-2">
                {dateLabel && (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Calendar className="h-4 w-4 text-amber-200" />
                    {dateLabel}
                    {countdown && (
                      <span className="ml-2 rounded-full border border-amber-200/30 bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-200">
                        {countdown.days}d {countdown.hours}h left
                      </span>
                    )}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <MapPin className="h-4 w-4 text-amber-200" />
                    {event.location}
                  </div>
                )}
              </div>

              {event.imageUrl && (
                <div className="relative mt-4 h-44 w-full overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 520px"
                    priority
                  />
                </div>
              )}
            </div>
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="space-y-5">
              <div>
                <BodyMD className="font-semibold text-white">
                  Quick registration
                </BodyMD>
                <BodySM className="text-white/60">
                  Reserve your spot in under 30 seconds.
                </BodySM>
              </div>

              {submitted ? (
                <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-5 text-amber-100">
                  <BodyMD className="font-semibold">You’re on the list.</BodyMD>
                  <BodySM className="text-amber-100/80 mt-1">
                    We’ll send you the event details shortly.
                  </BodySM>
                  <div className="mt-4">
                    <Button
                      variant="primary"
                      size="md"
                      curvature="lg"
                      onClick={onClose}
                      className="w-full"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/60">Full name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/40"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/60">Email address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/40"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/60">Phone (optional)</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/40"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    curvature="lg"
                    disabled={submitting}
                    className="w-full"
                    style={{
                      background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                      color: colorScheme.black,
                    }}
                  >
                    {submitting ? 'Submitting…' : event.ctaLabel ?? 'Reserve my seat'}
                  </Button>
                </form>
              )}

              {!submitted && (
                <div className="flex items-center justify-between text-[11px] text-white/50">
                  <span>Limited seats. Confirmation sent instantly.</span>
                  {onRemindLater && (
                    <button
                      type="button"
                      onClick={onRemindLater}
                      className="text-white/60 underline-offset-4 hover:text-white hover:underline"
                    >
                      Remind me later
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
