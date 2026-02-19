import { useState, useEffect } from 'react';

type ModalStep = 'welcome' | 'confession';

interface UseWelcomeModalProps {
  delay?: number;
  onClose?: () => void;
}

const CONFESSION_SESSION_KEY = 'wc_confession_modal_seen_session_v3';

const hasSeenThisSession = () => {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(CONFESSION_SESSION_KEY) === '1';
};

const markSeenThisSession = () => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(CONFESSION_SESSION_KEY, '1');
};

export function useWelcomeModal({ delay = 2200, onClose }: UseWelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>('welcome');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (hasSeenThisSession()) return;

    const showTimer = window.setTimeout(() => {
      setIsVisible(true);
      setCurrentStep('welcome');
    }, Math.max(0, delay));

    return () => window.clearTimeout(showTimer);
  }, [delay]);

  const closeAndPersist = () => {
    markSeenThisSession();
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
