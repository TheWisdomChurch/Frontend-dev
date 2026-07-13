'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { AlertCircle, Building, Truck, X } from 'lucide-react';
import { Button } from '@/shared/utils/buttons';
import { FlexboxLayout } from '@/shared/layout';
import { H4, SmallText, Caption } from '@/shared/text';
import { useIsClient, useMediaQuery } from '@/hooks';

interface OnlinePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTransfer: () => void;
}

const OnlinePaymentModal = ({
  isOpen,
  onClose,
  onSelectTransfer,
}: OnlinePaymentModalProps) => {
  const mounted = useIsClient();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
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
    if (e.target === e.currentTarget) handleClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-3 ${isMobile ? 'pb-0' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border shadow-xl bg-black border-[var(--app-primary)]
          ${isMobile ? 'rounded-t-2xl rounded-b-none max-h-[85vh]' : 'rounded-2xl max-w-md max-h-[85vh]'}
        `}
      >
        {isMobile && (
          <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1 rounded-full bg-[var(--app-primary)]" />
          </div>
        )}

        <div className="flex flex-col h-full">
          <div className="relative h-12 flex items-center justify-center border-b border-[var(--app-primary)] px-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-2.5 right-2.5 min-h-0 h-7 w-7 p-1 bg-[var(--app-primary)]/10"
            >
              <X className="w-3 h-3 text-[var(--app-primary)]" />
            </Button>

            <H4
              fontFamily="bricolage"
              className="text-base text-[var(--app-primary)]"
              useThemeColor={false}
              weight="bold"
            >
              Service Unavailable
            </H4>
          </div>

          <div
            className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(85vh-7rem)]' : 'p-5 max-h-[calc(85vh-8rem)]'}`}
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
                </div>

                <SmallText
                  weight="semibold"
                  className="text-sm mb-1 text-[var(--app-primary)]"
                >
                  Online Payment Temporarily Unavailable
                </SmallText>

                <Caption className="text-xs mb-3 text-white">
                  Our online payment gateway is currently undergoing
                  maintenance. Please use our bank transfer option or pay on
                  delivery.
                </Caption>
              </div>

              <div className="space-y-2">
                <FlexboxLayout align="center" gap="sm">
                  <div className="w-4 h-4 rounded-full bg-blue-400/20 flex items-center justify-center flex-shrink-0">
                    <Building className="w-2.5 h-2.5 text-blue-400" />
                  </div>
                  <Caption className="text-xs text-white">
                    <strong>Bank Transfer:</strong> Transfer to our account and
                    upload payment proof
                  </Caption>
                </FlexboxLayout>

                <FlexboxLayout align="center" gap="sm">
                  <div className="w-4 h-4 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-2.5 h-2.5 text-yellow-400" />
                  </div>
                  <Caption className="text-xs text-white">
                    <strong>Pay on Delivery:</strong> Pay with cash or card when
                    your order arrives
                  </Caption>
                </FlexboxLayout>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--app-primary)] p-3">
            <FlexboxLayout direction="column" gap="xs">
              <Button
                variant="primary"
                size="md"
                curvature="xl"
                onClick={() => {
                  handleClose();
                  onSelectTransfer();
                }}
                className="w-full py-2 text-sm font-semibold"
              >
                Use Bank Transfer
              </Button>

              <Button
                variant="outline"
                size="md"
                curvature="xl"
                onClick={handleClose}
                className="w-full py-2 border-[var(--app-primary)] text-sm font-medium text-[var(--app-primary)]"
              >
                Close
              </Button>
            </FlexboxLayout>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OnlinePaymentModal;
