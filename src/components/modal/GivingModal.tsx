'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Copy, Check, Info, X, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { WisdomeHouseLogo } from '../assets';
import { H4, BodyMD, BodySM, MediumText, Caption } from '@/components/text';

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

// Modern Modal Component (same structure as your example)
const ModernModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, mounted]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative w-full sm:w-full sm:max-w-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/50 shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-none sm:rounded-3xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/30 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white pr-4">{title}</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-2 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function GivingModal({
  isOpen,
  onClose,
  givingOption,
}: GivingModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // Get accent color from theme - using amber as fallback
  const accentColor = colorScheme.primary || '#f59e0b';

  if (!mounted || !givingOption || !isOpen) return null;

  return (
    <ModernModal isOpen={isOpen} onClose={onClose} title={givingOption.title}>
      <div className="space-y-4 sm:space-y-6">
        {/* Description */}
        <div className="text-center">
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {givingOption.description}
          </p>
        </div>

        {/* Scriptural Quote */}
        <div className="rounded-lg sm:rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 sm:p-6">
          <p className="text-slate-200 italic text-xs sm:text-sm font-medium leading-relaxed mb-2 sm:mb-3">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
          </p>
          <p className="text-amber-400 font-semibold text-xs sm:text-sm text-center">
            2 Corinthians 9:7
          </p>
        </div>

        {/* Account Details */}
        <div>
          <h3 className="text-white font-bold text-base sm:text-lg mb-4 text-center">Account Details</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {givingOption.accounts.map((account, idx) => (
              <div
                key={idx}
                className="rounded-lg sm:rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 sm:p-6 space-y-4 sm:space-y-5"
              >
                {/* Bank Name */}
                <div className="text-center">
                  <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Bank</p>
                  <div className="flex items-center justify-center gap-3">
                    {account.image ? (
                      <Image
                        src={account.image}
                        alt={account.bank}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 flex items-center justify-center">
                        <span className="text-amber-400 font-semibold text-sm">
                          {account.bank.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="text-white font-bold text-lg sm:text-2xl break-words">{account.bank}</p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                {/* Account Number */}
                <div className="text-center">
                  <p className="text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">Account Number</p>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 bg-slate-900/50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 border border-slate-700/50 mx-auto">
                    <code className="font-mono text-white font-bold text-base sm:text-xl tracking-wider break-all">
                      {account.accountNumber}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.accountNumber, idx)}
                      className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
                        copiedIndex === idx
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      }`}
                      title={copiedIndex === idx ? 'Copied!' : 'Copy account number'}
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

                {/* Account Name */}
                <div className="text-center">
                  <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Account Name</p>
                  <p className="text-white font-bold text-sm sm:text-lg break-words">{account.accountName}</p>
                </div>

                {/* Info Alert */}
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 sm:p-4 flex gap-2 sm:gap-3">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-slate-200 text-xs sm:text-sm font-medium">
                      Add <span className="text-amber-400 font-bold">narration</span> to your transaction
                    </p>
                    <p className="text-slate-400 text-xs mt-1">Include your name for proper record keeping</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-lg sm:rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-4 sm:p-5">
            <h4 className="text-white font-bold text-sm sm:text-base mb-3 flex items-center justify-center gap-2">
              <span className="text-amber-400 text-lg">✓</span> Tips
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">•</span>
                <span>Include your name</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">•</span>
                <span>Keep receipts</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">•</span>
                <span>Verify details</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg sm:rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-4 sm:p-5">
            <h4 className="text-white font-bold text-sm sm:text-base mb-3 flex items-center justify-center gap-2">
              <span className="text-amber-400 text-lg">?</span> Help
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">•</span>
                <span>Contact finance</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">•</span>
                <span>Request receipts</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">•</span>
                <span>Send inquiry</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="rounded-lg sm:rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-4 sm:p-6 text-center">
          <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
            Thank you for your generous giving. May God bless you abundantly.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95 text-sm sm:text-base"
        >
          Close
        </button>
      </div>
    </ModernModal>
  );
}