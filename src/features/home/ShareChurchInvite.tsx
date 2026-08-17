'use client';

import { useState } from 'react';
import { Check, MessageCircle, Share2 } from 'lucide-react';

import { SITE_NAME, SITE_URL } from '@/lib/seo';
import { useAnalytics } from '@/shared/providers/AnalyticsProvider';

const inviteText =
  'You are welcome at The Wisdom Church this Sunday. Here are the service details:';

export default function ShareChurchInvite() {
  const [copied, setCopied] = useState(false);
  const { trackEvent } = useAnalytics();
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${inviteText} ${SITE_URL}`)}`;

  async function shareInvite() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: SITE_NAME,
          text: inviteText,
          url: SITE_URL,
        });
        trackEvent('church_invitation_shared', { channel: 'native_share' });
        return;
      }

      await navigator.clipboard.writeText(`${inviteText} ${SITE_URL}`);
      setCopied(true);
      trackEvent('church_invitation_shared', { channel: 'clipboard' });
      window.setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }

  return (
    <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="font-ui text-xs font-bold uppercase tracking-[0.14em] text-[var(--app-primary)]">
        Bring someone with you
      </p>
      <p className="mt-2 font-ui text-sm leading-6 text-white/55">
        Know someone looking for a church family? Send them a personal
        invitation in seconds.
      </p>
      <div className="mt-4 grid gap-2 min-[430px]:grid-cols-2">
        <button
          type="button"
          onClick={shareInvite}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-4 font-ui text-sm font-bold text-white transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          {copied ? 'Invitation copied' : 'Share invitation'}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            trackEvent('church_invitation_shared', { channel: 'whatsapp' })
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 font-ui text-sm font-extrabold text-black transition hover:brightness-110"
        >
          <MessageCircle className="h-4 w-4" /> Share on WhatsApp
        </a>
      </div>
    </div>
  );
}
