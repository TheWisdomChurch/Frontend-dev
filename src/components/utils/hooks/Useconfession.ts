import { useState, useEffect } from 'react';

type ModalStep = 'welcome' | 'confession';

interface UseWelcomeModalProps {
  delay?: number;
  onClose?: () => void;
}

const CONFESSION_STORAGE_KEY = 'wc_confession_modal_next_show_v1';
const CONFESSION_COOLDOWN_MS = 1000 * 60 * 60 * 8;

const getNextAllowedTime = () => {
  if (typeof window === 'undefined') return 0;
  const raw = window.localStorage.getItem(CONFESSION_STORAGE_KEY);
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
};

const setNextAllowedTime = (nextAllowedAt: number) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONFESSION_STORAGE_KEY, String(nextAllowedAt));
};

export function useWelcomeModal({ delay = 2200, onClose }: UseWelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>('welcome');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const now = Date.now();
    const nextAllowedAt = getNextAllowedTime();
    if (nextAllowedAt > now) return;

    const showTimer = window.setTimeout(() => {
      setIsVisible(true);
      setCurrentStep('welcome');
    }, Math.max(0, delay));

    return () => window.clearTimeout(showTimer);
  }, [delay]);

  const closeAndPersist = () => {
    setNextAllowedTime(Date.now() + CONFESSION_COOLDOWN_MS);
    setIsVisible(false);
    onClose?.();
  };

  return {
    isVisible,
    currentStep,
    mounted,
    handleClose: closeAndPersist,
    showConfession: () => setCurrentStep('confession'),
    showWelcome: () => setCurrentStep('welcome'),
  };
}

