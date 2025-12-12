'use client';

import { 
  useEffect, 
  useRef, 
  useState, 
  useCallback,
  useLayoutEffect,
  useMemo
} from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ChevronDown, X } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { communityLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '../assets';
import { useWindowSize } from '@/components/utils/hooks/useWindowSize';
import { responsive } from '@/lib/responsivee';
import { H4, BodyMD, MediumText, Caption } from '@/components/text';

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export default function JoinCommunityModal({
  isOpen,
  onClose,
}: JoinCommunityModalProps) {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();

  const viewport: ViewportSize = useMemo(() => {
    if (!windowSize.width) return 'mobile';
    if (windowSize.width < 640) return 'mobile';
    if (windowSize.width < 1024) return 'tablet';
    return 'desktop';
  }, [windowSize.width]);


  const colors = useMemo(() => ({
    background: colorScheme.black,
    text: {
      primary: colorScheme.primary,
      secondary: colorScheme.white,
      muted: 'rgba(255, 255, 255, 0.7)'
    },
    button: {
      background: colorScheme.primary,
      text: colorScheme.black,
      hover: colorScheme.opacity || colorScheme.primary
    },
    border: {
      default: colorScheme.border,
      active: colorScheme.primary,
      input: colorScheme.border
    },
    overlay: 'rgba(0, 0, 0, 0.85)',
    backdrop: 'rgba(0, 0, 0, 0.7)'
  }), [colorScheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (isOpen && mounted) {
      const scrollY = window.scrollY;
      const body = document.body;
      
      const originalStyles = {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        height: body.style.height,
        touchAction: body.style.touchAction
      };

      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.height = '100%';
      body.style.touchAction = 'none';

      document.documentElement.dataset.scrollY = scrollY.toString();

      return () => {
        Object.entries(originalStyles).forEach(([key, value]) => {
          body.style[key as any] = value;
        });

        const scrollYValue = parseInt(document.documentElement.dataset.scrollY || '0');
        window.scrollTo(0, scrollYValue);
        delete document.documentElement.dataset.scrollY;
      };
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen || !modalRef.current || !backdropRef.current) return;

    const modal = modalRef.current;
    const backdrop = backdropRef.current;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.4 }
    });

    if (viewport === 'mobile') {
      tl.fromTo(backdrop, 
        { opacity: 0 },
        { opacity: 1 }
      )
      .fromTo(modal,
        { y: '100%', opacity: 0 },
        { y: 0, opacity: 1 },
        '<'
      );
    } else {
      tl.fromTo(backdrop,
        { opacity: 0 },
        { opacity: 1 }
      )
      .fromTo(modal,
        { 
          scale: 0.9, 
          opacity: 0,
          y: 20 
        },
        { 
          scale: 1, 
          opacity: 1,
          y: 0 
        },
        '<'
      );
    }

    return () => {
      tl.kill();
    };
  }, [isOpen, viewport]);

  const handleClose = useCallback(() => {
    if (!modalRef.current || !backdropRef.current || isClosing) return;
    
    setIsClosing(true);
    const modal = modalRef.current;
    const backdrop = backdropRef.current;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.in', duration: 0.3 },
      onComplete: () => {
        setIsClosing(false);
        onClose();
      }
    });

    if (viewport === 'mobile') {
      tl.to(modal, { y: '100%', opacity: 0 })
        .to(backdrop, { opacity: 0 }, '<');
    } else {
      tl.to(modal, { scale: 0.95, opacity: 0, y: 20 })
        .to(backdrop, { opacity: 0 }, '<');
    }
  }, [onClose, viewport, isClosing]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      style={{ 
        backgroundColor: colors.backdrop,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        ref={modalRef}
        className={`
          w-full overflow-hidden border shadow-2xl
          ${responsive.modal[viewport]}
          ${viewport === 'mobile' ? 'pb-0' : ''}
        `}
        style={{ 
          backgroundColor: colors.background, 
          borderColor: colors.border.default 
        }}
        onClick={e => e.stopPropagation()}
      >
        {viewport === 'mobile' && (
          <div 
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            aria-hidden="true"
          >
            <div 
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: colors.text.primary }}
            />
          </div>
        )}

        <div className="flex flex-col h-full">
          <div 
            className={`
              overflow-y-auto flex-1
              ${responsive.padding[viewport]}
              ${responsive.gap[viewport]}
            `}
          >
            <div className={`flex flex-col ${responsive.gap[viewport]}`}>
              <div className={`text-center ${responsive.gap[viewport]}`}>
                <div
                  className={`rounded-full flex items-center justify-center mx-auto border overflow-hidden ${
                    viewport === 'mobile' ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'
                  }`}
                  style={{
                    backgroundColor: `${colors.button.background}20`,
                    borderColor: colors.text.primary,
                  }}
                >
                  <Image
                    src={WisdomeHouseLogo}
                    alt="The Wisdom House Church Logo"
                    width={viewport === 'mobile' ? 20 : 24}
                    height={viewport === 'mobile' ? 20 : 24}
                    className="object-contain"
                  />
                </div>

                <div
                  className={`mb-2 ${responsive.heading[viewport]} font-bold leading-tight`}
                  style={{ color: colors.text.primary }}
                >
                  Join Our Community
                </div>

                <BodyMD
                  className={`${responsive.body[viewport]} leading-relaxed`}
                  style={{ color: colors.text.muted }}
                  useThemeColor={false}
                >
                  Connect with us across different platforms and grow together in
                  faith
                </BodyMD>
              </div>

              <div className="space-y-2">
                {communityLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-white shadow-md hover:shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${link.bgColor}, ${link.hoverColor})`,
                      }}
                    >
                      <div
                        className={`flex items-center justify-center rounded-lg bg-white/20 mr-2 ${
                          viewport === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'
                        }`}
                      >
                        <Icon className={viewport === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} />
                      </div>

                      <div className="flex-1">
                        <MediumText
                          className={`mb-0.5 ${responsive.body[viewport]} font-medium`}
                          useThemeColor={false}
                        >
                          {link.title}
                        </MediumText>
                        <Caption className="text-white/90" useThemeColor={false}>
                          {link.description}
                        </Caption>
                      </div>

                      <ChevronDown className="w-3 h-3 transform -rotate-90 opacity-80" />
                    </a>
                  );
                })}
              </div>

              <div
                className={`text-center pt-2 border-t ${
                  viewport === 'mobile' ? 'mt-3 pt-3' : 'mt-4 pt-4'
                }`}
                style={{
                  borderColor: colors.border.default,
                }}
              >
                <button
                  onClick={handleClose}
                  className="rounded-full p-1.5 transition-all duration-200 hover:scale-110 active:scale-95 ml-2 flex-shrink-0"
                  style={{ 
                    backgroundColor: colors.background,
                    borderColor: colors.border.default,
                    borderWidth: '1px'
                  }}
                  aria-label="Close modal"
                >
                  <X 
                    className="w-4 h-4"
                    style={{ color: colors.text.primary }}
                  />
                </button>
                <Caption 
                  className="mt-1"
                  style={{ color: colors.text.muted }} 
                  useThemeColor={false}
                >
                  We can't wait to connect with you!
                </Caption>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}