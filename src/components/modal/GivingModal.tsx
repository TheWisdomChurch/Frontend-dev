/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/GivingModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BaseText } from '@/components/text';
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
  const [openAccountIndex, setOpenAccountIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const accountRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const modalBackground = isDarkMode ? colorScheme.white : '#000000f0';
  const textColor = isDarkMode ? colorScheme.black : colorScheme.white;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const borderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.primary + '40';
  const buttonBackground = isDarkMode ? colorScheme.black : colorScheme.primary;
  const buttonTextColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const surfaceBackground = isDarkMode
    ? colorScheme.surface
    : colorScheme.surfaceVariant;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();
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

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current) {
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
      // Close current account
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
      // Close previously open account if any
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

      // Open new account
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
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Early return if not mounted, not open, or givingOption is null/undefined
  if (!mounted || !isOpen || !givingOption) return null;

  // Safe access to accounts with fallback
  const accounts = givingOption.accounts || [];

  return createPortal(
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="rounded-3xl w-full mx-auto overflow-hidden max-w-2xl max-h-[90vh] overflow-y-auto border shadow-2xl"
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 rounded-full p-2 transform hover:scale-110 transition-all duration-200"
          style={{
            backgroundColor: isDarkMode
              ? colorScheme.opacity.black10
              : colorScheme.opacity.white10,
            color: textColor,
          }}
          onMouseEnter={(e: any) => {
            e.currentTarget.style.backgroundColor = isDarkMode
              ? colorScheme.opacity.black20
              : colorScheme.opacity.white20;
          }}
          onMouseLeave={(e: any) => {
            e.currentTarget.style.backgroundColor = isDarkMode
              ? colorScheme.opacity.black10
              : colorScheme.opacity.white10;
          }}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Content Area */}
        <div ref={contentRef} className="p-6 lg:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4"
              style={{
                backgroundColor: `${colorScheme.primary}20`,
                borderColor: colorScheme.primary,
              }}
            >
              <span className="text-2xl" style={{ color: colorScheme.primary }}>
                💰
              </span>
            </div>

            <h2
              className="text-2xl lg:text-3xl font-black mb-4 tracking-tight"
              style={{ color: textColor }}
            >
              {givingOption.title}
            </h2>

            <p
              className="text-base lg:text-lg opacity-90 leading-relaxed mb-6"
              style={{ color: secondaryTextColor }}
            >
              {givingOption.description}
            </p>

            {/* Scripture Verse */}
            <div
              className="rounded-xl p-4 mb-8 border"
              style={{
                backgroundColor: isDarkMode
                  ? colorScheme.opacity.primary10
                  : colorScheme.opacity.primary20,
                borderColor: isDarkMode
                  ? colorScheme.opacity.primary20
                  : colorScheme.opacity.primary30,
              }}
            >
              <BaseText
                weight="light"
                fontFamily="playfair"
                className="text-lg italic text-center leading-relaxed"
                style={{
                  color: isDarkMode
                    ? colorScheme.primary
                    : colorScheme.primaryLight,
                }}
              >
                "Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver."
              </BaseText>
              <p
                className="text-sm font-medium mt-2 text-center"
                style={{
                  color: isDarkMode
                    ? colorScheme.primary
                    : colorScheme.primaryLight,
                }}
              >
                2 Corinthians 9:7
              </p>
            </div>
          </div>

          {/* Accounts Section */}
          <div className="mb-8">
            <h3
              className="text-xl lg:text-2xl font-bold text-center mb-6"
              style={{ color: textColor }}
            >
              Pay Into Our Accounts
            </h3>

            {/* Conditional rendering for accounts */}
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: secondaryTextColor }}>
                  No accounts available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {accounts.map((account, index) => (
                  <div key={index} className="text-center">
                    {/* Account Circle */}
                    <div
                      className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full mx-auto mb-4 border-4 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: surfaceBackground,
                        borderColor:
                          openAccountIndex === index
                            ? colorScheme.primary
                            : isDarkMode
                              ? colorScheme.borderLight
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
                          <span className="text-2xl">🏦</span>
                        </div>
                      )}

                      {/* Chevron Indicator */}
                      <div
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2"
                        style={{
                          backgroundColor: modalBackground,
                          borderColor: colorScheme.primary,
                        }}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            openAccountIndex === index ? 'rotate-180' : ''
                          }`}
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                    </div>

                    <h4
                      className="font-bold text-base lg:text-lg mb-2"
                      style={{ color: textColor }}
                    >
                      {account.bank}
                    </h4>

                    {/* Account Details Dropdown */}
                    <div
                      ref={el => {
                        if (el) {
                          accountRefs.current[index] = el;
                        }
                      }}
                      className="overflow-hidden"
                      style={{ height: 0, opacity: 0 }}
                    >
                      <div
                        className="rounded-lg p-4 border mt-2"
                        style={{
                          backgroundColor: surfaceBackground,
                          borderColor: isDarkMode
                            ? colorScheme.borderLight
                            : colorScheme.border,
                        }}
                      >
                        <div className="space-y-3">
                          <div>
                            <p
                              className="text-sm font-medium mb-1"
                              style={{ color: secondaryTextColor }}
                            >
                              Account Number
                            </p>
                            <div className="flex items-center justify-between">
                              <code
                                className="font-mono text-base lg:text-lg font-bold"
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
                                className="rounded-full p-2"
                                style={{
                                  backgroundColor:
                                    copiedIndex === index
                                      ? colorScheme.primary
                                      : 'transparent',
                                  color:
                                    copiedIndex === index
                                      ? colorScheme.black
                                      : colorScheme.primary,
                                }}
                              >
                                {copiedIndex === index ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <p
                              className="text-sm font-medium mb-1"
                              style={{ color: secondaryTextColor }}
                            >
                              Account Name
                            </p>
                            <p
                              className="font-semibold"
                              style={{ color: textColor }}
                            >
                              {account.accountName}
                            </p>
                          </div>

                          {/* Information Section */}
                          <div
                            className="rounded-lg p-3 mt-2"
                            style={{
                              backgroundColor: isDarkMode
                                ? colorScheme.opacity.primary10
                                : colorScheme.opacity.primary20,
                              border: `1px solid ${isDarkMode ? colorScheme.opacity.primary20 : colorScheme.opacity.primary30}`,
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <Info
                                className="w-4 h-4 mt-0.5 flex-shrink-0"
                                style={{ color: colorScheme.primary }}
                              />
                              <p
                                className="text-xs leading-relaxed"
                                style={{ color: textColor }}
                              >
                                <strong>Please Kindly add narration</strong> to
                                your transactions for proper appropriation of
                                funds. Thank you!
                              </p>
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

          {/* Footer */}
          <div
            className="text-center pt-6 border-t"
            style={{
              borderColor: isDarkMode
                ? colorScheme.borderLight
                : colorScheme.border,
            }}
          >
            <p
              className="text-sm opacity-80 mb-4"
              style={{ color: secondaryTextColor }}
            >
              Thank you for your generous giving. May God bless you abundantly.
            </p>
            <Button
              onClick={handleClose}
              className="font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.gray[800]
                  : colorScheme.primaryLight;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = buttonBackground;
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
