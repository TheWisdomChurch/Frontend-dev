'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';

export function BlogSubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    'idle'
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await apiClient.subscribe({ email: email.trim() });
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="h-[1.5px] w-8 bg-[var(--app-primary)]" />
        <p className="font-ui text-body-sm font-semibold text-white">
          You&apos;re on the list.
        </p>
        <p className="font-ui text-label text-white/60">
          We&apos;ll notify you when devotionals go live.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={status === 'loading'}
        className="flex-1 border border-white/15 bg-white/[0.04] px-4 py-3 font-ui text-body-sm text-white placeholder:text-white/45 focus:border-[var(--app-primary)]/60 focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="shrink-0 bg-[var(--app-primary)] px-5 py-3 font-ui text-label font-bold uppercase tracking-[0.1em] text-[var(--app-ink)] transition hover:brightness-105 disabled:opacity-60"
      >
        {status === 'loading' ? 'Notifying…' : 'Notify me'}
      </button>
      {status === 'error' && (
        <p className="w-full font-ui text-label text-red-400">
          Something went wrong. Try again or join via WhatsApp.
        </p>
      )}
    </form>
  );
}
