/**
 * Smart Interactive Donation Widget
 * - Professional animations with GSAP
 * - Multiple payment methods
 * - Engagement tracking
 * - Responsive design
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useChurchAnalytics } from '@/shared/analytics/churchAnalytics';
import { useNotification } from '@/shared/contexts/NotificationContext';

interface DonationOption {
  label: string;
  amount: number;
  emoji?: string;
}

const DONATION_PRESETS: DonationOption[] = [
  { label: '₦1,000', amount: 1000, emoji: '🙏' },
  { label: '₦5,000', amount: 5000, emoji: '💝' },
  { label: '₦10,000', amount: 10000, emoji: '✨' },
  { label: '₦25,000', amount: 25000, emoji: '⭐' },
  { label: '₦50,000', amount: 50000, emoji: '🎇' },
  { label: 'Custom', amount: 0, emoji: '🎁' },
];

interface DonationWidgetProps {
  onSuccess?: (amount: number) => void;
  variant?: 'card' | 'inline' | 'modal';
}

export default function DonationWidget({
  onSuccess,
  variant = 'card',
}: DonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'bank' | 'mobile'
  >('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(variant !== 'card');

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { trackDonation } = useChurchAnalytics();
  const { notify } = useNotification();

  // ========================================
  // ANIMATIONS
  // ========================================

  useEffect(() => {
    if (!containerRef.current) return;

    if (isExpanded) {
      // Expand animation
      gsap.to(containerRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });

      // Stagger children
      const children = containerRef.current.querySelectorAll('.donation-item');
      gsap.from(children, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      // Collapse animation
      gsap.to(containerRef.current, {
        height: 'auto',
        opacity: 0.8,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [isExpanded]);

  // ========================================
  // BUTTON HOVER ANIMATION
  // ========================================

  const handleAmountHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
      boxShadow: '0 8px 24px rgba(201, 168, 76, 0.4)',
    });
  };

  const handleAmountHoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
      boxShadow:
        selectedAmount === parseInt(e.currentTarget.dataset.amount || '0')
          ? '0 4px 12px rgba(201, 168, 76, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
    });
  };

  // ========================================
  // AMOUNT SELECTION
  // ========================================

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');

    // Pulse animation
    const button = event?.currentTarget as HTMLButtonElement;
    if (button) {
      gsap.to(button, {
        boxShadow: '0 4px 12px rgba(201, 168, 76, 0.3)',
        duration: 0.4,
        repeat: 1,
        yoyo: true,
      });
    }
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, '');
    setCustomAmount(val);
    if (val) {
      setSelectedAmount(parseInt(val));
    } else {
      setSelectedAmount(null);
    }
  };

  // ========================================
  // PROCESS DONATION
  // ========================================

  const handleDonate = async () => {
    const amount =
      selectedAmount || (customAmount ? parseInt(customAmount) : 0);

    if (!amount || amount < 100) {
      notify('Minimum donation is ₦100', 'warning', 3000);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // ✅ Track donation
      trackDonation({
        amount,
        currency: 'NGN',
        method: paymentMethod,
        purpose: 'general',
        donorName: 'Anonymous Member',
        isAnonymous: true,
      });

      // Success animation
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });
      }

      notify(
        `Thank you for your generous donation of ₦${amount.toLocaleString()}!`,
        'success',
        5000
      );

      // Reset form
      setSelectedAmount(null);
      setCustomAmount('');
      onSuccess?.(amount);
    } catch (error) {
      notify('Donation failed. Please try again.', 'error', 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      ref={containerRef}
      className="donation-widget"
      style={{
        background:
          'linear-gradient(135deg, rgba(26,26,34,0.8), rgba(20,20,24,0.95))',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(201,168,76,0.2)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: 'var(--gold)',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            Support Our Ministry
          </h3>
          <p
            style={{
              margin: '4px 0 0 0',
              color: 'var(--text-secondary)',
              fontSize: '14px',
            }}
          >
            Your giving makes a difference
          </p>
        </div>
        <div
          style={{
            fontSize: '24px',
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Amount Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                display: 'block',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Select Amount
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: '8px',
              }}
            >
              {DONATION_PRESETS.map(preset =>
                preset.amount > 0 ? (
                  <button
                    key={preset.label}
                    className="donation-item"
                    data-amount={preset.amount}
                    onMouseEnter={handleAmountHover}
                    onMouseLeave={handleAmountHoverOut}
                    onClick={() => handleSelectAmount(preset.amount)}
                    style={{
                      padding: '12px 8px',
                      background:
                        selectedAmount === preset.amount
                          ? 'linear-gradient(135deg, #C9A84C, #B3942A)'
                          : 'rgba(201,168,76,0.1)',
                      border: `2px solid ${selectedAmount === preset.amount ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
                      borderRadius: '8px',
                      color:
                        selectedAmount === preset.amount
                          ? '#000'
                          : 'var(--text)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.label}</span>
                  </button>
                ) : null
              )}
            </div>
          </div>

          {/* Custom Amount */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                display: 'block',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Custom Amount (₦)
            </label>
            <input
              className="donation-item"
              type="number"
              value={customAmount}
              onChange={handleCustomAmount}
              placeholder="Enter custom amount"
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(201,168,76,0.05)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '14px',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                display: 'block',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Payment Method
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              {(['card', 'bank', 'mobile'] as const).map(method => (
                <button
                  key={method}
                  className="donation-item"
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    padding: '10px',
                    background:
                      paymentMethod === method
                        ? 'rgba(201,168,76,0.3)'
                        : 'rgba(201,168,76,0.1)',
                    border: `1px solid ${paymentMethod === method ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
                    borderRadius: '6px',
                    color: 'var(--text)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {method === 'card' && '💳 Card'}
                  {method === 'bank' && '🏦 Bank'}
                  {method === 'mobile' && '📱 Mobile'}
                </button>
              ))}
            </div>
          </div>

          {/* Donate Button */}
          <button
            ref={buttonRef}
            onClick={handleDonate}
            disabled={!selectedAmount || isProcessing}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: selectedAmount
                ? 'linear-gradient(135deg, #C9A84C, #B3942A)'
                : 'rgba(201,168,76,0.2)',
              color: selectedAmount ? '#000' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: selectedAmount ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity: isProcessing ? 0.7 : 1,
            }}
          >
            {isProcessing
              ? 'Processing...'
              : `Donate ₦${selectedAmount?.toLocaleString() || 0}`}
          </button>

          {/* Footer Message */}
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginTop: '12px',
              margin: '12px 0 0 0',
            }}
          >
            100% of donations go directly to ministry; tax receipt available
            upon request
          </p>
        </>
      )}
    </div>
  );
}
