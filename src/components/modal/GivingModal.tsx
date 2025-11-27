/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/GivingModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BaseText, BodySM, BodyMD, SemiBoldText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { ChevronDown, Copy, Check, Info, X } from 'lucide-react';

interface GivingOption {
  title: string;
  description: string;
  accounts: {
    bank: string;
    accountNumber: string;
    accountName: string;
    image?: string;
  }[];
}

interface GivingModalProps {
  isOpen: boolean;
  onClose: () => void;
  givingOption: GivingOption | null;
}

export default function GivingModal({
  isOpen,
  onClose,
  givingOption,
}: GivingModalProps) {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openAccountIndex, setOpenAccountIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const accountRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Theme-based styles - Always dark theme
  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white;
  const buttonBackground = colorScheme.primary;
  const buttonTextColor = colorScheme.black;
  const surfaceBackground = colorScheme.surface;

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
        // Bottom sheet animation for mobile
        tl.fromTo(
          modalRef.current,
          {
            y: '100%',
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
          }
        );
      } else {
        // Center modal animation for desktop
        tl.fromTo(
          modalRef.current,
          {
            opacity: 0,
            scale: 0.95,
            y: 30,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          }
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
        // Slide down animation for mobile
        gsap.to(modalRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            onClose();
            setOpenAccountIndex(null);
          },
        });
      } else {
        // Scale down animation for desktop
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 30,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            onClose();
            setOpenAccountIndex(null);
          },
        });
      }
    } else {
      onClose();
      setOpenAccountIndex(null);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const toggleAccount = (index: number) => {
    const accountRef = accountRefs.current[index];
    if (!accountRef) return;

    if (openAccountIndex === index) {
      gsap.to(accountRef, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          setOpenAccountIndex(null);
        },
      });
    } else {
      if (openAccountIndex !== null) {
        const prevAccountRef = accountRefs.current[openAccountIndex];
        if (prevAccountRef) {
          gsap.to(prevAccountRef, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
          });
        }
      }

      setOpenAccountIndex(index);
      gsap.fromTo(
        accountRef,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          delay: 0.1,
        }
      );
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);

      // Haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!mounted || !isOpen) return null;
  if (!givingOption) return null;

  const accounts = givingOption.accounts || [];

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
              : 'rounded-3xl max-w-2xl max-h-[90vh]'
          }
        `}
        style={{
          backgroundColor: modalBackground,
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

        {/* Close Button - Mobile optimized position */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className={`absolute rounded-full p-1.5 transform hover:scale-110 transition-all duration-200 ${
            isMobile ? 'top-2 right-2' : 'top-3 right-3'
          }`}
          style={{
            backgroundColor: colorScheme.opacity.primary10,
            color: colorScheme.primary,
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
        </Button>

        {/* Content Area - Mobile optimized padding */}
        <div
          ref={contentRef}
          className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(90vh-60px)]' : 'p-6 max-h-[calc(90vh-80px)]'}`}
        >
          {/* Header - Mobile optimized */}
          <div className={`text-center ${isMobile ? 'mb-4' : 'mb-6'}`}>
            <div
              className={`rounded-full flex items-center justify-center mx-auto border-4 ${
                isMobile ? 'w-12 h-12 mb-2' : 'w-16 h-16 mb-3'
              }`}
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.primary,
              }}
            >
              <span
                className={isMobile ? 'text-base' : 'text-xl'}
                style={{ color: colorScheme.primary }}
              >
                💰
              </span>
            </div>

            <BaseText
              weight="black"
              className={`mb-2 tracking-tight ${
                isMobile ? 'text-lg' : 'text-2xl'
              }`}
              style={{ color: textColor }}
              useThemeColor={false}
            >
              {givingOption.title}
            </BaseText>

            <BodyMD
              className="opacity-90 leading-relaxed mb-3 text-sm"
              style={{ color: subtitleTextColor }}
              useThemeColor={false}
            >
              {givingOption.description}
            </BodyMD>

            {/* Scripture Verse - Mobile optimized */}
            <div
              className={`rounded-lg border mb-4 ${
                isMobile ? 'p-2 text-xs' : 'p-3 text-sm'
              }`}
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.primary,
              }}
            >
              <BaseText
                weight="light"
                fontFamily="playfair"
                className="italic text-center leading-relaxed"
                style={{ color: subtitleTextColor }}
                useThemeColor={false}
              >
                "Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver."
              </BaseText>
              <BodySM
                weight="medium"
                className="mt-1 text-center"
                style={{ color: subtitleTextColor }}
                useThemeColor={false}
              >
                2 Corinthians 9:7
              </BodySM>
            </div>
          </div>

          {/* Accounts Section - Mobile optimized layout */}
          <div className={isMobile ? 'mb-4' : 'mb-6'}>
            <BaseText
              weight="bold"
              className={`text-center mb-3 ${
                isMobile ? 'text-base' : 'text-xl'
              }`}
              style={{ color: textColor }}
              useThemeColor={false}
            >
              Pay Into Our Accounts
            </BaseText>

            {accounts.length === 0 ? (
              <div className="text-center py-4">
                <BodyMD
                  style={{ color: subtitleTextColor }}
                  useThemeColor={false}
                >
                  No accounts available at the moment.
                </BodyMD>
              </div>
            ) : (
              <div
                className={`
                ${
                  accounts.length === 1
                    ? 'flex justify-center'
                    : accounts.length === 2
                      ? 'grid grid-cols-2 gap-2'
                      : 'grid grid-cols-2 gap-2'
                }
              `}
              >
                {accounts.map((account, index) => (
                  <div
                    key={index}
                    className={accounts.length === 1 ? 'w-full max-w-xs' : ''}
                  >
                    {/* Account Circle - Mobile optimized size */}
                    <div
                      className={`
                        relative rounded-full mx-auto mb-2 border-4 cursor-pointer 
                        transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                        ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}
                      `}
                      style={{
                        backgroundColor: surfaceBackground,
                        borderColor:
                          openAccountIndex === index
                            ? colorScheme.primary
                            : colorScheme.border,
                      }}
                      onClick={() => toggleAccount(index)}
                    >
                      {account.image ? (
                        <Image
                          src={account.image}
                          alt={account.bank}
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <span
                            className={isMobile ? 'text-lg' : 'text-xl'}
                            style={{ color: colorScheme.primary }}
                          >
                            🏦
                          </span>
                        </div>
                      )}

                      {/* Chevron Indicator - Mobile optimized */}
                      <div
                        className={`
                          absolute left-1/2 transform -translate-x-1/2 rounded-full flex items-center justify-center border-2
                          ${isMobile ? '-bottom-1 w-5 h-5' : '-bottom-2 w-6 h-6'}
                        `}
                        style={{
                          backgroundColor: modalBackground,
                          borderColor: colorScheme.primary,
                        }}
                      >
                        <ChevronDown
                          className={`transition-transform duration-300 ${
                            openAccountIndex === index ? 'rotate-180' : ''
                          } ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                    </div>

                    <SemiBoldText
                      className={`text-center mb-1 line-clamp-2 ${
                        isMobile ? 'text-xs' : 'text-sm'
                      }`}
                      style={{ color: textColor }}
                      useThemeColor={false}
                    >
                      {account.bank}
                    </SemiBoldText>

                    {/* Account Details Dropdown */}
                    <div
                      ref={el => {
                        if (el) accountRefs.current[index] = el;
                      }}
                      className="overflow-hidden"
                      style={{ height: 0, opacity: 0 }}
                    >
                      <div
                        className={`rounded-lg border mt-1 ${
                          isMobile ? 'p-2' : 'p-3'
                        }`}
                        style={{
                          backgroundColor: surfaceBackground,
                          borderColor: colorScheme.primary,
                        }}
                      >
                        <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
                          {/* Account Number */}
                          <div>
                            <BodySM
                              weight="medium"
                              className="mb-1 text-xs"
                              style={{ color: subtitleTextColor }}
                              useThemeColor={false}
                            >
                              Account Number
                            </BodySM>
                            <div className="flex items-center justify-between gap-1">
                              <code
                                className={`font-mono font-bold break-all ${
                                  isMobile ? 'text-xs' : 'text-sm'
                                }`}
                                style={{ color: textColor }}
                              >
                                {account.accountNumber}
                              </code>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  copyToClipboard(account.accountNumber, index)
                                }
                                className={`rounded-full flex-shrink-0 ${
                                  isMobile ? 'p-1' : 'p-1.5'
                                }`}
                                style={{
                                  backgroundColor:
                                    copiedIndex === index
                                      ? colorScheme.primary
                                      : colorScheme.opacity.primary10,
                                  color:
                                    copiedIndex === index
                                      ? colorScheme.black
                                      : colorScheme.primary,
                                }}
                              >
                                {copiedIndex === index ? (
                                  <Check
                                    className={
                                      isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'
                                    }
                                  />
                                ) : (
                                  <Copy
                                    className={
                                      isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'
                                    }
                                  />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Account Name */}
                          <div>
                            <BodySM
                              weight="medium"
                              className="mb-1 text-xs"
                              style={{ color: subtitleTextColor }}
                              useThemeColor={false}
                            >
                              Account Name
                            </BodySM>
                            <SemiBoldText
                              className={`break-words ${
                                isMobile ? 'text-xs' : 'text-sm'
                              }`}
                              style={{ color: textColor }}
                              useThemeColor={false}
                            >
                              {account.accountName}
                            </SemiBoldText>
                          </div>

                          {/* Information Section */}
                          <div
                            className={`rounded-lg border ${
                              isMobile ? 'p-1.5 text-xs' : 'p-2 text-sm'
                            }`}
                            style={{
                              backgroundColor: colorScheme.opacity.primary10,
                              borderColor: colorScheme.primary,
                            }}
                          >
                            <div className="flex items-start gap-1">
                              <Info
                                className={`flex-shrink-0 mt-0.5 ${
                                  isMobile ? 'w-3 h-3' : 'w-4 h-4'
                                }`}
                                style={{ color: colorScheme.primary }}
                              />
                              <BodySM
                                className="leading-relaxed"
                                style={{ color: subtitleTextColor }}
                                useThemeColor={false}
                              >
                                <SemiBoldText
                                  style={{ color: subtitleTextColor }}
                                  useThemeColor={false}
                                >
                                  Please add narration
                                </SemiBoldText>{' '}
                                to your transactions. Thank you!
                              </BodySM>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Information - Mobile optimized grid */}
          <div className={isMobile ? 'mb-4' : 'mb-6'}>
            <div
              className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}
            >
              <div
                className="rounded-lg p-2 border text-xs"
                style={{
                  backgroundColor: colorScheme.opacity.primary10,
                  borderColor: colorScheme.primary,
                }}
              >
                <BaseText
                  weight="bold"
                  className="mb-1"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  💡 Giving Tips
                </BaseText>
                <BodySM
                  style={{ color: subtitleTextColor }}
                  useThemeColor={false}
                >
                  • Include your name in narration
                  <br />
                  • Keep transaction receipts
                  <br />• Contact for inquiries
                </BodySM>
              </div>

              <div
                className="rounded-lg p-2 border text-xs"
                style={{
                  backgroundColor: colorScheme.opacity.primary10,
                  borderColor: colorScheme.primary,
                }}
              >
                <BaseText
                  weight="bold"
                  className="mb-1"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  📞 Need Help?
                </BaseText>
                <BodySM
                  style={{ color: subtitleTextColor }}
                  useThemeColor={false}
                >
                  Contact finance team for:
                  <br />
                  • Transaction issues
                  <br />
                  • Giving receipts
                  <br />• Other inquiries
                </BodySM>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-center pt-3 border-t"
            style={{ borderColor: colorScheme.primary }}
          >
            <BodySM
              className="opacity-80 mb-2 text-xs"
              style={{ color: subtitleTextColor }}
              useThemeColor={false}
            >
              Thank you for your generous giving. May God bless you abundantly.
            </BodySM>
            <Button
              onClick={handleClose}
              className={`rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                isMobile ? 'py-2 px-6 text-sm' : 'py-2.5 px-8 text-base'
              }`}
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
            >
              <SemiBoldText
                style={{ color: buttonTextColor }}
                useThemeColor={false}
              >
                Close
              </SemiBoldText>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
