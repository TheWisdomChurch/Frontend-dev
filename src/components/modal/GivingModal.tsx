'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BaseText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { ChevronDown, Copy, Check, Info } from 'lucide-react';

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
  givingOption: GivingOption | null; // Make it nullable
}

export default function GivingModal({
  isOpen,
  onClose,
  givingOption,
}: GivingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [openAccountIndex, setOpenAccountIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const accountRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { colorScheme } = useTheme();

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative rounded-xl w-full mx-auto overflow-hidden max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: colorScheme.background,
          border: `2px solid ${colorScheme.primary}30`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: `1px solid ${colorScheme.primary}50`,
            color: colorScheme.primary,
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>

        {/* Content Area */}
        <div ref={contentRef} className="p-6">
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
              className="text-3xl font-black mb-4 tracking-tight"
              style={{ color: colorScheme.text }}
            >
              {givingOption.title}
            </h2>

            <p
              className="text-lg opacity-90 leading-relaxed mb-6"
              style={{ color: colorScheme.text }}
            >
              {givingOption.description}
            </p>

            {/* Scripture Verse */}
            <div
              className="rounded-lg p-4 mb-8 border"
              style={{
                backgroundColor: `${colorScheme.primary}10`,
                borderColor: colorScheme.primary,
              }}
            >
              <BaseText
                weight="light"
                fontFamily="playfair"
                className="text-lg italic text-center leading-relaxed"
                style={{ color: colorScheme.text }}
              >
                "Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver."
              </BaseText>
              <p
                className="text-sm font-medium mt-2 text-center"
                style={{ color: colorScheme.primary }}
              >
                2 Corinthians 9:7
              </p>
            </div>
          </div>

          {/* Accounts Section */}
          <div className="mb-8">
            <h3
              className="text-2xl font-bold text-center mb-6"
              style={{ color: colorScheme.text }}
            >
              Pay Into Our Accounts
            </h3>

            {/* Conditional rendering for accounts */}
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: colorScheme.textSecondary }}>
                  No accounts available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {accounts.map((account, index) => (
                  <div key={index} className="text-center">
                    {/* Account Circle */}
                    <div
                      className="relative w-24 h-24 rounded-full mx-auto mb-4 border-4 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: colorScheme.surface,
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
                          <span className="text-2xl">🏦</span>
                        </div>
                      )}

                      {/* Chevron Indicator */}
                      <div
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2"
                        style={{
                          backgroundColor: colorScheme.background,
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
                      className="font-bold text-lg mb-2"
                      style={{ color: colorScheme.text }}
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
                          backgroundColor: colorScheme.surface,
                          borderColor: colorScheme.border,
                        }}
                      >
                        <div className="space-y-3">
                          <div>
                            <p
                              className="text-sm font-medium mb-1"
                              style={{ color: colorScheme.textSecondary }}
                            >
                              Account Number
                            </p>
                            <div className="flex items-center justify-between">
                              <code
                                className="font-mono text-lg font-bold"
                                style={{ color: colorScheme.text }}
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
                              style={{ color: colorScheme.textSecondary }}
                            >
                              Account Name
                            </p>
                            <p
                              className="font-semibold"
                              style={{ color: colorScheme.text }}
                            >
                              {account.accountName}
                            </p>
                          </div>

                          {/* Information Section */}
                          <div
                            className="rounded-lg p-3 mt-2"
                            style={{
                              backgroundColor: `${colorScheme.primary}10`,
                              border: `1px solid ${colorScheme.primary}30`,
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <Info
                                className="w-4 h-4 mt-0.5 flex-shrink-0"
                                style={{ color: colorScheme.primary }}
                              />
                              <p
                                className="text-xs leading-relaxed"
                                style={{ color: colorScheme.text }}
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
            style={{ borderColor: colorScheme.border }}
          >
            <p
              className="text-sm opacity-80 mb-4"
              style={{ color: colorScheme.text }}
            >
              Thank you for your generous giving. May God bless you abundantly.
            </p>
            <Button
              onClick={handleClose}
              className="font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
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
