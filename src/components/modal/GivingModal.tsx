'use client';

import { useEffect, useRef, useState, useCallback, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { ChevronDown, Copy, Check, Info, X } from 'lucide-react';
import { useWindowSize } from '@/components/utils/hooks/useWindowSize';
import { responsive } from '@/lib/responsivee';
import { H4, BodyMD, BodySM, MediumText, Caption } from '@/components/text';
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

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export default function GivingModal({
  isOpen,
  onClose,
  givingOption,
}: GivingModalProps) {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openAccountIndex, setOpenAccountIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
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
        setOpenAccountIndex(null);
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

  const toggleAccount = useCallback((index: number) => {
    setOpenAccountIndex(prev => prev === index ? null : index);
  }, []);

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  if (!mounted || !isOpen || !givingOption) return null;

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
                  className={`rounded-full flex items-center justify-center mx-auto border-2 ${
                    viewport === 'mobile' ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'
                  }`}
                  style={{
                    backgroundColor: `${colors.button.background}20`,
                    borderColor: colors.text.primary,
                  }}
                >
                  <Image
                    src={WisdomeHouseLogo}
                    alt="WisdomHouse Logo"
                    width={viewport === 'mobile' ? 20 : 24}
                    height={viewport === 'mobile' ? 20 : 24}
                    className="object-contain"
                    priority
                  />
                </div>
                <H4
                  fontFamily="bricolage"
                  className={`mb-2 ${responsive.heading[viewport]} font-bold leading-tight`}
                  style={{ color: colors.text.primary }}
                  useThemeColor={false}
                  weight="bold"
                >
                  {givingOption.title}
                </H4>
                <BodyMD
                  className={`${responsive.body[viewport]} leading-relaxed mb-2`}
                  style={{ color: colors.text.muted }}
                  useThemeColor={false}
                >
                  {givingOption.description}
                </BodyMD>
                <div
                  className={`rounded-lg border mb-3 p-3`}
                  style={{
                    backgroundColor: `${colors.button.background}20`,
                    borderColor: colors.border.active,
                  }}
                >
                  <Caption
                    className="italic text-center leading-relaxed"
                    style={{ color: colors.text.muted }}
                    useThemeColor={false}
                  >
                    &quot;Each of you should give what you have decided in your
                    heart to give, not reluctantly or under compulsion, for God
                    loves a cheerful giver.&quot;
                  </Caption>
                  <BodySM
                    className="mt-1 text-center"
                    style={{ color: colors.text.muted }}
                    useThemeColor={false}
                  >
                    2 Corinthians 9:7
                  </BodySM>
                </div>
              </div>

              <div className={responsive.gap[viewport]}>
                <MediumText
                  className={`text-center mb-2 ${responsive.body[viewport]} font-medium`}
                  style={{ color: colors.text.primary }}
                  useThemeColor={false}
                >
                  Pay Into Our Accounts
                </MediumText>
                {givingOption.accounts.length === 0 ? (
                  <div className="text-center py-2">
                    <BodyMD
                      style={{ color: colors.text.muted }}
                      useThemeColor={false}
                    >
                      No accounts available at the moment.
                    </BodyMD>
                  </div>
                ) : (
                  <div className={`
                    ${givingOption.accounts.length === 1
                      ? 'flex justify-center'
                      : givingOption.accounts.length === 2
                        ? 'grid grid-cols-2 gap-2'
                        : 'grid grid-cols-2 gap-2'
                    }
                  `}>
                    {givingOption.accounts.map((account, index) => (
                      <div
                        key={account.accountNumber}
                        className={givingOption.accounts.length === 1 ? 'w-full max-w-xs' : ''}
                      >
                        <div
                          className={`
                            relative rounded-full mx-auto mb-1 border-2 cursor-pointer
                            transition-all duration-300 hover:scale-105
                            ${viewport === 'mobile' ? 'w-12 h-12' : 'w-14 h-14'}
                          `}
                          style={{
                            backgroundColor: colors.background,
                            borderColor:
                              openAccountIndex === index
                                ? colors.text.primary
                                : colors.border.input,
                          }}
                          onClick={() => toggleAccount(index)}
                          role="button"
                          tabIndex={0}
                          aria-expanded={openAccountIndex === index}
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
                                className={viewport === 'mobile' ? 'text-sm' : 'text-base'}
                                style={{ color: colors.text.primary }}
                              >
                                Bank
                              </span>
                            </div>
                          )}
                          <div
                            className={`
                              absolute left-1/2 transform -translate-x-1/2 rounded-full flex items-center justify-center border
                              ${viewport === 'mobile' ? '-bottom-1 w-4 h-4' : '-bottom-1 w-4 h-4'}
                            `}
                            style={{
                              backgroundColor: colors.background,
                              borderColor: colors.text.primary,
                            }}
                          >
                            <ChevronDown
                              className={`transition-transform duration-300 ${
                                openAccountIndex === index ? 'rotate-180' : ''
                              } ${viewport === 'mobile' ? 'w-2 h-2' : 'w-2 h-2'}`}
                              style={{ color: colors.text.primary }}
                            />
                          </div>
                        </div>
                        <MediumText
                          className={`text-center mb-0.5 line-clamp-2 ${
                            viewport === 'mobile' ? 'text-xs' : 'text-sm'
                          }`}
                          style={{ color: colors.text.primary }}
                          useThemeColor={false}
                        >
                          {account.bank}
                        </MediumText>
                        {openAccountIndex === index && (
                          <div
                            className={`rounded-lg border mt-1 p-3`}
                            style={{
                              backgroundColor: colors.background,
                              borderColor: colors.border.active,
                            }}
                          >
                            <div className={`space-y-2`}>
                              <div>
                                <BodySM
                                  className="mb-0.5 text-xs"
                                  style={{ color: colors.text.muted }}
                                  useThemeColor={false}
                                >
                                  Account Number
                                </BodySM>
                                <div className="flex items-center justify-between gap-1">
                                  <code
                                    className={`font-mono font-bold break-all text-xs`}
                                    style={{ color: colors.text.primary }}
                                  >
                                    {account.accountNumber}
                                  </code>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(account.accountNumber, index)
                                    }
                                    className={`rounded-full flex-shrink-0 p-1 transition-all duration-200`}
                                    style={{
                                      backgroundColor:
                                        copiedIndex === index
                                          ? colors.text.primary
                                          : `${colors.button.background}20`,
                                      color:
                                        copiedIndex === index
                                          ? colors.button.text
                                          : colors.text.primary,
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
                                  </button>
                                </div>
                              </div>
                              <div>
                                <BodySM
                                  className="mb-0.5 text-xs"
                                  style={{ color: colors.text.muted }}
                                  useThemeColor={false}
                                >
                                  Account Name
                                </BodySM>
                                <MediumText
                                  className={`break-words text-xs`}
                                  style={{ color: colors.text.primary }}
                                  useThemeColor={false}
                                >
                                  {account.accountName}
                                </MediumText>
                              </div>
                              <div
                                className={`rounded-lg border p-2`}
                                style={{
                                  backgroundColor: `${colors.button.background}20`,
                                  borderColor: colors.border.active,
                                }}
                              >
                                <div className="flex items-start gap-1">
                                  <Info
                                    className={`flex-shrink-0 mt-0.5 ${viewport === 'mobile' ? 'w-3 h-3' : 'w-3 h-3'}`}
                                    style={{ color: colors.text.primary }}
                                  />
                                  <Caption
                                    className="leading-relaxed"
                                    style={{ color: colors.text.muted }}
                                    useThemeColor={false}
                                  >
                                    <MediumText
                                      style={{ color: colors.text.muted }}
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
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={responsive.gap[viewport]}>
                <div className={`grid gap-2 ${viewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  <div
                    className="rounded-lg p-3 border"
                    style={{
                      backgroundColor: `${colors.button.background}20`,
                      borderColor: colors.border.active,
                    }}
                  >
                    <MediumText
                      className={`mb-0.5 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      Giving Tips
                    </MediumText>
                    <Caption
                      className={responsive.body[viewport]}
                      style={{ color: colors.text.muted }}
                      useThemeColor={false}
                    >
                      • Include your name in narration
                      <br />
                      • Keep transaction receipts
                      <br />• Contact for inquiries
                    </Caption>
                  </div>
                  <div
                    className="rounded-lg p-3 border"
                    style={{
                      backgroundColor: `${colors.button.background}20`,
                      borderColor: colors.border.active,
                    }}
                  >
                    <MediumText
                      className={`mb-0.5 ${responsive.body[viewport]} font-medium`}
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      Need Help?
                    </MediumText>
                    <Caption
                      className={responsive.body[viewport]}
                      style={{ color: colors.text.muted }}
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
                style={{ borderColor: colors.border.default }}
              >
                <Caption
                  className="mb-1"
                  style={{ color: colors.text.muted }}
                  useThemeColor={false}
                >
                  Thank you for your generous giving. May God bless you abundantly.
                </Caption>
                <button
                  onClick={handleClose}
                  className={`
                    rounded-lg transition-all duration-200
                    hover:scale-[1.02] active:scale-[0.98]
                    ${responsive.button[viewport]}
                  `}
                  style={{
                    backgroundColor: colors.button.background,
                    color: colors.button.text,
                  }}
                >
                  <MediumText 
                    className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                    style={{ color: colors.button.text }}
                    useThemeColor={false}
                  >
                    Close
                  </MediumText>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}