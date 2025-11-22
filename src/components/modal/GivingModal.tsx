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
  const [openAccountIndex, setOpenAccountIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const accountRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Theme-based styles - Always dark theme
  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white; // White for subtitles and info
  const buttonBackground = colorScheme.primary;
  const buttonTextColor = colorScheme.black;
  const surfaceBackground = colorScheme.surface;

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

  // Early return if not mounted or not open
  if (!mounted || !isOpen) return null;

  // Early return if givingOption is null/undefined
  if (!givingOption) return null;

  // Safe access to accounts with fallback
  const accounts = givingOption.accounts || [];

  return createPortal(
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="rounded-3xl w-full mx-auto overflow-hidden max-w-2xl border shadow-2xl"
        style={{
          backgroundColor: modalBackground,
          borderColor: colorScheme.primary,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 rounded-full p-1.5 transform hover:scale-110 transition-all duration-200"
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

        {/* Content Area */}
        <div ref={contentRef} className="p-4 lg:p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 border-4"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.primary,
              }}
            >
              <span
                className="text-lg lg:text-xl"
                style={{ color: colorScheme.primary }}
              >
                💰
              </span>
            </div>

            <BaseText
              weight="black"
              className="text-lg lg:text-2xl mb-2 lg:mb-3 tracking-tight"
              style={{ color: textColor }}
              useThemeColor={false}
            >
              {givingOption.title}
            </BaseText>

            <BodyMD
              className="opacity-90 leading-relaxed mb-3 lg:mb-4 text-xs lg:text-sm"
              style={{ color: subtitleTextColor }} // Changed to white
              useThemeColor={false}
            >
              {givingOption.description}
            </BodyMD>

            {/* Scripture Verse */}
            <div
              className="rounded-lg p-2 lg:p-3 mb-4 lg:mb-6 border"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                borderColor: colorScheme.primary,
              }}
            >
              <BaseText
                weight="light"
                fontFamily="playfair"
                className="text-xs lg:text-sm italic text-center leading-relaxed"
                style={{
                  color: subtitleTextColor, // Changed to white
                }}
                useThemeColor={false}
              >
                "Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver."
              </BaseText>
              <BodySM
                weight="medium"
                className="mt-1 text-center text-xs"
                style={{
                  color: subtitleTextColor, // Changed to white
                }}
                useThemeColor={false}
              >
                2 Corinthians 9:7
              </BodySM>
            </div>
          </div>

          {/* Accounts Section */}
          <div className="mb-4 lg:mb-6">
            <BaseText
              weight="bold"
              className="text-base lg:text-xl text-center mb-3 lg:mb-4"
              style={{ color: textColor }}
              useThemeColor={false}
            >
              Pay Into Our Accounts
            </BaseText>

            {/* Conditional rendering for accounts */}
            {accounts.length === 0 ? (
              <div className="text-center py-4 lg:py-6">
                <BodyMD
                  style={{ color: subtitleTextColor }} // Changed to white
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
                      ? 'grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3 justify-center'
                      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3'
                }
              `}
              >
                {accounts.map((account, index) => (
                  <div
                    key={index}
                    className={`
                      text-center
                      ${accounts.length === 1 ? 'w-full max-w-xs' : ''}
                    `}
                  >
                    {/* Account Circle */}
                    <div
                      className={`
                        relative rounded-full mx-auto mb-2 lg:mb-3 border-4 cursor-pointer 
                        transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                        ${
                          accounts.length === 1
                            ? 'w-20 h-20 lg:w-24 lg:h-24'
                            : 'w-14 h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18'
                        }
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
                            className={
                              accounts.length === 1
                                ? 'text-xl lg:text-2xl'
                                : 'text-base lg:text-lg'
                            }
                            style={{ color: colorScheme.primary }}
                          >
                            🏦
                          </span>
                        </div>
                      )}

                      {/* Chevron Indicator */}
                      <div
                        className={`
                          absolute left-1/2 transform -translate-x-1/2 rounded-full 
                          flex items-center justify-center border-2
                          ${
                            accounts.length === 1
                              ? '-bottom-2 w-8 h-8 lg:-bottom-3 lg:w-10 lg:h-10'
                              : '-bottom-1 lg:-bottom-2 w-5 h-5 lg:w-6 lg:h-6'
                          }
                        `}
                        style={{
                          backgroundColor: modalBackground,
                          borderColor: colorScheme.primary,
                        }}
                      >
                        <ChevronDown
                          className={`
                            transition-transform duration-300 ${
                              openAccountIndex === index ? 'rotate-180' : ''
                            }
                            ${accounts.length === 1 ? 'w-4 h-4 lg:w-5 lg:h-5' : 'w-2.5 h-2.5 lg:w-3 lg:h-3'}
                          `}
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                    </div>

                    <SemiBoldText
                      className={`
                        mb-1 line-clamp-2
                        ${accounts.length === 1 ? 'text-base lg:text-lg' : 'text-xs lg:text-sm'}
                      `}
                      style={{ color: textColor }}
                      useThemeColor={false}
                    >
                      {account.bank}
                    </SemiBoldText>

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
                        className={`
                          rounded-lg border mt-1
                          ${accounts.length === 1 ? 'p-3 lg:p-4' : 'p-2 lg:p-3'}
                        `}
                        style={{
                          backgroundColor: surfaceBackground,
                          borderColor: colorScheme.primary,
                        }}
                      >
                        <div
                          className={
                            accounts.length === 1
                              ? 'space-y-3 lg:space-y-4'
                              : 'space-y-1.5 lg:space-y-2'
                          }
                        >
                          <div>
                            <BodySM
                              weight="medium"
                              className={
                                accounts.length === 1
                                  ? 'mb-1 text-sm lg:text-base'
                                  : 'mb-1 text-xs lg:text-sm'
                              }
                              style={{ color: subtitleTextColor }} // Changed to white
                              useThemeColor={false}
                            >
                              Account Number
                            </BodySM>
                            <div className="flex items-center justify-between gap-1">
                              <code
                                className={`
                                  font-mono font-bold break-all
                                  ${accounts.length === 1 ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'}
                                `}
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
                                className={`
                                  rounded-full flex-shrink-0
                                  ${accounts.length === 1 ? 'p-1.5 lg:p-2' : 'p-1 lg:p-1.5'}
                                `}
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
                                      accounts.length === 1
                                        ? 'w-3.5 h-3.5 lg:w-4 lg:h-4'
                                        : 'w-2.5 h-2.5 lg:w-3 lg:h-3'
                                    }
                                  />
                                ) : (
                                  <Copy
                                    className={
                                      accounts.length === 1
                                        ? 'w-3.5 h-3.5 lg:w-4 lg:h-4'
                                        : 'w-2.5 h-2.5 lg:w-3 lg:h-3'
                                    }
                                  />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <BodySM
                              weight="medium"
                              className={
                                accounts.length === 1
                                  ? 'mb-1 text-sm lg:text-base'
                                  : 'mb-1 text-xs lg:text-sm'
                              }
                              style={{ color: subtitleTextColor }} // Changed to white
                              useThemeColor={false}
                            >
                              Account Name
                            </BodySM>
                            <SemiBoldText
                              className={
                                accounts.length === 1
                                  ? 'text-sm lg:text-base break-words'
                                  : 'text-xs lg:text-sm break-words'
                              }
                              style={{ color: textColor }}
                              useThemeColor={false}
                            >
                              {account.accountName}
                            </SemiBoldText>
                          </div>

                          {/* Information Section */}
                          <div
                            className={
                              accounts.length === 1
                                ? 'rounded-lg p-2 lg:p-3 mt-1 lg:mt-2'
                                : 'rounded-lg p-1.5 lg:p-2 mt-1'
                            }
                            style={{
                              backgroundColor: colorScheme.opacity.primary10,
                              border: `1px solid ${colorScheme.primary}`,
                            }}
                          >
                            <div className="flex items-start gap-1 lg:gap-2">
                              <Info
                                className={
                                  accounts.length === 1
                                    ? 'w-4 h-4 lg:w-5 lg:h-5 mt-0.5 flex-shrink-0'
                                    : 'w-2.5 h-2.5 lg:w-3 lg:h-3 mt-0.5 flex-shrink-0'
                                }
                                style={{ color: colorScheme.primary }}
                              />
                              <BodySM
                                className={
                                  accounts.length === 1
                                    ? 'leading-relaxed text-xs lg:text-sm'
                                    : 'leading-relaxed text-xs'
                                }
                                style={{ color: subtitleTextColor }} // Changed to white
                                useThemeColor={false}
                              >
                                <SemiBoldText
                                  className={
                                    accounts.length === 1
                                      ? 'text-xs lg:text-sm'
                                      : 'text-xs'
                                  }
                                  style={{ color: subtitleTextColor }} // Changed to white
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

          {/* Additional Giving Information */}
          <div className="mb-4 lg:mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              {/* Giving Tips */}
              <div
                className="rounded-lg p-3 border"
                style={{
                  backgroundColor: colorScheme.opacity.primary10,
                  borderColor: colorScheme.primary,
                }}
              >
                <BaseText
                  weight="bold"
                  className="text-xs lg:text-sm mb-1"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  💡 Giving Tips
                </BaseText>
                <BodySM
                  className="text-xs leading-relaxed"
                  style={{ color: subtitleTextColor }} // Changed to white
                  useThemeColor={false}
                >
                  • Include your name in narration
                  <br />
                  • Keep transaction receipts
                  <br />• Contact for inquiries
                </BodySM>
              </div>

              {/* Contact Support */}
              <div
                className="rounded-lg p-3 border"
                style={{
                  backgroundColor: colorScheme.opacity.primary10,
                  borderColor: colorScheme.primary,
                }}
              >
                <BaseText
                  weight="bold"
                  className="text-xs lg:text-sm mb-1"
                  style={{ color: textColor }}
                  useThemeColor={false}
                >
                  📞 Need Help?
                </BaseText>
                <BodySM
                  className="text-xs leading-relaxed"
                  style={{ color: subtitleTextColor }} // Changed to white
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
            className="text-center pt-3 lg:pt-4 border-t"
            style={{
              borderColor: colorScheme.primary,
            }}
          >
            <BodySM
              className="opacity-80 mb-2 lg:mb-3 text-xs"
              style={{ color: subtitleTextColor }} // Changed to white
              useThemeColor={false}
            >
              Thank you for your generous giving. May God bless you abundantly.
            </BodySM>
            <Button
              onClick={handleClose}
              className="py-1.5 lg:py-2 px-4 lg:px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs lg:text-sm"
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor =
                  colorScheme.primaryLight;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = buttonBackground;
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
