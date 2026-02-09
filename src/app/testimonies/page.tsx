'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H1, H3, BodyMD, BodySM, BodyLG, Caption, SmallText } from '@/components/text';
import { Button } from '@/components/utils/buttons';
import { Section, Container, GridboxLayout } from '@/components/layout';
import PageHero from '@/components/ui/PageHero';
import {
  Camera,
  Check,
  Quote,
  Shield,
  Globe,
  Eye,
  Clock,
  HeartHandshake,
  X,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { CreateTestimonialRequest } from '@/lib/apiTypes';
import { WisdomeHouseLogo } from '@/components/assets';
import { BaseModal } from '@/components/modal/Base';


const BREAKPOINTS = { md: 768 } as const;
const MAX_TESTIMONY_LEN = 1000;

type AsyncStatus = 'idle' | 'submitting' | 'success' | 'error';

interface TestimonialFormData {
  firstName: string;
  lastName: string;
  image: string; // base64 data URL (for preview only; do not send to backend)
  testimony: string;
  anonymous: boolean;
  allowSharing: boolean;
  agreeToTerms: boolean;
  email?: string;
}

type ModalVariant = 'success' | 'error';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();

    // Safari fallback
    if (media.addEventListener) media.addEventListener('change', onChange);
    else media.addListener(onChange);

    return () => {
      if (media.removeEventListener) media.removeEventListener('change', onChange);
      else media.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/* =============================================================================
   Modal (accessible, scalable)
============================================================================= */

function Modal({
  open,
  onClose,
  title,
  description,
  variant = 'success',
  primaryActionLabel = 'Close',
  onPrimaryAction,
  styles,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: ModalVariant;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  styles: {
    border: string;
    bg: string;
    surface: string;
    text: string;
    muted: string;
    primary: string;
    wash: string;
    ringColor: string;
  };
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // focus close button when opened
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const icon =
    variant === 'success' ? (
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl border"
        style={{ borderColor: styles.border, background: styles.bg }}
      >
        <Check className="h-5 w-5" style={{ color: styles.primary }} />
      </div>
    ) : (
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl border"
        style={{ borderColor: styles.border, background: styles.bg }}
      >
        <Shield className="h-5 w-5" style={{ color: '#f87171' }} />
      </div>
    );

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border shadow-xl"
        style={{
          borderColor: styles.border,
          background: `linear-gradient(180deg, ${styles.surface}, rgba(255,255,255,0.02))`,
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b p-5 sm:p-6" style={{ borderColor: styles.border }}>
          <div className="flex items-start gap-4">
            {icon}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold" style={{ color: styles.text }}>
                {title}
              </h3>
              {description ? (
                <p className="mt-1 text-sm sm:text-[0.95rem] leading-relaxed" style={{ color: styles.muted }}>
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="rounded-lg border p-2 transition hover:opacity-80"
            aria-label="Close"
            style={{ borderColor: styles.border, background: styles.bg, color: styles.muted }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="primary"
              size="md"
              curvature="xl"
              onClick={() => {
                onPrimaryAction?.();
                onClose();
              }}
              className="w-full sm:w-auto font-medium"
              style={{ backgroundColor: styles.primary, color: '#fff' }}
            >
              {primaryActionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Page
============================================================================= */

export default function TestimoniesPage() {
  const { colorScheme } = useTheme();

  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);

  const [formData, setFormData] = useState<TestimonialFormData>({
    firstName: '',
    lastName: '',
    image: '',
    testimony: '',
    anonymous: false,
    allowSharing: true,
    agreeToTerms: false,
    email: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // responsive
  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < BREAKPOINTS.md);
    checkViewport();
    window.addEventListener('resize', checkViewport);
  return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const styles = useMemo(() => {
    const primary = colorScheme.primary || '#fbbf24';
    return {
      border: 'rgba(255,255,255,0.12)',
      surface: 'rgba(255,255,255,0.04)',
      bg: '#0a0a0a',
      text: '#f8fafc',
      muted: 'rgba(226,232,240,0.75)',
      primary,
      wash: 'rgba(255,255,255,0.06)',
      ringColor: `${primary}55`,
    };
  }, [colorScheme.primary]);

  const focusRingStyle = useMemo(
    () =>
      ({
        '--tw-ring-color': styles.ringColor,
        '--tw-ring-offset-color': styles.bg,
      } as React.CSSProperties),
    [styles.ringColor, styles.bg]
  );

  const submitting = status === 'submitting';

  const characterCount = formData.testimony.length;

  const resetForm = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      image: '',
      testimony: '',
      anonymous: false,
      allowSharing: true,
      agreeToTerms: false,
      email: '',
    });
    setImagePreview(null);
    setErrorMessage('');
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const setModal = useCallback((variant: ModalVariant, message?: string) => {
    setModalVariant(variant);
    setErrorMessage(message || '');
    setModalOpen(true);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => {
          const next = { ...prev, [name]: checked } as TestimonialFormData;

          // When toggling anonymous ON, clear fields that won't be used
          if (name === 'anonymous' && checked) {
            next.firstName = '';
            next.lastName = '';
            next.image = '';
          }

          return next;
        });

        // also clear preview if anonymous turned on
        if (name === 'anonymous' && (e.target as HTMLInputElement).checked) {
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }

        return;
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageChange = useCallback((file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    // Revoke old preview to avoid memory leaks
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    return () => {
      // cleanup preview URL on unmount
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleImageChange(file);
  };

  const handleRemoveImage = () => {
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFormData((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleImageChange(file);
  };

  const validate = useCallback((): string | null => {
    if (!formData.agreeToTerms) return 'Please agree to the terms and conditions.';
    if (!formData.testimony.trim()) return 'Please enter your testimony.';

    const testimonyLen = formData.testimony.trim().length;
    if (testimonyLen > MAX_TESTIMONY_LEN) return `Testimony must be ${MAX_TESTIMONY_LEN} characters or less.`;

    if (!formData.anonymous) {
      if (!formData.firstName.trim()) return 'Please enter your first name (or choose Anonymous).';
      if (!formData.lastName.trim()) return 'Please enter your last name (or choose Anonymous).';
    }

    const email = (formData.email || '').trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address.';

    return null;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const err = validate();
    if (err) {
      setStatus('error');
      setModal('error', err);
      return;
    }

    setStatus('submitting');

    // Backend binding requires firstName + lastName
    const firstName = formData.anonymous ? 'Anonymous' : formData.firstName.trim();
    const lastName = formData.anonymous ? 'Anonymous' : formData.lastName.trim();

    // ✅ payload matches backend (add fields later only when backend supports)
    const payload = {
      firstName,
      lastName,
      testimony: formData.testimony.trim(),
      isAnonymous: formData.anonymous,
      allowSharing: formData.allowSharing, // keep it for scalability (remove if backend rejects unknown fields)
      email: (formData.email || '').trim() || undefined, // keep optional (remove if backend rejects)
      // imageUrl: "https://..." // implement upload later; do NOT send base64
    };

    try {
      // If your backend rejects extra fields, remove allowSharing/email above.
      await apiPublic.submitTestimonial(payload as any);

      setStatus('success');
      setModal(
        'success',
        'Thank you! Your testimony was received and will be reviewed before publishing.'
      );
      resetForm();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Failed to submit testimony. Please try again.';
      setStatus('error');
      setModal('error', msg);
    } finally {
      setStatus((s) => (s === 'submitting' ? 'idle' : s));
    }
  };

  const modalTitle =
    modalVariant === 'success' ? 'Submission received' : 'Unable to submit';

  const modalDescription =
    modalVariant === 'success'
      ? 'Thank you! Your testimony was received and will be reviewed before publishing.'
      : errorMessage || 'Please check the form and try again.';

  return (
    <>
      <PageHero
        title="Stories of Transformation"
        subtitle="God is moving in our house."
        note="Share what God has done in your life or be encouraged by testimonies from our global family."
        chips={['Testimonies: Fresh weekly', 'Reach: Global family', 'Focus: Jesus at the center', 'Culture: Faith & Excellence']}
      />

      <Section
        padding="lg"
        className="min-h-screen"
        style={{
          background: 'linear-gradient(180deg, #050505 0%, #0b0b0b 60%, #050505 100%)',
        }}
      >
        <Container size="xl" className="space-y-9 lg:space-y-12">
          {/* MAIN GRID */}
          <GridboxLayout columns={2} gap="xl" responsive={{ xs: 1, md: 2, lg: 2 }} className="items-start">
            {/* FORM CARD */}
            <div
              className="rounded-2xl border shadow-sm"
              style={{ borderColor: styles.border, background: styles.surface }}
            >
              <div
                className="border-b p-6 lg:p-7"
                style={{
                  borderColor: styles.border,
                  background: `linear-gradient(90deg, ${styles.wash}, transparent)`,
                }}
              >
                <H3 className="mb-1 font-medium text-lg" style={{ color: styles.text }}>
                  Your testimony
                </H3>
                <BodySM style={{ color: styles.muted }}>
                  Fill this form and submit when ready. You can also choose to remain anonymous.
                </BodySM>
              </div>

              <div className="p-6 lg:p-7">
                <form id="testimony-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* IMAGE UPLOAD */}
                  {!formData.anonymous && (
                    <div className="space-y-2">
                      <BodySM className="text-sm font-medium" style={{ color: styles.text }}>
                        Photo (optional)
                      </BodySM>

                      <div
                        className={cx(
                          'group relative rounded-xl border p-4 transition',
                          'focus-within:ring-2'
                        )}
                        style={{ borderColor: styles.border, background: styles.bg, ...focusRingStyle }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onFileInputChange}
                        />

                        <div className="flex items-center gap-4">
                          <div
                            className="h-14 w-14 overflow-hidden rounded-xl border"
                            style={{ borderColor: styles.border, background: styles.surface }}
                          >
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Camera className="h-5 w-5" style={{ color: styles.muted }} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <BodyMD className="font-medium text-sm sm:text-base" style={{ color: styles.text }}>
                              {imagePreview ? 'Photo selected' : 'Upload a photo'}
                            </BodyMD>
                            <BodySM style={{ color: styles.muted }}>
                              Click to upload or drag and drop. PNG/JPG recommended.
                            </BodySM>
                          </div>

                          {imagePreview && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage();
                              }}
                              className="rounded-lg border px-3 py-2 text-sm transition hover:opacity-80"
                              style={{ borderColor: styles.border, color: styles.muted, background: styles.surface }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NAMES */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <BodySM className="text-sm font-medium" style={{ color: styles.text }}>
                        First name {!formData.anonymous && <span style={{ color: styles.muted }}>*</span>}
                      </BodySM>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required={!formData.anonymous}
                        disabled={formData.anonymous}
                        placeholder="John"
                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none ring-offset-2 transition focus:ring-2 disabled:opacity-60"
                        style={{
                          borderColor: styles.border,
                          background: styles.bg,
                          color: styles.text,
                          ...focusRingStyle,
                        }}
                      />
                    </label>

                    <label className="space-y-2">
                      <BodySM className="text-sm font-medium" style={{ color: styles.text }}>
                        Last name {!formData.anonymous && <span style={{ color: styles.muted }}>*</span>}
                      </BodySM>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required={!formData.anonymous}
                        disabled={formData.anonymous}
                        placeholder="Doe"
                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none ring-offset-2 transition focus:ring-2 disabled:opacity-60"
                        style={{
                          borderColor: styles.border,
                          background: styles.bg,
                          color: styles.text,
                          ...focusRingStyle,
                        }}
                      />
                    </label>
                  </div>

                  {/* EMAIL (optional) */}
                  <label className="space-y-2">
                    <BodySM className="text-sm font-medium" style={{ color: styles.text }}>
                      Email (optional)
                    </BodySM>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border px-4 py-3 text-sm outline-none ring-offset-2 transition focus:ring-2"
                      style={{
                        borderColor: styles.border,
                        background: styles.bg,
                        color: styles.text,
                        ...focusRingStyle,
                      }}
                    />
                    <BodySM style={{ color: styles.muted }}>
                      Used only for verification. Not displayed publicly.
                    </BodySM>
                  </label>

                  {/* TESTIMONY */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <BodySM className="text-sm font-medium" style={{ color: styles.text }}>
                        Your testimony <span style={{ color: styles.muted }}>*</span>
                      </BodySM>
                      <BodySM style={{ color: styles.muted }}>
                        {characterCount}/{MAX_TESTIMONY_LEN}
                      </BodySM>
                    </div>
                    <textarea
                      name="testimony"
                      value={formData.testimony}
                      onChange={handleChange}
                      required
                      rows={isMobile ? 6 : 7}
                      maxLength={MAX_TESTIMONY_LEN}
                      placeholder="Share your story—what happened, what changed, and what you learned…"
                      className="w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed outline-none ring-offset-2 transition focus:ring-2"
                      style={{
                        borderColor: styles.border,
                        background: styles.bg,
                        color: styles.text,
                        ...focusRingStyle,
                      }}
                    />
                    <BodySM style={{ color: styles.muted }}>
                      Keep it clear and specific. Avoid private details you do not want shared.
                    </BodySM>
                  </div>

                  {/* CHECKBOXES */}
                  <div className="space-y-3">
                    <CheckboxRow
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleChange as any}
                      title="Share anonymously"
                      description="Your name and photo will not be displayed."
                      icon={<Eye className="h-4 w-4" />}
                      styles={styles}
                    />
                    <CheckboxRow
                      name="allowSharing"
                      checked={formData.allowSharing}
                      onChange={handleChange as any}
                      title="Allow sharing on church platforms"
                      description="May be shared during services or online."
                      icon={<Globe className="h-4 w-4" />}
                      styles={styles}
                    />
                    <CheckboxRow
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange as any}
                      title="I agree to the terms and conditions"
                      description="Required to submit."
                      icon={<Shield className="h-4 w-4" />}
                      required
                      styles={styles}
                    />
                  </div>

                  {/* SUBMIT */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      curvature="xl"
                      disabled={submitting || !formData.agreeToTerms}
                      className="w-full font-medium shadow-sm transition hover:opacity-95 text-sm"
                      style={{
                        backgroundColor: styles.primary,
                        color: colorScheme.textInverted || '#fff',
                        paddingTop: '0.75rem',
                        paddingBottom: '0.75rem',
                      }}
                    >
                      {submitting ? 'Submitting…' : 'Submit testimony'}
                    </Button>

                    <div className="mt-3 flex items-center justify-center gap-2 text-sm" style={{ color: styles.muted }}>
                      <Check className="h-4 w-4" />
                      We will review and approve before publishing.
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="space-y-6">
              <div
                className="rounded-2xl border p-6 lg:p-7 shadow-sm"
                style={{ borderColor: styles.border, background: styles.surface }}
              >
                <H3 className="mb-2 font-medium text-lg" style={{ color: styles.text }}>
                  Why share your story?
                </H3>
                <BodyMD className="leading-relaxed text-sm sm:text-base" style={{ color: styles.muted }}>
                  Testimonies encourage believers, strengthen faith, and give glory to God. Your story may be exactly
                  what someone needs to hear today.
                </BodyMD>

                <div className="mt-6 grid gap-3">
                  <InfoPill title="Glorifies God" description="Highlights His faithfulness and power." styles={styles} />
                  <InfoPill title="Encourages others" description="Builds faith through real stories." styles={styles} />
                  <InfoPill title="Strengthens you" description="Remembering grows gratitude and trust." styles={styles} />
                </div>
              </div>

              <div
                className="rounded-2xl border p-6 lg:p-7 shadow-sm"
                style={{ borderColor: styles.border, background: styles.surface }}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border p-2" style={{ borderColor: styles.border, background: styles.bg }}>
                    <Quote className="h-5 w-5" style={{ color: styles.primary }} />
                  </div>
                  <div>
                    <p className="italic leading-relaxed text-sm sm:text-base" style={{ color: styles.text }}>
                      “They overcame him by the blood of the Lamb and by the word of their testimony.”
                    </p>
                    <BodySM className="mt-2" style={{ color: styles.muted }}>
                      Revelation 12:11
                    </BodySM>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border p-4" style={{ borderColor: styles.border, background: styles.bg }}>
                  <BodySM style={{ color: styles.muted }}>
                    Privacy note: If you submit anonymously, your name and photo will be hidden. Email is collected for
                    verification only.
                  </BodySM>
                </div>
              </div>
            </div>
          </GridboxLayout>
      </Container>
      </Section>
      <BaseModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        title="Welcome to Testimonies"
        subtitle="Share what God has done or be encouraged by others."
        maxWidth="max-w-lg"
        showHandle
        forceBottomSheet
      >
        <div className="space-y-4 text-white/80">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-2xl overflow-hidden border border-white/15 bg-black/70">
              <Image src={WisdomeHouseLogo} alt="The Wisdom House" fill className="object-contain p-2" />
            </div>
            <div>
              <BodySM className="text-white font-semibold">The Wisdom House Church</BodySM>
              <Caption className="text-white/60">Testimonies • Share & be inspired</Caption>
            </div>
          </div>
          <BodyMD className="text-white/80 leading-relaxed">
            We celebrate every story of God’s faithfulness. Tell us what He has done, or read how He’s moving among our global family.
          </BodyMD>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowWelcome(false)}
              className="rounded-xl px-4 py-2 bg-white text-black font-semibold text-sm hover:opacity-90 transition"
            >
              Continue
            </button>
            <button
              onClick={() => {
                setShowWelcome(false);
                document.getElementById('testimony-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl px-4 py-2 border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition"
            >
              Share my testimony
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}

/* =============================================================================
   Small components
============================================================================= */

function CheckboxRow({
  name,
  checked,
  onChange,
  title,
  description,
  icon,
  required,
  styles,
}: {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  required?: boolean;
  styles: { border: string; bg: string; surface: string; text: string; muted: string; primary: string };
}) {
  return (
    <label
      className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition hover:opacity-95"
      style={{ borderColor: styles.border, background: styles.bg }}
    >
      <span
        className="mt-0.5 flex h-5 w-5 items-center justify-center rounded border"
        style={{
          borderColor: checked ? styles.primary : styles.border,
          background: checked ? styles.primary : styles.surface,
        }}
      >
        {checked ? <Check className="h-3.5 w-3.5" style={{ color: '#fff' }} /> : null}
      </span>

      <input type="checkbox" name={name} checked={checked} onChange={onChange} required={required} className="sr-only" />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          {icon ? <span style={{ color: styles.muted }}>{icon}</span> : null}
          <BodySM className="font-semibold" style={{ color: styles.text }}>
            {title}
            {required ? <span style={{ color: styles.muted }}> *</span> : null}
          </BodySM>
        </div>
        {description ? <BodySM style={{ color: styles.muted }}>{description}</BodySM> : null}
      </div>
    </label>
  );
}

function InfoPill({
  title,
  description,
  styles,
}: {
  title: string;
  description: string;
  styles: { border: string; bg: string; text: string; muted: string; primary: string };
}) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: styles.border, background: styles.bg }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <BodyMD className="font-medium text-sm sm:text-base" style={{ color: styles.text }}>
            {title}
          </BodyMD>
          <BodySM className="text-xs sm:text-sm" style={{ color: styles.muted }}>
            {description}
          </BodySM>
        </div>
        <div
          className="rounded-lg border px-2 py-1 text-xs font-semibold"
          style={{ borderColor: styles.border, color: styles.primary, background: '#ffffff00' }}
        >
          Impact
        </div>
      </div>
    </div>
  );
}
