'use client';

import { AlertCircle, Building, Truck } from 'lucide-react';
import { BaseModal } from '@/shared/ui/modals/Modal';
import { Button } from '@/shared/ui/button';
import { H3, BodySM, Caption } from '@/shared/text';

interface OnlinePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTransfer: () => void;
}

// Same "feature unavailable" visual language as ServiceUnavailableSheet
// (src/shared/ui/modals/Modal.tsx), built directly on BaseModal instead of
// a bespoke portal/GSAP implementation — this one needs a second action
// (jump straight to bank transfer), which ServiceUnavailableSheet doesn't
// support.
const OnlinePaymentModal = ({
  isOpen,
  onClose,
  onSelectTransfer,
}: OnlinePaymentModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      showHandle
      showCloseButton={false}
      forceBottomSheet
      maxWidth="max-w-lg"
    >
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--app-primary)]/15 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-label font-bold uppercase tracking-[0.18em] text-white/75">
            <AlertCircle className="h-3.5 w-3.5 text-[var(--app-primary)]" />
            Service unavailable
          </div>
        </div>

        <div className="relative mt-5">
          <H3 className="text-white">Online payment is temporarily down</H3>
          <BodySM className="mt-2 text-white/65">
            Our online payment gateway is currently undergoing maintenance.
            Please use bank transfer or pay on delivery instead.
          </BodySM>
        </div>

        <div className="relative mt-5 space-y-2.5">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <div className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-blue-400/15 text-blue-300">
              <Building className="h-3.5 w-3.5" />
            </div>
            <Caption className="text-white/70">
              <strong className="text-white">Bank Transfer:</strong> transfer to
              our account and upload payment proof
            </Caption>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <div className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-yellow-400/15 text-yellow-300">
              <Truck className="h-3.5 w-3.5" />
            </div>
            <Caption className="text-white/70">
              <strong className="text-white">Pay on Delivery:</strong> pay with
              cash or card when your order arrives
            </Caption>
          </div>
        </div>

        <div className="relative mt-6 flex flex-col gap-2.5">
          <Button
            variant="primary"
            onClick={() => {
              onSelectTransfer();
              onClose();
            }}
            className="w-full"
          >
            Use Bank Transfer
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default OnlinePaymentModal;
