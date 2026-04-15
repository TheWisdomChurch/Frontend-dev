import { useState, useEffect } from 'react';

type ModalStep = 'welcome' | 'confession';

interface UseWelcomeModalProps {
  delay?: number;
  onClose?: () => void;
}

let hasSeenModalInRuntime = false;

const hasSeenThisSession = () => hasSeenModalInRuntime;

const markSeenThisSession = () => {
  hasSeenModalInRuntime = true;
};

export function useWelcomeModal({
  delay = 2200,
  onClose,
}: UseWelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>('welcome');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (hasSeenThisSession()) return;

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
