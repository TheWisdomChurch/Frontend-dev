import { useState, useEffect } from 'react';

type ModalStep = 'welcome' | 'confession';

interface UseWelcomeModalProps {
  delay?: number;
  onClose?: () => void;
}

const STORAGE_KEY = 'wisdom_welcomed';

let hasSeenModalInRuntime = false;

const hasSeenBefore = () => {
  if (hasSeenModalInRuntime) return true;
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
};

const markSeen = () => {
  hasSeenModalInRuntime = true;
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // storage unavailable — runtime flag still prevents re-show within session
  }
};

export function useWelcomeModal({
  delay = 10000,
  onClose,
}: UseWelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>('welcome');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (hasSeenBefore()) return;

    const showTimer = window.setTimeout(
      () => {
        setIsVisible(true);
        setCurrentStep('welcome');
      },
      Math.max(0, delay)
    );

    return () => window.clearTimeout(showTimer);
  }, [delay]);

  const closeAndPersist = () => {
    markSeen();
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
