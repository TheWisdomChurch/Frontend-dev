'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ChevronDown, X } from 'lucide-react';
import Button from '../utils/buttons/CustomButton';
import { communityLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '../assets';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H4, BodyMD, MediumText, Caption } from '@/components/text';

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinCommunityModal({
  isOpen,
  onClose,
}: JoinCommunityModalProps) {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Theme-based styles - Always dark theme
  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white;
  const borderColor = colorScheme.primary;

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
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
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
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose,
        });
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 20,
          duration: 0.3,
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
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-3 ${
        isMobile ? 'pb-0' : ''
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border shadow-xl
          ${
            isMobile
              ? 'rounded-t-2xl rounded-b-none max-h-[85vh]'
              : 'rounded-2xl max-w-md max-h-[85vh]'
          }
        `}
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        {/* Close Button */}
        <div className="relative w-full">
          <div
            className={`absolute ${isMobile ? 'top-1 right-1' : 'top-2 right-2'} z-50`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-lg p-1.5 transform hover:scale-110 transition-all duration-200"
              curvature="xl"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                color: textColor,
              }}
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div
          className={`overflow-y-auto ${isMobile ? 'p-3 max-h-[calc(85vh-40px)]' : 'p-4 max-h-[calc(85vh-40px)]'}`}
        >
          {/* Header */}
          <div className={`text-center ${isMobile ? 'mb-4' : 'mb-5'}`}>
            <div
              className={`rounded-full flex items-center justify-center mx-auto border overflow-hidden ${
                isMobile ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'
              }`}
              style={{
                backgroundColor: `${colorScheme.primary}20`,
                borderColor: colorScheme.primary,
              }}
            >
              <Image
                src={WisdomeHouseLogo}
                alt="The Wisdom House Church Logo"
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
                className="object-contain"
              />
            </div>

            <H4
              fontFamily="bricolage"
              className={`mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}
              style={{ color: textColor }}
              useThemeColor={false}
              weight="bold"
            >
              Join Our Community
            </H4>

            <BodyMD
              className="text-xs leading-relaxed"
              style={{ color: subtitleTextColor }}
              useThemeColor={false}
            >
              Connect with us across different platforms and grow together in
              faith
            </BodyMD>
          </div>

          {/* Community Links */}
          <div className="space-y-2">
            {communityLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-white shadow-md hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${link.bgColor}, ${link.hoverColor})`,
                  }}
                >
                  <div
                    className={`flex items-center justify-center rounded-lg bg-white/20 mr-2 ${
                      isMobile ? 'w-8 h-8' : 'w-10 h-10'
                    }`}
                  >
                    <Icon className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                  </div>

                  <div className="flex-1">
                    <MediumText
                      className={
                        isMobile ? 'text-sm mb-0.5' : 'text-base mb-0.5'
                      }
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

          {/* Footer */}
          <div
            className={`text-center mt-4 pt-3 border-t ${
              isMobile ? 'mt-3 pt-3' : 'mt-4 pt-4'
            }`}
            style={{
              borderColor: borderColor,
            }}
          >
            <Caption style={{ color: subtitleTextColor }} useThemeColor={false}>
              We can't wait to connect with you!
            </Caption>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
