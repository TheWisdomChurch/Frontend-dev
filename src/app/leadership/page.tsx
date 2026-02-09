/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, H3, H4, P, Caption, SmallText } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';
import { leaders, ministryLeadersData, deaconsData } from '@/lib/data';
import { Leader, MinistryLeader } from '@/lib/types';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Section, Container, GridboxLayout, FlexboxLayout } from '@/components/layout';

import {
  Heart,
  Calendar,
  X,
  Loader2,
  MapPin,
  Phone,
  ChevronRight,
  User,
} from 'lucide-react';

import CustomButton from '@/components/utils/buttons/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import type { ColorScheme } from '@/components/colors/colorScheme';

/* ----------------------------------------------------------------------------
   Small utilities
----------------------------------------------------------------------------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calc = () => setIsMobile(window.innerWidth < breakpoint);
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [breakpoint]);

  return isMobile;
}

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original || 'unset';
    };
  }, [locked]);
}

/* ----------------------------------------------------------------------------
   DETAIL MODAL
----------------------------------------------------------------------------- */
interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Leader | null;
  type: 'pastor' | 'deacon' | 'ministry';
  colorScheme: ColorScheme;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data, type, colorScheme }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile(768);
  useLockBodyScroll(isOpen);

  // Animate on open
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const el = modalRef.current;
    const tl = gsap.timeline();

    if (isMobile) {
      tl.fromTo(el, { y: '100%', opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
    } else {
      tl.fromTo(el, { opacity: 0, scale: 0.95, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' });
    }

    return () => {
      tl.kill();
    };
  }, [isOpen, isMobile]);

  const getTypeColor = () => {
    switch (type) {
      case 'pastor':
        return colorScheme.primary;
      case 'deacon':
        return colorScheme.success;
      case 'ministry':
        return colorScheme.info;
      default:
        return colorScheme.primary;
    }
  };

  const typeColor = getTypeColor();

  const handleClose = useCallback(() => {
    const el = modalRef.current;
    if (!el) {
      onClose();
      return;
    }

    if (isMobile) {
      gsap.to(el, {
        y: '100%',
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      gsap.to(el, {
        opacity: 0,
        scale: 0.95,
        y: 30,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: onClose,
      });
    }
  }, [isMobile, onClose]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) handleClose();
    },
    [handleClose]
  );

  if (!isOpen || !data) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 ${isMobile ? 'pb-0' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Leader details"
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border
          ${isMobile ? 'rounded-t-3xl rounded-b-none max-h-[90vh]' : 'rounded-3xl max-w-3xl max-h-[90vh]'}
        `}
        style={{
          backgroundColor: colorScheme.surface,
          borderColor: typeColor,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: typeColor }} />
          </div>
        )}

        <div className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 lg:p-8 max-h-[calc(90vh-80px)]'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2
                className={`mb-2 tracking-tight font-black font-bricolage ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'}`}
                style={{ color: typeColor }}
              >
                {data.name}
              </h2>

              <div className="flex items-center gap-2">
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: `${typeColor}1A`, color: typeColor }}
                >
                  {data.role}
                </div>

                <div
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: `${typeColor}0D`, color: typeColor }}
                >
                  {type === 'pastor' ? 'Pastoral Team' : type === 'deacon' ? 'Deacons Board' : 'Ministry Leader'}
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className={`rounded-xl transition-colors duration-300 flex-shrink-0 ${isMobile ? 'p-1.5' : 'p-2'}`}
              style={{ color: typeColor, backgroundColor: `${typeColor}1A` }}
              type="button"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-full lg:w-64">
                <div className="relative w-40 h-40 lg:w-64 lg:h-64 rounded-2xl overflow-hidden mx-auto lg:mx-0">
                  <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 256px"
                    quality={85}
                  />
                </div>

                <div
                  className="absolute -inset-4 rounded-2xl blur-xl opacity-30 -z-10"
                  style={{ backgroundColor: typeColor }}
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: typeColor }}>
                  About {data.name.split(' ')[0]}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: colorScheme.text }}>
                  {data.description}
                </p>
              </div>

              <div
                className="rounded-xl p-4 mb-6"
                style={{
                  backgroundColor: `${typeColor}08`,
                  border: `1px solid ${typeColor}20`,
                }}
              >
                <h4 className="text-sm font-semibold mb-2" style={{ color: typeColor }}>
                  Ministry Focus
                </h4>
                <p className="text-sm" style={{ color: colorScheme.text }}>
                  {data.description.includes('oversees') || data.description.includes('coordinates')
                    ? data.description
                    : `Dedicated to serving through ${data.role.toLowerCase()} with a focus on excellence and faithfulness.`}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: `${typeColor}1A` }}>
                  <User className="w-4 h-4" style={{ color: typeColor }} />
                  <span className="text-xs" style={{ color: colorScheme.text }}>
                    {type === 'pastor' ? 'Pastoral Care' : type === 'deacon' ? 'Member Support' : 'Ministry Leadership'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

/* ----------------------------------------------------------------------------
   VISIT MODAL
----------------------------------------------------------------------------- */
interface VisitChurchModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorScheme: ColorScheme;
}

const VisitChurchModal: React.FC<VisitChurchModalProps> = ({ isOpen, onClose, colorScheme }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile(768);
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const el = modalRef.current;

    if (isMobile) {
      gsap.fromTo(el, { y: '100%', opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
    } else {
      gsap.fromTo(el, { opacity: 0, scale: 0.95, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' });
    }
  }, [isOpen, isMobile]);

  const handleClose = useCallback(() => {
    const el = modalRef.current;
    if (!el) return onClose();

    if (isMobile) {
      gsap.to(el, { y: '100%', opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: onClose });
    } else {
      gsap.to(el, { opacity: 0, scale: 0.95, y: 30, duration: 0.25, ease: 'power2.in', onComplete: onClose });
    }
  }, [isMobile, onClose]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) handleClose();
    },
    [handleClose]
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 ${isMobile ? 'pb-0' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Visit church"
    >
      <div
        ref={modalRef}
        className={`w-full mx-auto overflow-hidden border ${isMobile ? 'rounded-t-3xl rounded-b-none max-h-[90vh]' : 'rounded-3xl max-w-2xl max-h-[90vh]'}`}
        style={{ backgroundColor: colorScheme.surface, borderColor: colorScheme.primary }}
        onClick={(e) => e.stopPropagation()}
      >
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
          </div>
        )}

        <div className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 lg:p-8 max-h-[calc(90vh-80px)]'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`mb-2 tracking-tight font-black font-bricolage ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'}`} style={{ color: colorScheme.primary }}>
                Visit Our Church
              </h2>
              <p className="text-sm" style={{ color: colorScheme.text }}>
                You can worship with us either onsite or online but we will love to meet you in person
              </p>
            </div>

            <button
              onClick={handleClose}
              className={`rounded-xl transition-colors duration-300 flex-shrink-0 ${isMobile ? 'p-1.5' : 'p-2'}`}
              style={{ color: colorScheme.primary, backgroundColor: colorScheme.opacity.primary10 }}
              type="button"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl p-3 flex-shrink-0" style={{ backgroundColor: colorScheme.opacity.primary10 }}>
                <MapPin className="w-5 h-5" style={{ color: colorScheme.primary }} />
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: colorScheme.primary }}>
                  Our Location
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: colorScheme.text }}>
                  Honors gardens, opposite dominion headquarters lagos,
                  <br />
                  Alasia bustop, Lekki Epe expressway,
                  <br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-xl p-3 flex-shrink-0" style={{ backgroundColor: colorScheme.opacity.primary10 }}>
                <Phone className="w-5 h-5" style={{ color: colorScheme.primary }} />
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: colorScheme.primary }}>
                  For More Information
                </h3>
                <p className="text-sm" style={{ color: colorScheme.text }}>
                  Contact us: 07069995333
                </p>
              </div>
            </div>

            <div
              className="rounded-xl p-4 border text-sm"
              style={{ backgroundColor: colorScheme.opacity.primary10, borderColor: colorScheme.opacity.primary20 }}
            >
              <p style={{ color: colorScheme.primary }}>
                <span className="font-semibold">Note:</span> We welcome you to join our worship services and experience the warmth of our
                church family. Whether you&apos;re visiting for the first time or looking for a spiritual home, we&apos;re excited to meet you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ----------------------------------------------------------------------------
   PRAYER MODAL
----------------------------------------------------------------------------- */
interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorScheme: ColorScheme;
}

const PrayerModal: React.FC<PrayerModalProps> = ({ isOpen, onClose, colorScheme }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile(768);
  useLockBodyScroll(isOpen);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    prayerRequest: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    prayerRequest: '',
  });

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const el = modalRef.current;

    if (isMobile) {
      gsap.fromTo(el, { y: '100%', opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
    } else {
      gsap.fromTo(el, { opacity: 0, scale: 0.95, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' });
    }
  }, [isOpen, isMobile]);

  const handleClose = useCallback(() => {
    const el = modalRef.current;
    if (!el) return onClose();

    if (isMobile) {
      gsap.to(el, { y: '100%', opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: onClose });
    } else {
      gsap.to(el, { opacity: 0, scale: 0.95, y: 30, duration: 0.25, ease: 'power2.in', onComplete: onClose });
    }
  }, [isMobile, onClose]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) handleClose();
    },
    [handleClose]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [formErrors]
  );

  const validateForm = useCallback(() => {
    const errors = { name: '', email: '', prayerRequest: '' };

    if (!formData.name.trim()) errors.name = 'Name is required';

    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    if (!formData.prayerRequest.trim()) errors.prayerRequest = 'Prayer request is required';
    else if (formData.prayerRequest.trim().length < 10) errors.prayerRequest = 'Please provide more details about your prayer request';

    setFormErrors(errors);
    return !Object.values(errors).some((e) => e !== '');
  }, [formData]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 700));
        // TODO: send to backend
        setFormData({ name: '', email: '', prayerRequest: '' });
        handleClose();
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, handleClose]
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 ${isMobile ? 'pb-0' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Prayer request"
    >
      <div
        ref={modalRef}
        className={`w-full mx-auto overflow-hidden border ${isMobile ? 'rounded-t-3xl rounded-b-none max-h-[90vh]' : 'rounded-3xl max-w-2xl max-h-[90vh]'}`}
        style={{ backgroundColor: colorScheme.surface, borderColor: colorScheme.primary }}
        onClick={(e) => e.stopPropagation()}
      >
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
          </div>
        )}

        <div className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 lg:p-8 max-h-[calc(90vh-80px)]'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`mb-2 tracking-tight font-black font-bricolage ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'}`} style={{ color: colorScheme.primary }}>
                Prayer Request
              </h2>
              <p className="text-sm" style={{ color: colorScheme.text }}>
                Share your prayer needs with our leadership team
              </p>
            </div>

            <button
              onClick={handleClose}
              className={`rounded-xl transition-colors duration-300 flex-shrink-0 ${isMobile ? 'p-1.5' : 'p-2'}`}
              style={{ color: colorScheme.primary, backgroundColor: colorScheme.opacity.primary10 }}
              type="button"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold" style={{ color: colorScheme.primary }}>
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                style={{
                  borderColor: formErrors.name ? colorScheme.error : colorScheme.border,
                  backgroundColor: colorScheme.surfaceVariant,
                  color: colorScheme.text,
                }}
                placeholder="Enter your full name"
              />
              {formErrors.name ? <p className="mt-1 text-xs" style={{ color: colorScheme.error }}>{formErrors.name}</p> : null}
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold" style={{ color: colorScheme.primary }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                style={{
                  borderColor: formErrors.email ? colorScheme.error : colorScheme.border,
                  backgroundColor: colorScheme.surfaceVariant,
                  color: colorScheme.text,
                }}
                placeholder="Enter your email address"
              />
              {formErrors.email ? <p className="mt-1 text-xs" style={{ color: colorScheme.error }}>{formErrors.email}</p> : null}
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold" style={{ color: colorScheme.primary }}>
                Prayer Request *
              </label>
              <textarea
                name="prayerRequest"
                value={formData.prayerRequest}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm resize-none"
                style={{
                  borderColor: formErrors.prayerRequest ? colorScheme.error : colorScheme.border,
                  backgroundColor: colorScheme.surfaceVariant,
                  color: colorScheme.text,
                }}
                placeholder="Please share your prayer request in detail..."
              />
              {formErrors.prayerRequest ? <p className="mt-1 text-xs" style={{ color: colorScheme.error }}>{formErrors.prayerRequest}</p> : null}
            </div>

            <div className="rounded-xl p-3 border text-sm" style={{ backgroundColor: colorScheme.opacity.primary10, borderColor: colorScheme.opacity.primary20 }}>
              <p style={{ color: colorScheme.primary }}>
                <span className="font-semibold">Note:</span> Our leadership team will pray for your request and may reach out to you for further guidance.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isMobile ? 'py-3 text-base' : 'py-4 text-lg'}`}
              style={{ backgroundColor: colorScheme.primary, color: colorScheme.buttonText }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" style={{ color: colorScheme.buttonText }} />
                  <span className="font-bold text-sm">Submitting Prayer Request...</span>
                </span>
              ) : (
                <span className="font-semibold">Submit Prayer Request</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ----------------------------------------------------------------------------
   CARD
----------------------------------------------------------------------------- */
function PersonCard({ item, colorScheme, addToRefs, type, onReadMore }: any) {
  const getTypeColor = () => {
    switch (type) {
      case 'pastor':
        return colorScheme.primary;
      case 'deacon':
        return colorScheme.success;
      case 'ministry':
        return colorScheme.info;
      default:
        return colorScheme.primary;
    }
  };

  const typeColor = getTypeColor();

  return (
    <div
      ref={(element) => {
        if (element && addToRefs) addToRefs(element);
      }}
      className="group w-full"
    >
      <div
        className="bg-card/95 backdrop-blur-sm rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 border border-border/20 relative overflow-hidden flex flex-col h-full shadow-lg hover:shadow-2xl"
        style={{
          backgroundColor: colorScheme.card,
          borderColor: `${colorScheme.border}33`,
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${typeColor}08, ${typeColor}05)`,
          }}
        />

        <div className="flex justify-center mb-4 flex-shrink-0">
          <div className="relative">
            <div
              className="absolute -inset-2 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle, ${typeColor} 0%, transparent 70%)`,
              }}
            />

            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white/90 transform group-hover:scale-105 transition-transform duration-500"
              style={{ borderColor: typeColor, backgroundColor: colorScheme.surface }}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={128}
                height={128}
                className="object-cover transition-all duration-700 group-hover:scale-110"
                priority
                quality={85}
              />
            </div>

            <div
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap z-10 border border-white/20 backdrop-blur-sm"
              style={{ backgroundColor: typeColor, color: colorScheme.buttonText }}
            >
              {item.role}
            </div>
          </div>
        </div>

        <div className="text-center pt-6 relative z-10 flex flex-col flex-grow">
          <SmallText
            weight="semibold"
            smWeight="bold"
            style={{ color: colorScheme.heading }}
            useThemeColor={false}
            className="text-base sm:text-lg mb-2 transform group-hover:scale-105 transition-transform duration-300 line-clamp-1"
          >
            {item.name}
          </SmallText>

          <Caption
            className="px-1 transition-all duration-500 group-hover:opacity-100 line-clamp-3 leading-relaxed mb-4 flex-grow min-h-[4.5rem] flex items-center justify-center"
            style={{ color: colorScheme.textSecondary }}
            useThemeColor={false}
          >
            {item.description}
          </Caption>

          <button
            onClick={() => onReadMore(item)}
            className="mt-auto w-full rounded-xl py-2.5 px-4 text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-md group/btn flex items-center justify-center gap-2"
            style={{ backgroundColor: `${typeColor}1A`, color: typeColor }}
            type="button"
          >
            <span>Read More</span>
            <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   PAGE
----------------------------------------------------------------------------- */
const LeadersPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const pastoralHeaderRef = useRef<HTMLHeadingElement>(null);
  const deaconsHeaderRef = useRef<HTMLHeadingElement>(null);
  const ministryHeaderRef = useRef<HTMLHeadingElement>(null);
  const philosophyRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isVisitChurchModalOpen, setIsVisitChurchModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [selectedType, setSelectedType] = useState<'pastor' | 'deacon' | 'ministry'>('pastor');

  const { colorScheme } = useTheme();

  // Register GSAP plugin once (client only)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  const handleReadMore = useCallback((leader: Leader, type: 'pastor' | 'deacon' | 'ministry') => {
    setSelectedLeader(leader);
    setSelectedType(type);
    setDetailModalOpen(true);
  }, []);

  const addToRefs = useCallback((element: HTMLDivElement) => {
    if (element && !cardsRef.current.includes(element)) cardsRef.current.push(element);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: colorScheme.pageBackground }}>
      <HeroSection
        title="Our Leadership"
        subtitle="Guided by Servant Leaders"
        description="Meet the dedicated team of pastors, deacons, and leaders who serve our church family with wisdom, compassion, and commitment to God's calling."
        backgroundImage={hero_bg_2.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      <Section
        ref={sectionRef}
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: colorScheme.pageBackground }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{ backgroundColor: colorScheme.primary }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-15 animate-pulse delay-1000"
            style={{ backgroundColor: colorScheme.primaryDark }}
          />
        </div>

        <Container size="xl" className="relative z-10">
          <FlexboxLayout direction="column" justify="center" align="center" gap="md" className="text-center pt-8 sm:pt-12 lg:pt-16 pb-4 sm:pb-6 lg:pb-8">
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"
                style={{ background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})` }}
              />
              <H2
                ref={headingRef}
                className="leading-tight relative"
                style={{ color: colorScheme.heading }}
                useThemeColor={false}
                weight="black"
                smWeight="black"
              >
                Meet Our Leadership Team
              </H2>
            </div>

            <Caption
              ref={descriptionRef}
              className="max-w-3xl mx-auto leading-relaxed mt-2 px-4 sm:px-6 lg:px-0 text-base sm:text-lg font-light"
              style={{ color: colorScheme.textSecondary }}
              useThemeColor={false}
            >
              God has blessed us with faithful leaders who shepherd our congregation with love and dedication to God&apos;s Word.
            </Caption>
          </FlexboxLayout>

          <div ref={contentRef}>
            {/* Pastors */}
            <div className="w-full mb-8 lg:mb-12">
              <div className="relative flex justify-center mb-6">
                <H4
                  ref={pastoralHeaderRef}
                  className="text-center relative inline-block"
                  style={{ color: colorScheme.heading }}
                  useThemeColor={false}
                  weight="bold"
                  smWeight="extrabold"
                >
                  Pastoral Team
                </H4>
              </div>

              <GridboxLayout columns={3} gap="lg" responsive={{ sm: 1, md: 2, lg: 3 }} className="w-full items-stretch">
                {leaders.map((leader: Leader) => (
                  <PersonCard
                    key={`pastoral-${leader.id}`}
                    item={leader}
                    colorScheme={colorScheme}
                    addToRefs={addToRefs}
                    type="pastor"
                    onReadMore={(item: Leader) => handleReadMore(item, 'pastor')}
                  />
                ))}
              </GridboxLayout>
            </div>

            {/* Deacons */}
            <div className="w-full mb-8 lg:mb-12">
              <div className="relative flex justify-center mb-6">
                <H4
                  ref={deaconsHeaderRef}
                  className="text-center relative inline-block"
                  style={{ color: colorScheme.heading }}
                  useThemeColor={false}
                  weight="bold"
                  smWeight="extrabold"
                >
                  Deacons & Deaconesses
                </H4>
              </div>

              <Caption className="text-center max-w-3xl mx-auto mb-6 text-base pb-8" style={{ color: colorScheme.textSecondary }} useThemeColor={false}>
                Our dedicated deacons and deaconesses serve in various ministries, supporting the pastoral team and meeting the practical needs of our church family.
              </Caption>

              <GridboxLayout columns={4} gap="lg" responsive={{ sm: 1, md: 2, lg: 3, xl: 4 }} className="w-full items-stretch">
                {deaconsData.map((deacon: Leader) => (
                  <PersonCard
                    key={`deacon-${deacon.id}`}
                    item={deacon}
                    colorScheme={colorScheme}
                    addToRefs={addToRefs}
                    type="deacon"
                    onReadMore={(item: Leader) => handleReadMore(item, 'deacon')}
                  />
                ))}
              </GridboxLayout>
            </div>

            {/* Ministry leaders */}
            <div className="w-full mb-8 lg:mb-12">
              <div className="relative flex justify-center mb-6">
                <H4
                  ref={ministryHeaderRef}
                  className="text-center relative inline-block"
                  style={{ color: colorScheme.heading }}
                  useThemeColor={false}
                  weight="bold"
                  smWeight="extrabold"
                >
                  Ministry Department Leaders
                </H4>
              </div>

              <GridboxLayout columns={3} gap="lg" responsive={{ sm: 1, md: 2, lg: 3 }} className="w-full items-stretch">
                {ministryLeadersData.map((leader: MinistryLeader) => (
                  <PersonCard
                    key={`ministry-${leader.id}`}
                    item={leader}
                    colorScheme={colorScheme}
                    addToRefs={addToRefs}
                    type="ministry"
                    onReadMore={(item: Leader) => handleReadMore(item, 'ministry')}
                  />
                ))}
              </GridboxLayout>
            </div>

            {/* CTAs */}
            <FlexboxLayout direction="column" justify="center" align="center" gap="md" className="pt-0 pb-4 text-center">
              <H3 className="text-xl sm:text-2xl font-bold" style={{ color: colorScheme.heading }} useThemeColor={false}>
                Connect With Our Church Family
              </H3>
              <Caption className="max-w-2xl mx-auto text-base" style={{ color: colorScheme.textSecondary }} useThemeColor={false}>
                Our leaders are here to walk with you in your faith journey. Visit us for worship or reach out for spiritual guidance.
              </Caption>

              <FlexboxLayout justify="center" gap="md" className="flex-wrap mt-4">
                <CustomButton
                  onClick={() => setIsVisitChurchModalOpen(true)}
                  variant="primary"
                  size="md"
                  curvature="xl"
                  elevated
                  leftIcon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                    color: colorScheme.buttonText,
                  }}
                >
                  Visit Our Church
                </CustomButton>

                <CustomButton
                  onClick={() => setIsPrayerModalOpen(true)}
                  variant="outline"
                  size="md"
                  curvature="xl"
                  leftIcon={<Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-bold border-2"
                  style={{
                    borderColor: colorScheme.primary,
                    color: colorScheme.heading,
                    backgroundColor: `${colorScheme.primary}0A`,
                  }}
                >
                  Get Prayer
                </CustomButton>
              </FlexboxLayout>
            </FlexboxLayout>
          </div>
        </Container>
      </Section>

      {/* Philosophy section (unchanged visual intent) */}
      <Section ref={philosophyRef} padding="lg" fullHeight={false} style={{ backgroundColor: colorScheme.backgroundSecondary }}>
        <Container size="lg">
          <div className="max-w-5xl mx-auto">
            <div
              className="rounded-2xl p-6 lg:p-8"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.surfaceVariant}, ${colorScheme.surface})`,
                border: `1px solid ${colorScheme.border}33`,
              }}
            >
              <H3 className="text-center mb-8 text-2xl font-bold" style={{ color: colorScheme.heading }}>
                Our Leadership Philosophy
              </H3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colorScheme.primary }}>
                    <Calendar className="w-6 h-6" style={{ color: colorScheme.buttonText }} />
                  </div>
                  <H4 className="text-lg font-bold mb-3" style={{ color: colorScheme.heading }}>
                    Servant Leadership
                  </H4>
                  <P style={{ color: colorScheme.text }}>
                    We believe leadership is about serving others, following the example of Jesus Christ who came not to be served, but to serve.
                  </P>
                </div>

                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colorScheme.primary }}>
                    <Heart className="w-6 h-6" style={{ color: colorScheme.buttonText }} />
                  </div>
                  <H4 className="text-lg font-bold mb-3" style={{ color: colorScheme.heading }}>
                    Biblical Foundation
                  </H4>
                  <P style={{ color: colorScheme.text }}>
                    Our leaders are committed to teaching and living according to God&apos;s Word, providing spiritual guidance rooted in Scripture.
                  </P>
                </div>

                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colorScheme.primary }}>
                    <Calendar className="w-6 h-6" style={{ color: colorScheme.buttonText }} />
                  </div>
                  <H4 className="text-lg font-bold mb-3" style={{ color: colorScheme.heading }}>
                    Team Ministry
                  </H4>
                  <P style={{ color: colorScheme.text }}>
                    We work together as a team, recognizing that each leader brings unique gifts to serve the body of Christ effectively.
                  </P>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </Section>

      {/* Modals */}
      <DetailModal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedLeader(null);
        }}
        data={selectedLeader}
        type={selectedType}
        colorScheme={colorScheme}
      />

      <PrayerModal isOpen={isPrayerModalOpen} onClose={() => setIsPrayerModalOpen(false)} colorScheme={colorScheme} />

      <VisitChurchModal isOpen={isVisitChurchModalOpen} onClose={() => setIsVisitChurchModalOpen(false)} colorScheme={colorScheme} />
    </div>
  );
};

export default LeadersPage;
