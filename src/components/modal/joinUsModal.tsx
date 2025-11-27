/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/JoinCommunityModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ChevronDown, X } from 'lucide-react';
import Button from '../utils/CustomButton';
import { communityLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '../assets';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { BaseText, BodySM, BodyMD, SemiBoldText } from '@/components/text';

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
          w-full mx-auto overflow-hidden border shadow-2xl
          ${
            isMobile
              ? 'rounded-t-3xl rounded-b-none max-h-[90vh]'
              : 'rounded-3xl max-w-md max-h-[90vh]'
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
          <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        {/* Close Button */}
        <div className="relative w-full">
          <div
            className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} z-50`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full p-2 transform hover:scale-110 transition-all duration-200"
              curvature="full"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                color: textColor,
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
              <X className="w-5 h-5" strokeWidth={2} />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div
          className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 lg:p-8 max-h-[calc(90vh-80px)]'}`}
        >
          {/* Header */}
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
            <div
              className={`rounded-full flex items-center justify-center mx-auto border-2 overflow-hidden ${
                isMobile ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-4'
              }`}
              style={{
                backgroundColor: `${colorScheme.primary}20`,
                borderColor: colorScheme.primary,
              }}
            >
              <Image
                src={WisdomeHouseLogo}
                alt="The Wisdom House Church Logo"
                width={isMobile ? 24 : 40}
                height={isMobile ? 24 : 40}
                className="object-contain"
              />
            </div>

            <BaseText
              fontFamily="bricolage"
              weight="black"
              className={`mb-2 tracking-tight ${
                isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'
              }`}
              style={{ color: textColor }}
              useThemeColor={false}
            >
              Join Our Community
            </BaseText>

            <BodyMD
              className="opacity-90 leading-relaxed text-sm"
              style={{ color: subtitleTextColor }}
              useThemeColor={false}
            >
              Connect with us across different platforms and grow together in
              faith
            </BodyMD>
          </div>

          {/* Community Links */}
          <div className="space-y-3">
            {communityLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-105 text-white shadow-lg hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${link.bgColor}, ${link.hoverColor})`,
                  }}
                >
                  <div
                    className={`flex items-center justify-center rounded-full bg-white/20 mr-3 ${
                      isMobile ? 'w-10 h-10' : 'w-12 h-12'
                    }`}
                  >
                    <Icon className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                  </div>

                  <div className="flex-1">
                    <SemiBoldText
                      className={isMobile ? 'text-base mb-1' : 'text-lg mb-1'}
                      useThemeColor={false}
                    >
                      {link.title}
                    </SemiBoldText>
                    <BodySM
                      className="text-white/90 text-xs"
                      useThemeColor={false}
                    >
                      {link.description}
                    </BodySM>
                  </div>

                  <ChevronDown className="w-4 h-4 transform -rotate-90 opacity-80" />
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className={`text-center mt-6 pt-4 border-t ${
              isMobile ? 'mt-4 pt-4' : 'mt-6 pt-6'
            }`}
            style={{
              borderColor: borderColor,
            }}
          >
            <BodySM
              className="opacity-80 text-xs"
              style={{ color: subtitleTextColor }}
              useThemeColor={false}
            >
              We can't wait to connect with you!
            </BodySM>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
