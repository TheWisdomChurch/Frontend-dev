'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import type { CountryCode } from 'libphonenumber-js';
import toast from 'react-hot-toast';

import { apiClient } from '@/lib/api';
import {
  DEFAULT_PHONE_COUNTRY,
  isValidNationalPhone,
  toE164,
} from '@/lib/validation/phone';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/shared/constants/contactInfo';
import { PhoneNumberField } from '@/shared/ui/forms';
import { BaseModal } from '@/shared/ui/modals/Base';
import { Button } from '@/shared/utils/buttons';
import { COMMUNITY_JOIN_EVENT } from './communityJoinEvent';

const inputClass =
  'min-h-12 w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 font-ui text-sm text-white outline-none placeholder:text-white/35 transition focus:border-[var(--app-primary)]/65 focus:ring-4 focus:ring-[var(--app-primary)]/10';
const labelClass =
  'block font-ui text-[11px] font-bold uppercase tracking-[0.14em] text-white/50';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  interest: 'Belonging and church membership',
  preferredContact: 'WhatsApp',
  notes: '',
  consent: true,
};

function splitName(value: string) {
  const parts = value.trim().split(/\s+/);
  const firstName = parts.shift() || '';
  return { firstName, lastName: parts.join(' ') || firstName };
}

export default function CommunityJoinModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [country, setCountry] = useState<CountryCode>(DEFAULT_PHONE_COUNTRY);
  const [form, setForm] = useState(initialForm);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handleOpen = () => {
      setSubmitted(false);
      setSubmissionError(null);
      setOpen(true);
    };
    window.addEventListener(COMMUNITY_JOIN_EVENT, handleOpen);
    return () => window.removeEventListener(COMMUNITY_JOIN_EVENT, handleOpen);
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hello Wisdom Church, my name is ${form.name.trim() || 'a new community member'}. I submitted the community connection form and I would like help with ${form.interest.toLowerCase()}.`
  );
  const whatsappHref = `${SOCIAL_LINKS.whatsapp}?text=${whatsappMessage}`;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    if (!form.consent) {
      toast.error('Please allow our connection team to follow up with you.');
      return;
    }
    if (form.phone.trim() && !isValidNationalPhone(form.phone, country)) {
      toast.error('Enter a valid phone number for the selected country.');
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);
    try {
      const { firstName, lastName } = splitName(form.name);
      await apiClient.submitContactMessage({
        firstName,
        lastName,
        email: form.email.trim(),
        phone: form.phone.trim()
          ? toE164(form.phone, country) || undefined
          : undefined,
        topic: 'Join our community',
        message: [
          `Community interest: ${form.interest}`,
          `Preferred contact: ${form.preferredContact}`,
          form.notes.trim() ? `Notes: ${form.notes.trim()}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        sourceChannel: 'frontend:web:community-modal',
        metadata: {
          intent: 'community_connection',
          preferredContact: form.preferredContact.toLowerCase(),
          interest: form.interest,
          followUpConsent: true,
        },
      });
      setSubmitted(true);
    } catch {
      setSubmissionError(
        'We could not save your request yet. Your details are still here—please try again or continue on WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BaseModal
      isOpen={open}
      onClose={close}
      title={submitted ? 'You’re connected' : 'Find your place here'}
      subtitle={
        submitted
          ? 'Your request is safely recorded for our connection team.'
          : 'Tell us how you would like to connect. We’ll route your request to the right team.'
      }
      headerIcon={submitted ? <CheckCircle2 /> : <HeartHandshake />}
      maxWidth="max-w-xl"
      forceBottomSheet
      preventClose={submitting}
      isLoading={submitting}
      loadingText="Saving your connection request…"
    >
      {submitted ? (
        <div className="min-w-0 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="mt-5 break-words font-headline text-2xl leading-tight text-white sm:text-3xl">
            Welcome to the family.
          </h3>
          <p className="mx-auto mt-3 max-w-md font-ui text-sm leading-6 text-white/58">
            Our connection team has your details. Continue on WhatsApp now for
            an immediate conversation, or wait for the team to contact you
            through your preferred channel.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.14em] text-[var(--app-primary)]">
              What happens next
            </p>
            <p className="mt-2 font-ui text-sm leading-6 text-white/55">
              Your request is reviewed, assigned to the connection team, and
              retained for follow-up so nobody is lost in transit.
            </p>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--app-whatsapp,#25D366)] px-5 py-3 font-ui text-sm font-extrabold text-black transition hover:brightness-110"
            >
              <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
            </a>
            <button
              type="button"
              onClick={close}
              className="min-h-12 rounded-full border border-white/12 px-5 py-3 font-ui text-sm font-bold text-white transition hover:bg-white/[0.06]"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form className="min-w-0 space-y-5 pb-1" onSubmit={submit}>
          <div className="relative overflow-hidden rounded-2xl border border-[var(--app-primary)]/20 bg-[linear-gradient(135deg,rgba(201,150,26,.15),rgba(255,255,255,.03))] p-4 sm:p-5">
            <div className="relative flex min-w-0 items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--app-primary)]/12 text-[var(--app-primary)]">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-[var(--app-primary)]">
                  A guided connection
                </p>
                <p className="mt-1 break-words font-ui text-sm leading-6 text-white/58">
                  No generic inbox and no dead end. Choose what you need and
                  we’ll send it to the right people.
                </p>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 space-y-2">
              <span className={labelClass}>Full name</span>
              <input
                id="community-name"
                name="name"
                required
                autoComplete="name"
                className={inputClass}
                placeholder="Your full name"
                value={form.name}
                onChange={event =>
                  setForm(current => ({ ...current, name: event.target.value }))
                }
              />
            </label>
            <label className="min-w-0 space-y-2">
              <span className={labelClass}>Email address</span>
              <input
                id="community-email"
                name="email"
                required
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="you@example.com"
                value={form.email}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <label className="block min-w-0 space-y-2">
            <span className={labelClass}>WhatsApp / phone number</span>
            <PhoneNumberField
              id="community-phone"
              country={country}
              number={form.phone}
              onCountryChange={setCountry}
              onNumberChange={phone =>
                setForm(current => ({ ...current, phone }))
              }
              inputClassName={inputClass}
              selectClassName={inputClass}
              placeholder={CONTACT_INFO.phone}
            />
          </label>

          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 space-y-2">
              <span className={labelClass}>I’m interested in</span>
              <select
                id="community-interest"
                name="interest"
                className={inputClass}
                value={form.interest}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    interest: event.target.value,
                  }))
                }
              >
                <option>Belonging and church membership</option>
                <option>Joining a ministry group</option>
                <option>Serving on a team</option>
                <option>Prayer and pastoral support</option>
                <option>Learning more first</option>
              </select>
            </label>
            <label className="min-w-0 space-y-2">
              <span className={labelClass}>Contact me through</span>
              <select
                id="community-preferred-contact"
                name="preferredContact"
                className={inputClass}
                value={form.preferredContact}
                onChange={event =>
                  setForm(current => ({
                    ...current,
                    preferredContact: event.target.value,
                  }))
                }
              >
                <option>WhatsApp</option>
                <option>Phone call</option>
                <option>Email</option>
              </select>
            </label>
          </div>

          <label className="block min-w-0 space-y-2">
            <span className={labelClass}>Anything else? (optional)</span>
            <textarea
              id="community-notes"
              name="notes"
              className={`${inputClass} min-h-24 resize-none`}
              placeholder="Tell us what would help you feel connected…"
              value={form.notes}
              onChange={event =>
                setForm(current => ({ ...current, notes: event.target.value }))
              }
            />
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-3.5">
            <input
              id="community-follow-up-consent"
              name="followUpConsent"
              type="checkbox"
              checked={form.consent}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  consent: event.target.checked,
                }))
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--app-primary)]"
            />
            <span className="min-w-0 break-words font-ui text-xs leading-5 text-white/50">
              I’m happy for the Wisdom Church connection team to follow up about
              this request.
            </span>
          </label>

          <div className="grid gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-5 sm:p-5">
            <div className="flex min-w-0 items-start gap-2 text-white/45">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <p className="break-words font-ui text-xs leading-5">
                Your request is recorded before the optional WhatsApp handoff.
              </p>
            </div>
            <Button
              type="submit"
              variant="primary"
              rightIcon={<ArrowRight aria-hidden="true" />}
              className="min-h-12 w-full whitespace-nowrap rounded-full px-6 py-3 font-ui text-sm font-bold sm:w-auto sm:min-w-36"
              loading={submitting}
            >
              Connect me
            </Button>
          </div>
          {submissionError ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.08] px-4 py-3 font-ui text-xs leading-5 text-rose-100"
            >
              <p>{submissionError}</p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex font-bold text-white underline underline-offset-4"
              >
                Continue on WhatsApp
              </a>
            </div>
          ) : null}
        </form>
      )}
    </BaseModal>
  );
}
