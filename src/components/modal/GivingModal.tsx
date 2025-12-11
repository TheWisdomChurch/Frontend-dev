'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import Button from '@/components/utils/buttons/CustomButton';
import { H4, BodyMD, BodySM, MediumText, Caption } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { ChevronDown, Copy, Check, Info, X } from 'lucide-react';
import { WisdomeHouseLogo } from '../assets';

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
  const [isMobile, setIsMobile] = useState(false);
  const [openAccountIndex, setOpenAccountIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const accountRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Theme-based styles - Always dark theme
  const themeStyles = useMemo(
    () => ({
      modalBackground: colorScheme.black,
      textColor: colorScheme.primary,
      subtitleTextColor: colorScheme.white,
      buttonBackground: colorScheme.primary,
      buttonTextColor: colorScheme.black,
      surfaceBackground: colorScheme.surface,
      opacityPrimary10: colorScheme.opacity.primary10,
      borderColor: colorScheme.border,
    }),
    [colorScheme]
  );

  // Check if mounted and handle mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    // Initial check
    checkMobile();

    const handleResize = () => {
      requestAnimationFrame(checkMobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  // Animation effect
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modalElement = modalRef.current;
    const tl = gsap.timeline();

    if (isMobile) {
      tl.fromTo(
        modalElement,
        { y: '100%', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      tl.fromTo(
        modalElement,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }

    return () => {
      tl.kill();
    };
  }, [isOpen, isMobile]);

  const handleClose = useCallback(() => {
    if (!modalRef.current) {
      onClose();
      setOpenAccountIndex(null);
      return;
    }

    const modalElement = modalRef.current;

    if (isMobile) {
      gsap.to(modalElement, {
        y: '100%',
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          onClose();
          setOpenAccountIndex(null);
        },
      });
    } else {
      gsap.to(modalElement, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          onClose();
          setOpenAccountIndex(null);
        },
      });
    }
  }, [isMobile, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const toggleAccount = useCallback(
    (index: number) => {
      const accountRef = accountRefs.current[index];
      if (!accountRef) return;

      if (openAccountIndex === index) {
        gsap.to(accountRef, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => setOpenAccountIndex(null),
        });
      } else {
        if (openAccountIndex !== null) {
          const prev = accountRefs.current[openAccountIndex];
          if (prev) {
            gsap.to(prev, {
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
    },
    [openAccountIndex]
  );

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      const timer = setTimeout(() => setCopiedIndex(null), 2000);

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  if (!isOpen || !givingOption) return null;

  const accounts = givingOption.accounts || [];

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-3 ${
        isMobile ? 'pb-0' : ''
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${givingOption.title} - Giving Information`}
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
          backgroundColor: themeStyles.modalBackground,
          borderColor: colorScheme.primary,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div
            className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing"
            aria-hidden="true"
          >
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className={`absolute rounded-full p-1 transform hover:scale-110 transition-all duration-200 ${
            isMobile ? 'top-1 right-1' : 'top-2 right-2'
          }`}
          style={{
            backgroundColor: themeStyles.opacityPrimary10,
            color: colorScheme.primary,
          }}
          aria-label="Close modal"
        >
          <X className="w-3 h-3" />
        </Button>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className={`
            overflow-y-auto
            ${isMobile ? 'p-3 max-h-[calc(85vh-40px)]' : 'p-4 max-h-[calc(85vh-40px)]'}
          `}
          style={
            {
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            } as React.CSSProperties
          }
        >
          {/* Custom scrollbar hiding */}
          <style>{`
            .overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Header */}
          <div className={`text-center ${isMobile ? 'mb-3' : 'mb-4'}`}>
            <div
              className={`rounded-full flex items-center justify-center mx-auto border-2 ${
                isMobile ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-2'
              }`}
              style={{
                backgroundColor: themeStyles.opacityPrimary10,
                borderColor: colorScheme.primary,
              }}
            >
              <Image
                src={WisdomeHouseLogo}
                alt="WisdomHouse Logo"
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
                className="object-contain"
                priority
              />
            </div>
            <H4
              fontFamily="bricolage"
              className={`mb-1 ${isMobile ? 'text-lg' : 'text-xl'}`}
              style={{ color: themeStyles.textColor }}
              useThemeColor={false}
              weight="bold"
            >
              {givingOption.title}
            </H4>
            <BodyMD
              className="text-xs leading-relaxed mb-2"
              style={{ color: themeStyles.subtitleTextColor }}
              useThemeColor={false}
            >
              {givingOption.description}
            </BodyMD>
            <div
              className={`rounded-lg border mb-3 ${isMobile ? 'p-2' : 'p-2'}`}
              style={{
                backgroundColor: themeStyles.opacityPrimary10,
                borderColor: colorScheme.primary,
              }}
            >
              <Caption
                fontFamily="playfair"
                className="italic text-center leading-relaxed"
                style={{ color: themeStyles.subtitleTextColor }}
                useThemeColor={false}
              >
                &quot;Each of you should give what you have decided in your
                heart to give, not reluctantly or under compulsion, for God
                loves a cheerful giver.&quot;
              </Caption>
              <BodySM
                className="mt-1 text-center"
                style={{ color: themeStyles.subtitleTextColor }}
                useThemeColor={false}
              >
                2 Corinthians 9:7
              </BodySM>
            </div>
          </div>

          <div className={isMobile ? 'mb-3' : 'mb-4'}>
            <MediumText
              className={`text-center mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}
              style={{ color: themeStyles.textColor }}
              useThemeColor={false}
            >
              Pay Into Our Accounts
            </MediumText>
            {accounts.length === 0 ? (
              <div className="text-center py-2">
                <BodyMD
                  style={{ color: themeStyles.subtitleTextColor }}
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
                    key={account.accountNumber}
                    className={accounts.length === 1 ? 'w-full max-w-xs' : ''}
                  >
                    <div
                      className={`
                        relative rounded-full mx-auto mb-1 border-2 cursor-pointer
                        transform transition-all duration-300 hover:scale-105
                        ${isMobile ? 'w-12 h-12' : 'w-14 h-14'}
                      `}
                      style={{
                        backgroundColor: themeStyles.surfaceBackground,
                        borderColor:
                          openAccountIndex === index
                            ? colorScheme.primary
                            : themeStyles.borderColor,
                      }}
                      onClick={() => toggleAccount(index)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={openAccountIndex === index}
                      aria-controls={`account-details-${index}`}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleAccount(index);
                        }
                      }}
                    >
                      {account.image ? (
                        <Image
                          src={account.image}
                          alt={account.bank}
                          fill
                          className="rounded-full object-cover"
                          sizes="(max-width: 768px) 48px, 56px"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <span
                            className={isMobile ? 'text-sm' : 'text-base'}
                            style={{ color: colorScheme.primary }}
                          >
                            Bank
                          </span>
                        </div>
                      )}
                      <div
                        className={`
                          absolute left-1/2 transform -translate-x-1/2 rounded-full flex items-center justify-center border
                          ${isMobile ? '-bottom-1 w-4 h-4' : '-bottom-1 w-4 h-4'}
                        `}
                        style={{
                          backgroundColor: themeStyles.modalBackground,
                          borderColor: colorScheme.primary,
                        }}
                      >
                        <ChevronDown
                          className={`transition-transform duration-300 ${
                            openAccountIndex === index ? 'rotate-180' : ''
                          } ${isMobile ? 'w-2 h-2' : 'w-2 h-2'}`}
                          style={{ color: colorScheme.primary }}
                        />
                      </div>
                    </div>
                    <MediumText
                      className={`text-center mb-0.5 line-clamp-2 ${
                        isMobile ? 'text-xs' : 'text-sm'
                      }`}
                      style={{ color: themeStyles.textColor }}
                      useThemeColor={false}
                    >
                      {account.bank}
                    </MediumText>
                    <div
                      ref={el => {
                        accountRefs.current[index] = el;
                      }}
                      className="overflow-hidden"
                      style={{ height: 0, opacity: 0 }}
                      id={`account-details-${index}`}
                      aria-hidden={openAccountIndex !== index}
                    >
                      <div
                        className={`rounded-lg border mt-1 ${isMobile ? 'p-2' : 'p-2'}`}
                        style={{
                          backgroundColor: themeStyles.surfaceBackground,
                          borderColor: colorScheme.primary,
                        }}
                      >
                        <div className={isMobile ? 'space-y-2' : 'space-y-2'}>
                          <div>
                            <BodySM
                              className="mb-0.5 text-xs"
                              style={{ color: themeStyles.subtitleTextColor }}
                              useThemeColor={false}
                            >
                              Account Number
                            </BodySM>
                            <div className="flex items-center justify-between gap-1">
                              <code
                                className={`font-mono font-bold break-all text-xs`}
                                style={{ color: themeStyles.textColor }}
                              >
                                {account.accountNumber}
                              </code>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  copyToClipboard(account.accountNumber, index)
                                }
                                className={`rounded-full flex-shrink-0 p-1`}
                                style={{
                                  backgroundColor:
                                    copiedIndex === index
                                      ? colorScheme.primary
                                      : themeStyles.opacityPrimary10,
                                  color:
                                    copiedIndex === index
                                      ? themeStyles.buttonTextColor
                                      : colorScheme.primary,
                                }}
                                aria-label={
                                  copiedIndex === index
                                    ? 'Copied to clipboard'
                                    : `Copy account number ${account.accountNumber}`
                                }
                              >
                                {copiedIndex === index ? (
                                  <Check className="w-2.5 h-2.5" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <BodySM
                              className="mb-0.5 text-xs"
                              style={{ color: themeStyles.subtitleTextColor }}
                              useThemeColor={false}
                            >
                              Account Name
                            </BodySM>
                            <MediumText
                              className={`break-words text-xs`}
                              style={{ color: themeStyles.textColor }}
                              useThemeColor={false}
                            >
                              {account.accountName}
                            </MediumText>
                          </div>
                          <div
                            className={`rounded-lg border ${isMobile ? 'p-1.5' : 'p-1.5'}`}
                            style={{
                              backgroundColor: themeStyles.opacityPrimary10,
                              borderColor: colorScheme.primary,
                            }}
                          >
                            <div className="flex items-start gap-1">
                              <Info
                                className={`flex-shrink-0 mt-0.5 ${isMobile ? 'w-3 h-3' : 'w-3 h-3'}`}
                                style={{ color: colorScheme.primary }}
                              />
                              <Caption
                                className="leading-relaxed"
                                style={{ color: themeStyles.subtitleTextColor }}
                                useThemeColor={false}
                              >
                                <MediumText
                                  style={{
                                    color: themeStyles.subtitleTextColor,
                                  }}
                                  useThemeColor={false}
                                >
                                  Please add narration
                                </MediumText>{' '}
                                to your transactions. Thank you!
                              </Caption>
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

          <div className={isMobile ? 'mb-3' : 'mb-4'}>
            <div
              className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}
            >
              <div
                className="rounded-lg p-2 border"
                style={{
                  backgroundColor: themeStyles.opacityPrimary10,
                  borderColor: colorScheme.primary,
                }}
              >
                <MediumText
                  className="mb-0.5 text-xs"
                  style={{ color: themeStyles.textColor }}
                  useThemeColor={false}
                >
                  Giving Tips
                </MediumText>
                <Caption
                  style={{ color: themeStyles.subtitleTextColor }}
                  useThemeColor={false}
                >
                  • Include your name in narration
                  <br />
                  • Keep transaction receipts
                  <br />• Contact for inquiries
                </Caption>
              </div>
              <div
                className="rounded-lg p-2 border"
                style={{
                  backgroundColor: themeStyles.opacityPrimary10,
                  borderColor: colorScheme.primary,
                }}
              >
                <MediumText
                  className="mb-0.5 text-xs"
                  style={{ color: themeStyles.textColor }}
                  useThemeColor={false}
                >
                  Need Help?
                </MediumText>
                <Caption
                  style={{ color: themeStyles.subtitleTextColor }}
                  useThemeColor={false}
                >
                  Contact finance team for:
                  <br />
                  • Transaction issues
                  <br />
                  • Giving receipts
                  <br />• Other inquiries
                </Caption>
              </div>
            </div>
          </div>

          <div
            className="text-center pt-2 border-t"
            style={{ borderColor: colorScheme.primary }}
          >
            <Caption
              className="mb-1"
              style={{ color: themeStyles.subtitleTextColor }}
              useThemeColor={false}
            >
              Thank you for your generous giving. May God bless you abundantly.
            </Caption>
            <Button
              onClick={handleClose}
              className={`rounded-lg transition-all duration-200 ${
                isMobile ? 'py-1.5 px-4 text-sm' : 'py-2 px-6 text-sm'
              }`}
              style={{
                backgroundColor: themeStyles.buttonBackground,
                color: themeStyles.buttonTextColor,
              }}
            >
              <MediumText
                style={{ color: themeStyles.buttonTextColor }}
                useThemeColor={false}
              >
                Close
              </MediumText>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
