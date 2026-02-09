'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H3, BodyMD, BodySM, Caption } from '@/components/text';
import { Button } from '@/components/utils/buttons';
import { Section, Container, GridboxLayout } from '@/components/layout';
import PageHero from '@/components/ui/PageHero';
import { Camera, Check, Quote, Shield, Globe, Eye, X } from 'lucide-react';
import apiClient from '@/lib/api';
import { WisdomeHouseLogo } from '@/components/assets';
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
  const { colorScheme } = useTheme();
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const characterCount = formData.testimony.length;

  const styles = useMemo(() => ({
    border: 'rgba(255,255,255,0.12)',
    surface: 'rgba(255,255,255,0.04)',
    bg: '#0a0a0a',
    text: '#f8fafc',
    muted: 'rgba(226,232,240,0.75)',
    primary: colorScheme.primary || '#fbbf24',
  }), [colorScheme.primary]);

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

  return (
    <>
      <PageHero title="Stories of Transformation" subtitle="God is moving in our house." />

      <Section padding="lg">
        <Container size="xl">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <textarea
              name="testimony"
              value={formData.testimony}
              onChange={handleChange}
              rows={isMobile ? 6 : 8}
              maxLength={MAX_TESTIMONY_LEN}
              className="w-full rounded-xl p-4"
            />
            <div className="text-sm text-white/60">
              {characterCount}/{MAX_TESTIMONY_LEN}
            </div>

            <label className="flex gap-2 items-center">
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
              I agree to the terms
            </label>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit testimony'}
            </Button>
          </form>
        </Container>
      </Section>

      <BaseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Testimony">
        <p>{modalMessage}</p>
      </BaseModal>
    </>
  );
}
