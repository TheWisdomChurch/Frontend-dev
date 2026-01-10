'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import Button from '@/components/utils/buttons/CustomButton';
import { Section, Container } from '@/components/layout';
import {
  ChevronRight,
  Clock,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  X,
  ChevronLeft,
  Bell,
  Check,
  AlertCircle,
  Flame,
  Play,
  Share2,
  Mail,
  Phone,
  MapPinIcon,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateButtonClick,animatePosterCard,
  animatePosterHover,
  animatePosterHoverReverse,
  animateReelCard,
  animateReelHover,
  animateReelHoverReverse,
  animateSectionEntrance,
  animateFormEntry,
  animateFormExit,
  animateInputFocus,
  animateInputBlur,
  animateSuccessMessage, } from '@/components/utils/hooks/Resource';

gsap.registerPlugin(ScrollTrigger);

interface EventData {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  location: string;
  image: string;
  bannerImage?: string;
  attendees: number;
  category: 'Outreach' | 'Conference' | 'Workshop' | 'Prayer' | 'Revival' | 'Summit';
  status: 'upcoming' | 'happening' | 'past';
  isFeatured?: boolean;
  tags?: string[];
  registerLink?: string;
  speaker?: string;
  contactPhone?: string;
}

interface ReelData {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  eventId: number;
  duration: string;
}

const sampleEvents: EventData[] = [
  {
    id: 1,
    title: 'Annual Youth Summit 2025',
    description: 'A transformative gathering for young adults featuring inspiring speakers, interactive workshops, and networking opportunities to ignite your faith and purpose.',
    shortDescription: 'Youth empowerment event',
    date: '2025-02-15',
    time: '9:00 AM - 5:00 PM',
    location: 'Convention Center Hall A',
    image: '/images/events/youth-summit.jpg',
    bannerImage: '/images/events/youth-summit-banner.jpg',
    attendees: 500,
    category: 'Summit',
    status: 'upcoming',
    isFeatured: true,
    tags: ['Youth', 'Leadership'],
    registerLink: '/register/youth-summit',
    speaker: 'Pastor John Doe',
    contactPhone: '+1-234-567-8900',
  },
  {
    id: 2,
    title: 'Community Outreach Program',
    description: 'Serve alongside neighbors in need. We will distribute essentials.',
    shortDescription: 'Community service',
    date: '2025-02-01',
    time: '8:00 AM - 1:00 PM',
    location: 'Community Center',
    image: '/images/events/outreach.jpg',
    attendees: 120,
    category: 'Outreach',
    status: 'upcoming',
    tags: ['Service', 'Community'],
    speaker: 'Pastor Mary Jane',
    contactPhone: '+1-234-567-8901',
  },
  {
    id: 3,
    title: 'Prayer & Intercession Night',
    description: 'Join us for an intimate evening of prayer and worship.',
    shortDescription: 'Prayer gathering',
    date: '2025-01-30',
    time: '7:00 PM - 8:30 PM',
    location: 'Prayer Chapel',
    image: '/images/events/prayer.jpg',
    attendees: 85,
    category: 'Prayer',
    status: 'happening',
    tags: ['Prayer', 'Worship'],
    speaker: 'Apostle Peter',
    contactPhone: '+1-234-567-8902',
  },
  {
    id: 4,
    title: 'Kingdom Builders Conference',
    description: 'Discover how to build a thriving business with kingdom values.',
    shortDescription: 'Business & faith',
    date: '2025-02-08',
    time: '10:00 AM - 4:00 PM',
    location: 'Business District Hall',
    image: '/images/events/conference.jpg',
    attendees: 350,
    category: 'Conference',
    status: 'upcoming',
    isFeatured: true,
    tags: ['Business', 'Leadership'],
    registerLink: '/register/kingdom',
    speaker: 'Dr. David Smith',
    contactPhone: '+1-234-567-8903',
  },
  {
    id: 5,
    title: 'Prophetic Encounters Workshop',
    description: 'Deep dive into understanding prophecy and divine encounters.',
    shortDescription: 'Prophecy training',
    date: '2025-02-10',
    time: '6:30 PM - 8:30 PM',
    location: 'Fellowship Hall',
    image: '/images/events/workshop.jpg',
    attendees: 200,
    category: 'Workshop',
    status: 'upcoming',
    tags: ['Workshop', 'Prophecy'],
    speaker: 'Prophet Samuel',
    contactPhone: '+1-234-567-8904',
  },
  {
    id: 6,
    title: 'Revival Fire Meeting',
    description: 'Experience the power of the Holy Spirit in an anointed service.',
    shortDescription: 'Revival service',
    date: '2025-02-12',
    time: '7:00 PM - 10:00 PM',
    location: 'Main Auditorium',
    image: '/images/events/revival.jpg',
    attendees: 1200,
    category: 'Revival',
    status: 'upcoming',
    isFeatured: true,
    tags: ['Revival', 'Healing'],
    registerLink: '/register/revival',
    speaker: 'Bishop Michael',
    contactPhone: '+1-234-567-8905',
  },
];

const sampleReels: ReelData[] = [
  {
    id: 1,
    title: 'Last Year\'s Youth Summit Highlights',
    thumbnail: '/images/reels/youth-thumb.jpg',
    videoUrl: 'https://example.com/video1.mp4',
    eventId: 1,
    duration: '2:45',
  },
  {
    id: 2,
    title: 'Community Impact Stories',
    thumbnail: '/images/reels/outreach-thumb.jpg',
    videoUrl: 'https://example.com/video2.mp4',
    eventId: 2,
    duration: '3:20',
  },
  {
    id: 3,
    title: 'Prayer Night Testimonies',
    thumbnail: '/images/reels/prayer-thumb.jpg',
    videoUrl: 'https://example.com/video3.mp4',
    eventId: 3,
    duration: '1:55',
  },
  {
    id: 4,
    title: 'Business Success Stories',
    thumbnail: '/images/reels/business-thumb.jpg',
    videoUrl: 'https://example.com/video4.mp4',
    eventId: 4,
    duration: '4:10',
  },
];

// Advertisement Poster Card
function PosterCard({ event, colorScheme, index }: { event: EventData; colorScheme: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = animatePosterCard(cardRef.current, index);
    return () => ctx.revert();
  }, [index]);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      setIsHovered(true);
      animatePosterHover(cardRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      setIsHovered(false);
      animatePosterHoverReverse(cardRef.current);
    }
  };

  const categoryColors: Record<string, string> = {
    'Outreach': '#FF6B6B',
    'Conference': '#4ECDC4',
    'Workshop': '#FFD93D',
    'Prayer': '#A29BFE',
    'Revival': '#FF6B9D',
    'Summit': '#00D2D3',
  };

  const accentColor = categoryColors[event.category] || '#3498db';

  return (
    <>
      <div
        ref={cardRef}
        className="group relative h-96 sm:h-[500px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d' as any,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Poster Image - Full Background */}
        <Image
          src={event.bannerImage || event.image || '/images/placeholder.jpg'}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Poster Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Status Badge - Top Right */}
        {event.status === 'happening' && (
          <div
            className="poster-badge absolute top-4 right-4 z-20 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold backdrop-blur-xl animate-pulse"
            style={{
              backgroundColor: '#FF6B6B80',
              color: '#ffffff',
              border: '1.5px solid #FF6B6B',
              boxShadow: '0 0 20px #FF6B6B60',
            }}
          >
            <Flame className="w-3 sm:w-4 h-3 sm:h-4" />
            LIVE
          </div>
        )}

        {/* Category Tag - Top Left */}
        <div className="absolute top-4 left-4 z-20">
          <span
            className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide backdrop-blur-md"
            style={{
              backgroundColor: `${accentColor}90`,
              color: '#ffffff',
              border: `1.5px solid ${accentColor}`,
              boxShadow: `0 8px 24px ${accentColor}40`,
            }}
          >
            {event.category}
          </span>
        </div>

        {/* Featured Badge */}
        {event.isFeatured && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              <Flame className="w-3 h-3" />
              FEATURED
            </div>
          </div>
        )}

        {/* Bottom Content - Poster Text */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
          <h3
            className="text-lg sm:text-2xl font-black text-white mb-1 line-clamp-2 leading-tight"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}
          >
            {event.title}
          </h3>

          <div className="flex items-center gap-2 mb-3 text-white/90 text-xs sm:text-sm">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span>•</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{event.time.split(' - ')[0]}</span>
          </div>

          {/* Hover Overlay - Only visible on hover */}
          <div
            className="poster-overlay absolute bottom-0 left-0 right-0 p-4 sm:p-6 pt-8 opacity-0 transition-opacity duration-300"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${accentColor}80 100%)`,
              backdropFilter: 'blur(0px)',
              pointerEvents: 'none',
            }}
          >
            <p className="text-white/90 text-xs sm:text-sm line-clamp-2 mb-4">
              {event.shortDescription}
            </p>

            <button
              onClick={() => setShowRegisterForm(true)}
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 active:scale-95 text-white"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 8px 20px ${accentColor}50`,
              }}
            >
              Register Now
            </button>
          </div>
        </div>
      </div>

      <RegistrationForm
        isOpen={showRegisterForm}
        event={event}
        colorScheme={colorScheme}
        onClose={() => setShowRegisterForm(false)}
      />
    </>
  );
}

// Registration Form Modal
interface RegistrationFormProps {
  isOpen: boolean;
  event: EventData;
  colorScheme: any;
  onClose: () => void;
}

function RegistrationForm({ isOpen, event, colorScheme, onClose }: RegistrationFormProps) {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', guests: '1' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && formRef.current) {
      animateFormEntry(formRef.current);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setShowSuccess(true);
    setTimeout(() => {
      setFormData({ fullName: '', email: '', phone: '', guests: '1' });
      setShowSuccess(false);
      onClose();
    }, 2000);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const categoryColors: Record<string, string> = {
    'Outreach': '#FF6B6B',
    'Conference': '#4ECDC4',
    'Workshop': '#FFD93D',
    'Prayer': '#A29BFE',
    'Revival': '#FF6B9D',
    'Summit': '#00D2D3',
  };

  const accentColor = categoryColors[event.category] || '#3498db';

  return (
    <div
      ref={formRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ perspective: '1000px' }}
    >
      <div
        className="form-backdrop absolute inset-0 cursor-pointer"
        onClick={onClose}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <div
        className="form-container relative z-10 w-full max-w-md sm:max-w-lg rounded-3xl p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.surface} 0%, ${colorScheme.background} 100%)`,
          border: `2px solid ${accentColor}40`,
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.4), 0 0 40px ${accentColor}30`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: `${accentColor}20`,
            color: accentColor,
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {!showSuccess ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: colorScheme.heading }}>
                Register Now
              </h2>
              <h3 className="text-base sm:text-lg font-bold mb-4" style={{ color: accentColor }}>
                {event.title}
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: colorScheme.textSecondary }}>
                Join us for an unforgettable experience. Fill in your details below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-input-group">
                <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: colorScheme.heading }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  onFocus={(e) => animateInputFocus(e.target)}
                  onBlur={(e) => animateInputBlur(e.target)}
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all duration-300"
                  style={{
                    backgroundColor: `${colorScheme.surface}`,
                    border: `1.5px solid ${colorScheme.border}40`,
                    color: colorScheme.text,
                  }}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-input-group">
                <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: colorScheme.heading }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={(e) => animateInputFocus(e.target)}
                  onBlur={(e) => animateInputBlur(e.target)}
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all duration-300"
                  style={{
                    backgroundColor: `${colorScheme.surface}`,
                    border: `1.5px solid ${colorScheme.border}40`,
                    color: colorScheme.text,
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-input-group">
                <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: colorScheme.heading }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onFocus={(e) => animateInputFocus(e.target)}
                  onBlur={(e) => animateInputBlur(e.target)}
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all duration-300"
                  style={{
                    backgroundColor: `${colorScheme.surface}`,
                    border: `1.5px solid ${colorScheme.border}40`,
                    color: colorScheme.text,
                  }}
                  placeholder="+1-234-567-8900"
                />
              </div>

              <div className="form-input-group">
                <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: colorScheme.heading }}>
                  Number of Guests
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                  style={{
                    backgroundColor: `${colorScheme.surface}`,
                    border: `1.5px solid ${colorScheme.border}40`,
                    color: colorScheme.text,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="form-input-group w-full py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 active:scale-95 disabled:opacity-50 text-white mt-6"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 12px 30px ${accentColor}50`,
                }}
              >
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: `${colorScheme.border}30` }}>
              <div className="space-y-2 text-xs sm:text-sm" style={{ color: colorScheme.textSecondary }}>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" style={{ color: accentColor }} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                  <span>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: accentColor }} />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div
                className="p-4 rounded-full animate-pulse"
                style={{
                  backgroundColor: `${accentColor}20`,
                }}
              >
                <Check className="w-8 h-8" style={{ color: accentColor }} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: colorScheme.heading }}>
              Registration Confirmed!
            </h3>
            <p style={{ color: colorScheme.textSecondary }}>
              Check your email for confirmation details. See you soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Instagram Reels Style Video Section
function ReelsSection({ reels, colorScheme }: { reels: ReelData[]; colorScheme: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState<number | null>(null);

  useEffect(() => {
    const reelElements = containerRef.current?.querySelectorAll('.reel-card');
    if (reelElements) {
      reelElements.forEach((el, index) => {
        const ctx = animateReelCard(el as HTMLElement, index);
        return () => ctx.revert();
      });
    }
  }, []);

  const handleReelMouseEnter = (e: React.MouseEvent) => {
    const reel = (e.currentTarget as HTMLElement).closest('.reel-card');
    if (reel) animateReelHover(reel as HTMLElement);
  };

  const handleReelMouseLeave = (e: React.MouseEvent) => {
    const reel = (e.currentTarget as HTMLElement).closest('.reel-card');
    if (reel) animateReelHoverReverse(reel as HTMLElement);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 400;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      <div className="mb-8">
        <h2
          className="events-title text-2xl sm:text-3xl lg:text-4xl font-black mb-3"
          style={{ color: colorScheme.heading }}
        >
          Event Highlights & Reels
        </h2>
        <p
          className="events-description text-sm sm:text-base max-w-2xl"
          style={{ color: colorScheme.textSecondary }}
        >
          Watch snippets from our previous events and get a glimpse of what to expect.
        </p>
      </div>

      <div className="relative">
        {/* Scroll Container */}
        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="reel-card flex-shrink-0 relative group w-64 sm:w-72 h-96 sm:h-[440px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
              onMouseEnter={handleReelMouseEnter}
              onMouseLeave={handleReelMouseLeave}
              onClick={() => setShowVideoPlayer(reel.id)}
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Image
                src={reel.thumbnail}
                alt={reel.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 256px, 288px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Play Button */}
              <button
                className="reel-play-button absolute inset-0 flex items-center justify-center opacity-80 transition-all duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: colorScheme.primary,
                    boxShadow: `0 8px 32px ${colorScheme.primary}50`,
                  }}
                >
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </button>

              {/* Duration Badge */}
              <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md bg-black/50 text-white">
                {reel.duration}
              </div>

              {/* Title - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2">
                  {reel.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 hidden lg:flex"
          style={{
            backgroundColor: `${colorScheme.primary}20`,
            color: colorScheme.primary,
          }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 hidden lg:flex"
          style={{
            backgroundColor: `${colorScheme.primary}20`,
            color: colorScheme.primary,
          }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowVideoPlayer(null)}
        >
          <button
            onClick={() => setShowVideoPlayer(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div
            className="relative w-full max-w-2xl aspect-video bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <Play className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Video Player Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResourceSection() {
  const { colorScheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [events] = useState<EventData[]>(sampleEvents);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (sectionRef.current) {
      animateSectionEntrance(sectionRef.current);
    }
  }, []);

  const filteredEvents = activeCategory
    ? events.filter((e) => e.category === activeCategory && e.status === 'upcoming')
    : events.filter((e) => e.status === 'upcoming');

  const categories = Array.from(new Set(events.filter((e) => e.status === 'upcoming').map((e) => e.category)));

  return (
    <Section ref={sectionRef} padding="none" className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.background} 0%, ${colorScheme.backgroundSecondary} 100%)`,
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${colorScheme.primary}20, transparent)`,
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${colorScheme.secondary}15, transparent)`,
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s',
          }}
        />
      </div>

      <Container size="xl" className={`relative z-10 ${isMobile ? 'px-4 py-12' : 'px-6 py-16 lg:py-24'}`}>
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2
            className="events-title text-2xl sm:text-3xl lg:text-4xl font-black mb-3"
            style={{ color: colorScheme.heading }}
          >
            Upcoming Events & Announcements
          </h2>
          <p
            className="events-description text-sm sm:text-base max-w-2xl mx-auto"
            style={{ color: colorScheme.textSecondary }}
          >
            Discover amazing events happening in our community. From spiritual gatherings to business conferences, find your next experience.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
          <button
            onClick={() => setActiveCategory(null)}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: activeCategory === null ? colorScheme.primary : `${colorScheme.primary}15`,
              color: activeCategory === null ? '#ffffff' : colorScheme.primary,
              boxShadow: activeCategory === null ? `0 12px 28px ${colorScheme.primary}35` : 'none',
            }}
          >
            All Events
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: activeCategory === category ? colorScheme.primary : `${colorScheme.primary}15`,
                color: activeCategory === category ? '#ffffff' : colorScheme.primary,
                boxShadow: activeCategory === category ? `0 12px 28px ${colorScheme.primary}35` : 'none',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Event Posters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
          {filteredEvents.map((event, index) => (
            <PosterCard key={event.id} event={event} colorScheme={colorScheme} index={index} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle
              className="w-12 h-12 mx-auto mb-3 opacity-50"
              style={{ color: colorScheme.textSecondary }}
            />
            <p style={{ color: colorScheme.textSecondary }}>
              No events found in this category.
            </p>
          </div>
        )}

        {/* Reels Section */}
        <div className="my-16 sm:my-24">
          <ReelsSection reels={sampleReels} colorScheme={colorScheme} />
        </div>

        {/* CTA Section */}
        <div
          className="relative text-center rounded-3xl p-8 sm:p-12"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary}12 0%, ${colorScheme.secondary}08 100%)`,
            border: `1.5px solid ${colorScheme.border}50`,
            boxShadow: `0 12px 40px ${colorScheme.primary}15, inset 0 1px 1px ${colorScheme.primary}10`,
          }}
        >
          <h3
            className="text-xl sm:text-2xl font-bold mb-3"
            style={{ color: colorScheme.heading }}
          >
            Stay Updated
          </h3>
          <p
            className="text-sm sm:text-base mb-6 max-w-lg mx-auto"
            style={{ color: colorScheme.textSecondary }}
          >
            Subscribe to get notifications about all upcoming events and announcements.
          </p>
          <Button
            variant="outline"
            className="font-bold hover:opacity-90 transition-all duration-300 active:scale-95 uppercase tracking-wide text-xs sm:text-sm"
            style={{
              backgroundColor: colorScheme.primary,
              color: '#ffffff',
              border: `1.5px solid ${colorScheme.primary}`,
              boxShadow: `0 12px 32px ${colorScheme.primary}30`,
            }}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Subscribe Now
          </Button>
        </div>
      </Container>
    </Section>
  );
}