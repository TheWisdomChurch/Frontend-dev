'use client';

import { useState } from 'react';
import { ArrowRight, Check, Loader2, Mail } from 'lucide-react';
import { Container, Section } from '@/shared/ui/layout';
import { buttonClass } from '@/shared/ui/button';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/cn';

export function LeadershipNewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'err'>(
    'idle'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = email.trim();
    if (!val) return;
    setStatus('loading');
    try {
      await apiClient.subscribe({ email: val });
      setEmail('');
      setStatus('done');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('err');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <Section
      tone="dark"
      className="border-t border-white/10 bg-[var(--app-dark)] py-16 sm:py-20"
    >
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,var(--app-dark-2),var(--app-dark-3))] p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle gold ambient glow in top-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[color-mix(in_srgb,var(--app-primary)_14%,transparent)] blur-3xl"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--app-primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] px-3.5 py-1.5 font-ui text-caption font-bold uppercase tracking-[0.16em] text-[var(--app-primary-light)]">
                <Mail className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                Stay in the Word
              </div>

              <h2 className="mt-4 font-headline text-heading-lg font-normal leading-tight text-white">
                Spiritual growth and updates,{' '}
                <span className="italic text-[var(--app-primary-light)]">
                  straight to you.
                </span>
              </h2>

              <p className="mt-3 max-w-lg font-ui text-body-md text-white/70">
                Subscribe to receive weekly sermon devotionals, upcoming
                ministry events, and pastoral encouragement from our leadership
                team.
              </p>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div
                  className={cn(
                    'flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl border p-2 transition duration-200',
                    status === 'err'
                      ? 'border-[var(--status-error)]/60 bg-white/5'
                      : 'border-white/15 bg-white/[0.04] focus-within:border-[var(--app-primary)] focus-within:bg-white/[0.07]'
                  )}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    disabled={status === 'loading'}
                    className="h-12 min-h-12 min-w-0 flex-1 bg-transparent px-4 font-ui text-body-md text-white outline-none placeholder:text-white/45"
                  />

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={buttonClass(
                      'primary',
                      'md',
                      'min-h-12 px-6 rounded-xl font-ui font-bold'
                    )}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : status === 'done' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Subscribed!
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <div
                  className="min-h-[1.5rem] px-2 font-ui text-caption"
                  aria-live="polite"
                >
                  {status === 'done' && (
                    <span className="text-[var(--status-success)] font-medium">
                      Thank you! You are now subscribed to our leadership
                      bulletins.
                    </span>
                  )}
                  {status === 'err' && (
                    <span className="text-[var(--status-error)] font-medium">
                      Unable to subscribe right now. Please try again shortly.
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
