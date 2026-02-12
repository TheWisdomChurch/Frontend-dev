'use client';

import React, { useEffect, useState } from 'react';
import { H3, BodyMD, BodySM } from '@/components/text';
import { Button } from '@/components/utils/buttons';
import { PageSection } from '@/components/layout';
import PageHero from '@/components/ui/PageHero';
import { Quote, Shield, Eye } from 'lucide-react';
import apiClient from '@/lib/api';
import { BaseModal } from '@/components/modal/Base';

const BREAKPOINT_MD = 768;
const MAX_TESTIMONY_LEN = 1000;

/* -------------------- hooks -------------------- */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/* -------------------- page -------------------- */
export default function TestimoniesPage() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINT_MD - 1}px)`);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    testimony: '',
    anonymous: false,
    allowSharing: true,
    agreeToTerms: false,
    email: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const characterCount = formData.testimony.length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.agreeToTerms) {
      setModalMessage('Please agree to the terms.');
      setModalOpen(true);
      return;
    }

    setSubmitting(true);

    try {
      await apiClient.submitTestimonial({
        firstName: formData.anonymous ? 'Anonymous' : formData.firstName,
        lastName: formData.anonymous ? 'Anonymous' : formData.lastName,
        testimony: formData.testimony.trim(),
        isAnonymous: formData.anonymous,
        email: formData.email || undefined,
      });

      setModalMessage('Your testimony has been received!');
      setModalOpen(true);
      setFormData({
        firstName: '',
        lastName: '',
        testimony: '',
        anonymous: false,
        allowSharing: true,
        agreeToTerms: false,
        email: '',
      });
    } catch {
      setModalMessage('Failed to submit testimony.');
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = 'text-sm font-medium text-gray-800';

  return (
    <>
      <PageHero
        title="Stories of Transformation"
        subtitle="God is moving in our house."
        note="Share what God has done in your life. Your testimony encourages faith and builds community."
        compact={isMobile}
      />

      <PageSection tone="surface" padding="xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 items-start">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full page-card-muted flex items-center justify-center">
                <Quote className="w-5 h-5 text-accent" />
              </div>
              <div>
                <H3 className="mb-1">Share your testimony</H3>
                <BodySM className="text-muted">
                  We review every submission with care.
                </BodySM>
              </div>
            </div>

            <BodyMD className="text-muted">
              Your story helps others find hope. Keep it honest and concise, and
              include details that will encourage someone walking a similar
              path.
            </BodyMD>

            <div className="page-card-muted p-5 space-y-4">
              {/* <div className="flex gap-3">
                <Shield className="w-4 h-4 text-accent mt-0.5" />
                <BodySM className="text-muted">
                  We never sell your information. Your privacy matters.
                </BodySM>
              </div> */}
              <div className="flex gap-3">
                <Eye className="w-4 h-4 text-accent mt-0.5" />
                <BodySM className="text-muted">
                  You can choose to stay anonymous or allow public sharing.
                </BodySM>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="page-card p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={formData.anonymous}
                  className={`input-base ${formData.anonymous ? 'opacity-60' : ''}`}
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={formData.anonymous}
                  className={`input-base ${formData.anonymous ? 'opacity-60' : ''}`}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="email">
                Email (optional)
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-base"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="testimony">
                Your testimony
              </label>
              <textarea
                id="testimony"
                name="testimony"
                value={formData.testimony}
                onChange={handleChange}
                rows={isMobile ? 7 : 9}
                maxLength={MAX_TESTIMONY_LEN}
                className="input-base min-h-[180px]"
                placeholder="Tell us what God has done in your life..."
              />
              <div className="text-xs text-gray-500">
                {characterCount}/{MAX_TESTIMONY_LEN}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Share anonymously
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="allowSharing"
                  checked={formData.allowSharing}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Allow public sharing
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                I agree to the terms
              </label>
            </div>

            <Button type="submit" disabled={submitting} fullWidth>
              {submitting ? 'Submitting…' : 'Submit testimony'}
            </Button>
          </form>
        </div>
      </PageSection>

      <BaseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Testimony">
        <p>{modalMessage}</p>
      </BaseModal>
    </>
  );
}
