import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type ModalStep = 'welcome' | 'confession';

interface UseWelcomeModalProps {
  delay?: number;
  onClose?: () => void;
}

export function useWelcomeModal({ delay = 2000, onClose }: UseWelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>('welcome');
  const [mounted, setMounted] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if popup should be shown
  useEffect(() => {
    setMounted(true);

    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    const lastSeenDate = localStorage.getItem('popupLastSeen');
    const today = new Date().toDateString();

    if (!hasSeenPopup || lastSeenDate !== today) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(showTimer);
    }
  }, [delay]);

  // Handle modal animations and body scroll
  useEffect(() => {
    if (isVisible && modalRef.current) {
      document.body.style.overflow = 'hidden';

      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Animate step transitions
  const animateStepTransition = (newStep: ModalStep) => {
    if (!contentRef.current) return;

    const tl = gsap.timeline();

    tl.to(contentRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.25,
      ease: 'power2.inOut',
    })
      .add(() => setCurrentStep(newStep))
      .fromTo(
        contentRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
  };

  // Handle modal close
  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setIsVisible(false);
          localStorage.setItem('hasSeenPopup', 'true');
          localStorage.setItem('popupLastSeen', new Date().toDateString());
          onClose?.();
        },
      });
    }
  };

  // Navigate to confession
  const showConfession = () => {
    animateStepTransition('confession');
  };

  // Navigate to welcome
  const showWelcome = () => {
    animateStepTransition('welcome');
  };

  return {
    isVisible,
    currentStep,
    mounted,
    modalRef,
    contentRef,
    handleClose,
    showConfession,
    showWelcome,
  };
}