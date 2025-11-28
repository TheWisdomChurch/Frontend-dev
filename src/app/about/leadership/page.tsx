'use client';

import { useRef, useEffect, useState } from 'react';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, H3, H4, P, SmallText, Caption } from '@/components/text';
import { hero_bg_2 } from '@/components/assets';
import { leaders, ministryLeadersData } from '@/lib/data';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leader, MinistryLeader } from '@/lib/types';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import { Heart, Calendar, X, Loader2, MapPin, Phone } from 'lucide-react';
import CustomButton from '@/components/utils/CustomButton';
import { createPortal } from 'react-dom';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* --------------------------------------------
   VISIT CHURCH MODAL COMPONENT
--------------------------------------------- */
interface VisitChurchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VisitChurchModal = ({ isOpen, onClose }: VisitChurchModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Updated color scheme to match your theme
  const colorScheme = {
    primary: '#F7DE12',
    primaryLight: '#F9E755',
    primaryDark: '#D4BC0F',
    black: '#000000',
    white: '#ffffff',
    surface: '#1a1a1a',
    border: '#333333',
    error: '#EF4444',
    opacity: {
      primary10: 'rgba(247, 222, 18, 0.1)',
      primary20: 'rgba(247, 222, 18, 0.2)',
    },
  };

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();

      if (isMobile) {
        tl.fromTo(
          modalRef.current,
          { y: '100%', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  const handleClose = () => {
    if (modalRef.current) {
      if (isMobile) {
        gsap.to(modalRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: onClose,
        });
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 30,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: onClose,
        });
      }
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 ${
        isMobile ? 'pb-0' : ''
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border
          ${
            isMobile
              ? 'rounded-t-3xl rounded-b-none max-h-[90vh]'
              : 'rounded-3xl max-w-2xl max-h-[90vh]'
          }
        `}
        style={{
          backgroundColor: colorScheme.black,
          borderColor: colorScheme.primary,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        <div
          className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 lg:p-8 max-h-[calc(90vh-80px)]'}`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2
                className={`mb-2 tracking-tight font-black font-bricolage ${
                  isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'
                }`}
                style={{ color: colorScheme.primary }}
              >
                Visit Our Church
              </h2>
              <p className="text-sm" style={{ color: colorScheme.white }}>
                You can worship with us either onsite or online but we will love
                to meet you in person
              </p>
            </div>
            <button
              onClick={handleClose}
              className={`rounded-xl transition-colors duration-300 flex-shrink-0 ${
                isMobile ? 'p-1.5' : 'p-2'
              }`}
              style={{
                color: colorScheme.primary,
                backgroundColor: colorScheme.opacity.primary10,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary10;
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Address Section */}
            <div className="flex items-start gap-4">
              <div
                className="rounded-xl p-3 flex-shrink-0"
                style={{
                  backgroundColor: colorScheme.opacity.primary10,
                }}
              >
                <MapPin
                  className="w-5 h-5"
                  style={{ color: colorScheme.primary }}
                />
              </div>
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: colorScheme.primary }}
                >
                  Our Location
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: colorScheme.white }}
                >
                  Honors gardens, opposite dominion headquarters lagos,
                  <br />
                  Alasia bustop, Lekki Epe expressway,
                  <br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex items-start gap-4">
              <div
                className="rounded-xl p-3 flex-shrink-0"
                style={{
                  backgroundColor: colorScheme.opacity.primary10,
                }}
              >
                <Phone
                  className="w-5 h-5"
                  style={{ color: colorScheme.primary }}
                />
              </div>
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: colorScheme.primary }}
                >
                  For More Information
                </h3>
                <p className="text-sm" style={{ color: colorScheme.white }}>
                  Contact us: 07069995333
                </p>
              </div>
            </div>

            {/* Note Section */}
            <div
              className="rounded-xl p-4 border text-sm"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.opacity.primary20,
              }}
            >
              <p style={{ color: colorScheme.primary }}>
                <span className="font-semibold">Note:</span> We welcome you to
                join our worship services and experience the warmth of our
                church family. Whether you're visiting for the first time or
                looking for a spiritual home, we're excited to meet you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* --------------------------------------------
   PRAYER MODAL COMPONENT
--------------------------------------------- */
interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrayerModal = ({ isOpen, onClose }: PrayerModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Updated color scheme to match your theme
  const colorScheme = {
    primary: '#F7DE12',
    primaryLight: '#F9E755',
    primaryDark: '#D4BC0F',
    black: '#000000',
    white: '#ffffff',
    surface: '#1a1a1a',
    border: '#333333',
    error: '#EF4444',
    opacity: {
      primary10: 'rgba(247, 222, 18, 0.1)',
      primary20: 'rgba(247, 222, 18, 0.2)',
    },
  };

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();

      if (isMobile) {
        tl.fromTo(
          modalRef.current,
          { y: '100%', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  const handleClose = () => {
    if (modalRef.current) {
      if (isMobile) {
        gsap.to(modalRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: onClose,
        });
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 30,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: onClose,
        });
      }
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      prayerRequest: '',
    };

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.prayerRequest.trim()) {
      errors.prayerRequest = 'Prayer request is required';
    } else if (formData.prayerRequest.trim().length < 10) {
      errors.prayerRequest =
        'Please provide more details about your prayer request';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Prayer request submitted:', formData);
      // Reset form
      setFormData({ name: '', email: '', prayerRequest: '' });
      handleClose();
      // Here you would typically show a success message
    } catch (error) {
      console.error('Error submitting prayer request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 ${
        isMobile ? 'pb-0' : ''
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border
          ${
            isMobile
              ? 'rounded-t-3xl rounded-b-none max-h-[90vh]'
              : 'rounded-3xl max-w-2xl max-h-[90vh]'
          }
        `}
        style={{
          backgroundColor: colorScheme.black,
          borderColor: colorScheme.primary,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        <div
          className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 lg:p-8 max-h-[calc(90vh-80px)]'}`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2
                className={`mb-2 tracking-tight font-black font-bricolage ${
                  isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'
                }`}
                style={{ color: colorScheme.primary }}
              >
                Prayer Request
              </h2>
              <p className="text-sm" style={{ color: colorScheme.white }}>
                Share your prayer needs with our leadership team
              </p>
            </div>
            <button
              onClick={handleClose}
              className={`rounded-xl transition-colors duration-300 flex-shrink-0 ${
                isMobile ? 'p-1.5' : 'p-2'
              }`}
              style={{
                color: colorScheme.primary,
                backgroundColor: colorScheme.opacity.primary10,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.opacity.primary10;
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                className="block mb-2 text-sm font-semibold"
                style={{ color: colorScheme.primary }}
              >
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                style={{
                  borderColor: formErrors.name
                    ? colorScheme.error
                    : colorScheme.border,
                  backgroundColor: colorScheme.surface,
                  color: colorScheme.primary,
                }}
                placeholder="Enter your full name"
              />
              {formErrors.name && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: colorScheme.error }}
                >
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className="block mb-2 text-sm font-semibold"
                style={{ color: colorScheme.primary }}
              >
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm"
                style={{
                  borderColor: formErrors.email
                    ? colorScheme.error
                    : colorScheme.border,
                  backgroundColor: colorScheme.surface,
                  color: colorScheme.primary,
                }}
                placeholder="Enter your email address"
              />
              {formErrors.email && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: colorScheme.error }}
                >
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Prayer Request */}
            <div>
              <label
                className="block mb-2 text-sm font-semibold"
                style={{ color: colorScheme.primary }}
              >
                Prayer Request *
              </label>
              <textarea
                name="prayerRequest"
                value={formData.prayerRequest}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none transition-all duration-300 text-sm resize-none"
                style={{
                  borderColor: formErrors.prayerRequest
                    ? colorScheme.error
                    : colorScheme.border,
                  backgroundColor: colorScheme.surface,
                  color: colorScheme.primary,
                }}
                placeholder="Please share your prayer request in detail..."
              />
              {formErrors.prayerRequest && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: colorScheme.error }}
                >
                  {formErrors.prayerRequest}
                </p>
              )}
            </div>

            {/* Note Section */}
            <div
              className="rounded-xl p-3 border text-sm"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.opacity.primary20,
              }}
            >
              <p style={{ color: colorScheme.primary }}>
                <span className="font-semibold">Note:</span> Our leadership team
                will pray for your request and may reach out to you for further
                spiritual guidance and support.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isMobile ? 'py-3 text-base' : 'py-4 text-lg'
              }`}
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
              onMouseEnter={(e: any) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.primaryLight;
                }
              }}
              onMouseLeave={(e: any) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                }
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    style={{ color: colorScheme.black }}
                  />
                  <span className="font-bold text-sm">
                    Submitting Prayer Request...
                  </span>
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

/* --------------------------------------------
   REUSABLE CARD COMPONENT — Futuristic & Professional
--------------------------------------------- */
function PersonCard({ item, colorScheme, mainAccentColor, addToRefs }: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      addToRefs(cardRef.current);
    }
  }, [addToRefs]);

  return (
    <div ref={cardRef} className="group w-full perspective-1000">
      {/* Futuristic Glass Card - Removed shadow, added border for mobile */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 transition-all duration-700 hover:-translate-y-3 border border-white/20 relative overflow-hidden flex flex-col h-full sm:border-0">
        {/* Animated Background Gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.primaryDark}05)`,
          }}
        />

        {/* Floating Particles */}
        <div className="absolute top-4 right-4 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping" />

        {/* Centered Circular Image with Glow */}
        <div className="flex justify-center mb-4 flex-shrink-0">
          <div className="relative">
            {/* Outer Glow Ring */}
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
              style={{
                background: `radial-gradient(circle, ${colorScheme.primary}30 0%, transparent 70%)`,
                transform: 'scale(1.1)',
              }}
            />

            {/* Image Container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white/80 transform group-hover:scale-105 transition-transform duration-500">
              <Image
                src={item.image}
                alt={item.name}
                width={128}
                height={128}
                className="object-cover transition-all duration-700 group-hover:scale-110"
                priority
              />
            </div>

            {/* Animated Role Badge */}
            <div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap z-10 border border-white/20 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                color: '#000000',
              }}
            >
              {item.role}
            </div>
          </div>
        </div>

        {/* Name & Description - Uniform Height Section */}
        <div className="text-center pt-6 relative z-10 flex flex-col flex-grow justify-start">
          <SmallText
            weight="semibold"
            smWeight="bold"
            style={{ color: mainAccentColor }}
            useThemeColor={false}
            className="text-sm sm:text-base mb-2 transform group-hover:scale-105 transition-transform duration-300"
          >
            {item.name}
          </SmallText>
          {item.description && (
            <Caption
              className="text-gray-600 opacity-90 px-1 transition-all duration-500 group-hover:opacity-100 line-clamp-3 leading-tight min-h-[3rem] flex items-center justify-center"
              useThemeColor={false}
            >
              {item.description}
            </Caption>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

const LeadersPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const pastoralHeaderRef = useRef<HTMLDivElement>(null);
  const ministryHeaderRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // Modal states - Removed Join Ministry modal
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isVisitChurchModalOpen, setIsVisitChurchModalOpen] = useState(false);

  // Updated color scheme to match your theme
  const colorScheme = {
    primary: '#F7DE12', // Your primary yellow
    primaryLight: '#F9E755', // Lighter yellow
    primaryDark: '#D4BC0F', // Darker yellow
    pageBackground: '#FFFFFF',
  };

  const mainAccentColor = '#000000';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate main header
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Animate description
      if (descriptionRef.current) {
        gsap.fromTo(
          descriptionRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Animate section headers
      [pastoralHeaderRef, ministryHeaderRef, philosophyRef].forEach(ref => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });

      // Filter out null refs and animate cards
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          {
            y: 60,
            opacity: 0,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: validCards[0],
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Hover animations for cards
        validCards.forEach(card => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -5,
              duration: 0.3,
              ease: 'power2.out',
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Add card to ref array
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const handleVisitChurch = () => {
    setIsVisitChurchModalOpen(true);
  };

  const handleConnect = () => {
    setIsPrayerModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Our Leadership"
        subtitle="Guided by Servant Leaders"
        description="Meet the dedicated team of pastors and leaders who serve our church family with wisdom, compassion, and commitment to God's calling."
        backgroundImage={hero_bg_2.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Main Leadership Section - Reduced padding */}
      <Section
        ref={sectionRef}
        padding="lg" // Changed from "xl" to "lg"
        fullHeight={false}
        style={{ backgroundColor: '#FFFFFF' }}
        className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-white"
      >
        {/* Background Elements */}
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
          {/* Header Section - Reduced padding */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md" // Reduced from "lg" to "md"
            className="text-center pt-8 sm:pt-12 lg:pt-16 pb-4 sm:pb-6 lg:pb-8" // Reduced padding
          >
            {/* Main Title with Gradient Text */}
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                }}
              />
              <H2
                ref={headingRef}
                className="leading-tight relative"
                style={{ color: mainAccentColor }}
                useThemeColor={false}
                weight="black"
                smWeight="black"
              >
                Meet Our Leadership Team
              </H2>
            </div>

            {/* Description with Reduced Margin */}
            <Caption
              ref={descriptionRef}
              className="max-w-3xl mx-auto leading-relaxed text-gray-600 mt-2 px-4 sm:px-6 lg:px-0 text-base sm:text-lg font-light" // Reduced margin and font size
              useThemeColor={false}
            >
              God has blessed us with faithful leaders who shepherd our
              congregation with love and dedication to God's Word.
            </Caption>
          </FlexboxLayout>

          <div ref={contentRef}>
            {/* Pastoral Team Section - Reduced margins */}
            <div className="w-full mb-8 lg:mb-12">
              {' '}
              {/* Reduced margin */}
              <div className="relative flex justify-center mb-6">
                {' '}
                {/* Reduced margin */}
                <H4
                  ref={pastoralHeaderRef}
                  className="text-center relative inline-block"
                  style={{ color: mainAccentColor }}
                  useThemeColor={false}
                  weight="bold"
                  smWeight="extrabold"
                >
                  Pastoral Team
                  {/* Underline Animation */}
                  <div
                    className="absolute -bottom-2 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: colorScheme.primary }}
                  />
                </H4>
              </div>
              <GridboxLayout
                columns={3}
                gap="lg" // Reduced from "xl" to "lg"
                responsive={{ sm: 1, md: 2, lg: 3 }}
                className="w-full items-stretch"
              >
                {leaders.map((leader: Leader) => (
                  <PersonCard
                    key={`pastoral-${leader.id}`}
                    item={leader}
                    colorScheme={colorScheme}
                    mainAccentColor={mainAccentColor}
                    addToRefs={addToRefs}
                  />
                ))}
              </GridboxLayout>
            </div>

            {/* Ministry Leaders Section - Reduced margins */}
            <div className="w-full mb-8 lg:mb-12">
              {' '}
              {/* Reduced margin */}
              <div className="relative flex justify-center mb-6">
                {' '}
                {/* Reduced margin */}
                <H4
                  ref={ministryHeaderRef}
                  className="text-center relative inline-block"
                  style={{ color: mainAccentColor }}
                  useThemeColor={false}
                  weight="bold"
                  smWeight="extrabold"
                >
                  Ministry Department Leaders
                  {/* Underline Animation */}
                  <div
                    className="absolute -bottom-2 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: colorScheme.primary }}
                  />
                </H4>
              </div>
              <GridboxLayout
                columns={3}
                gap="lg" // Reduced from "xl" to "lg"
                responsive={{ sm: 1, md: 2, lg: 3 }}
                className="w-full items-stretch"
              >
                {ministryLeadersData.map((leader: MinistryLeader) => (
                  <PersonCard
                    key={`ministry-${leader.id}`}
                    item={leader}
                    colorScheme={colorScheme}
                    mainAccentColor={mainAccentColor}
                    addToRefs={addToRefs}
                  />
                ))}
              </GridboxLayout>
            </div>

            {/* Action Call Section - Significantly reduced padding */}
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md" // Reduced from "lg" to "md"
              className="pt-0 pb-4 text-center" // Drastically reduced padding
            >
              <H3
                className="text-xl sm:text-2xl font-bold" // Reduced font size
                style={{ color: mainAccentColor }}
                useThemeColor={false}
              >
                Connect With Our Church Family
              </H3>
              <Caption
                className="max-w-2xl mx-auto text-gray-600 text-base" // Reduced font size
                useThemeColor={false}
              >
                Our leaders are here to walk with you in your faith journey.
                Visit us for worship or reach out for spiritual guidance.
              </Caption>

              <FlexboxLayout
                justify="center"
                gap="md"
                className="flex-wrap mt-4" // Reduced margin
              >
                <div className="relative group">
                  <CustomButton
                    onClick={handleVisitChurch}
                    variant="primary"
                    size="md" // Reduced from "lg" to "md"
                    curvature="xl"
                    elevated
                    leftIcon={
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    }
                    className="group relative px-4 sm:px-6 py-2 sm:py-3 text-sm font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
                    style={{
                      background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                      color: '#000000',
                    }}
                  >
                    Visit Our Church
                  </CustomButton>
                </div>

                <div className="relative group">
                  <CustomButton
                    onClick={handleConnect}
                    variant="outline"
                    size="md" // Reduced from "lg" to "md"
                    curvature="xl"
                    leftIcon={
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    }
                    className="group relative px-4 sm:px-6 py-2 sm:py-3 text-sm font-bold border-2 backdrop-blur-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    style={{
                      borderColor: colorScheme.primary,
                      color: mainAccentColor,
                    }}
                  >
                    Get Prayer
                  </CustomButton>
                </div>
              </FlexboxLayout>
            </FlexboxLayout>
          </div>
        </Container>
      </Section>

      {/* Leadership Philosophy Section - Reduced padding */}
      <Section
        ref={philosophyRef}
        padding="lg" // Changed from "xl" to "lg"
        fullHeight={false}
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <Container size="lg">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-yellow-50 rounded-2xl p-6 lg:p-8">
              {' '}
              {/* Reduced padding */}
              <H3 className="text-center mb-8 text-2xl font-bold text-gray-900">
                {' '}
                {/* Reduced margin and font size */}
                Our Leadership Philosophy
              </H3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {' '}
                {/* Reduced gap */}
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {' '}
                    {/* Reduced size */}
                    <Calendar className="w-6 h-6 text-gray-900" />{' '}
                    {/* Reduced icon size */}
                  </div>
                  <H4 className="text-lg font-bold mb-3 text-gray-900">
                    {' '}
                    {/* Reduced font size and margin */}
                    Servant Leadership
                  </H4>
                  <P className="text-gray-700 text-sm">
                    {' '}
                    {/* Reduced font size */}
                    We believe leadership is about serving others, following the
                    example of Jesus Christ who came not to be served, but to
                    serve.
                  </P>
                </div>
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {' '}
                    {/* Reduced size */}
                    <Heart className="w-6 h-6 text-gray-900" />{' '}
                    {/* Reduced icon size */}
                  </div>
                  <H4 className="text-lg font-bold mb-3 text-gray-900">
                    {' '}
                    {/* Reduced font size and margin */}
                    Biblical Foundation
                  </H4>
                  <P className="text-gray-700 text-sm">
                    {' '}
                    {/* Reduced font size */}
                    Our leaders are committed to teaching and living according
                    to God's Word, providing spiritual guidance rooted in
                    Scripture.
                  </P>
                </div>
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {' '}
                    {/* Reduced size */}
                    <Calendar className="w-6 h-6 text-gray-900" />{' '}
                    {/* Reduced icon size */}
                  </div>
                  <H4 className="text-lg font-bold mb-3 text-gray-900">
                    {' '}
                    {/* Reduced font size and margin */}
                    Team Ministry
                  </H4>
                  <P className="text-gray-700 text-sm">
                    {' '}
                    {/* Reduced font size */}
                    We work together as a team, recognizing that each leader
                    brings unique gifts to serve the body of Christ effectively.
                  </P>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Modals - Removed Join Ministry modal */}
      <PrayerModal
        isOpen={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
      />

      <VisitChurchModal
        isOpen={isVisitChurchModalOpen}
        onClose={() => setIsVisitChurchModalOpen(false)}
      />
    </div>
  );
};

export default LeadersPage;
