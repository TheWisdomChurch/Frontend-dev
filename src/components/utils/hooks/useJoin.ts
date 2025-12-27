'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';

// Animation Manager Class
interface CardElements {
  title: HTMLElement | null;
  button: HTMLElement | null;
  icon: HTMLElement | null;
  card: HTMLElement | null;
}

class CardAnimationManager {
  private static instance: CardAnimationManager;
  private tl: gsap.core.Timeline | null = null;
  private currentCardIndex: number | null = null;
  private isAnimating = false;
  private animationSpeed = 0.6;

  public static getInstance(): CardAnimationManager {
    if (!CardAnimationManager.instance) {
      CardAnimationManager.instance = new CardAnimationManager();
    }
    return CardAnimationManager.instance;
  }

  private getElements(index: number): CardElements {
    const card = document.querySelector(`[data-card-index="${index}"]`);
    if (!card) return { title: null, button: null, icon: null, card: null };

    return {
      title: card.querySelector('[data-card-title]'),
      button: card.querySelector('[data-card-button]'),
      icon: card.querySelector('[data-card-icon]'),
      card: card as HTMLElement
    };
  }

  private createDoorAnimation(elements: CardElements, isEntering: boolean) {
    if (this.isAnimating || !elements.card || !elements.title || !elements.button) return;
    
    this.isAnimating = true;
    this.tl?.kill();
    this.tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: this.animationSpeed },
      onComplete: () => {
        this.isAnimating = false;
        if (!isEntering) {
          this.currentCardIndex = null;
        }
      }
    });

    if (isEntering) {
      // Door opening animation - elements come from outside
      this.tl
        // Reset positions first
        .set(elements.title, { y: -100, opacity: 0, scale: 0.8 })
        .set(elements.button, { y: 100, opacity: 0, scale: 0.8 })
        .set(elements.icon, { scale: 0, opacity: 0 })
        .set(elements.card, { zIndex: 100 })
        
        // Animate card scale and border
        .to(elements.card, {
          scale: 1.05,
          borderColor: "rgba(255, 255, 255, 0.6)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
          duration: this.animationSpeed * 0.8
        })
        
        // Door swing effect for icon
        .to(elements.icon, {
          scale: 1.2,
          rotate: 360,
          opacity: 1,
          duration: this.animationSpeed * 0.6
        }, "<")
        
        // Title comes down from top like a door opening
        .to(elements.title, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: this.animationSpeed,
          ease: "back.out(1.7)"
        })
        
        // Button comes up from bottom
        .to(elements.button, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: this.animationSpeed,
          ease: "back.out(1.7)"
        }, "<")
        
        // Final polish
        .to(elements.icon, {
          scale: 1,
          rotate: 0,
          duration: this.animationSpeed * 0.3
        }, "-=0.3")
        .to(elements.card, {
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5)",
          duration: this.animationSpeed * 0.5
        }, "-=0.2");

    } else {
      // Door closing animation - elements exit
      this.tl
        // Title goes up
        .to(elements.title, {
          y: -100,
          opacity: 0,
          scale: 0.8,
          duration: this.animationSpeed * 0.8,
          ease: "power4.in"
        })
        
        // Button goes down
        .to(elements.button, {
          y: 100,
          opacity: 0,
          scale: 0.8,
          duration: this.animationSpeed * 0.8,
          ease: "power4.in"
        }, "<")
        
        // Icon spins out
        .to(elements.icon, {
          scale: 0,
          rotate: -360,
          opacity: 0,
          duration: this.animationSpeed * 0.6
        }, "<")
        
        // Card returns to normal
        .to(elements.card, {
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.3)",
          boxShadow: "none",
          zIndex: "auto",
          duration: this.animationSpeed
        }, "<");
    }
  }

  private createMobileTapAnimation(elements: CardElements, isOpening: boolean) {
    if (this.isAnimating || !elements.card || !elements.title || !elements.button) return;
    
    this.isAnimating = true;
    this.tl?.kill();
    this.tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: this.animationSpeed * 0.8 },
      onComplete: () => {
        this.isAnimating = false;
        if (!isOpening) {
          this.currentCardIndex = null;
        }
      }
    });

    if (isOpening) {
      // Mobile tap open animation
      this.tl
        .set(elements.title, { y: -50, opacity: 0 })
        .set(elements.button, { y: 50, opacity: 0 })
        .set(elements.icon, { scale: 0.5, opacity: 0 })
        
        // Card expands slightly
        .to(elements.card, {
          scale: 1.02,
          borderColor: "rgba(255, 255, 255, 0.5)",
          duration: this.animationSpeed * 0.5
        })
        
        // Elements slide in with bounce
        .to(elements.icon, {
          scale: 1,
          opacity: 1,
          duration: this.animationSpeed * 0.6,
          ease: "back.out(1.5)"
        })
        
        .to(elements.title, {
          y: 0,
          opacity: 1,
          duration: this.animationSpeed * 0.7,
          ease: "back.out(1.7)"
        }, "-=0.4")
        
        .to(elements.button, {
          y: 0,
          opacity: 1,
          duration: this.animationSpeed * 0.7,
          ease: "back.out(1.7)"
        }, "<");

    } else {
      // Mobile close animation
      this.tl
        .to(elements.title, {
          y: -50,
          opacity: 0,
          duration: this.animationSpeed * 0.6,
          ease: "power4.in"
        })
        
        .to(elements.button, {
          y: 50,
          opacity: 0,
          duration: this.animationSpeed * 0.6,
          ease: "power4.in"
        }, "<")
        
        .to(elements.icon, {
          scale: 0.5,
          opacity: 0,
          duration: this.animationSpeed * 0.5
        }, "<")
        
        .to(elements.card, {
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.3)",
          duration: this.animationSpeed * 0.5
        });
    }
  }

  public animateCardEnter(index: number, isMobile: boolean = false): void {
    if (this.currentCardIndex === index || this.isAnimating) return;
    
    if (this.currentCardIndex !== null) {
      // Animate out the previous card first
      const prevElements = this.getElements(this.currentCardIndex);
      if (prevElements.card) {
        if (isMobile) {
          this.createMobileTapAnimation(prevElements, false);
        } else {
          this.createDoorAnimation(prevElements, false);
        }
      }
    }

    this.currentCardIndex = index;
    const elements = this.getElements(index);

    if (elements.card) {
      if (isMobile) {
        this.createMobileTapAnimation(elements, true);
      } else {
        this.createDoorAnimation(elements, true);
      }
    }
  }

  public animateCardLeave(index: number, isMobile: boolean = false): void {
    if (this.currentCardIndex !== index || this.isAnimating) return;
    
    const elements = this.getElements(index);
    if (elements.card) {
      if (isMobile) {
        this.createMobileTapAnimation(elements, false);
      } else {
        this.createDoorAnimation(elements, false);
      }
    }
    this.currentCardIndex = null;
  }

  public resetAllCards(): void {
    this.tl?.kill();
    this.currentCardIndex = null;
    this.isAnimating = false;
    
    // Reset all cards to initial state
    document.querySelectorAll('[data-card-index]').forEach(card => {
      gsap.set(card, {
        scale: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        boxShadow: "none",
        zIndex: "auto"
      });
      
      const title = card.querySelector('[data-card-title]');
      const button = card.querySelector('[data-card-button]');
      const icon = card.querySelector('[data-card-icon]');
      
      if (title) gsap.set(title, { y: 0, opacity: 1, scale: 1 });
      if (button) gsap.set(button, { y: 0, opacity: 1, scale: 1 });
      if (icon) gsap.set(icon, { scale: 1, opacity: 1, rotate: 0 });
    });
  }
}

// Create and export singleton instance
export const cardAnimator = CardAnimationManager.getInstance();

// Main Hook
export const useJoinWisdomHouse = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleLearnMore = useCallback((department: string) => {
    setSelectedDepartment(department);
    setShowForm(true);
  }, []);

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, []);

  const addToRefs = useCallback((el: HTMLDivElement | null, index: number) => {
    cardRefs.current[index] = el;
  }, []);

  const handleCardEnter = useCallback((index: number, e: React.MouseEvent) => {
    // Use GSAP animation instead of direct style manipulation
    cardAnimator.animateCardEnter(index, false);
  }, []);

  const handleCardLeave = useCallback((index: number, e: React.MouseEvent) => {
    cardAnimator.animateCardLeave(index, false);
  }, []);

  const handleFormSubmit = useCallback(async (data: any) => {
    setIsSubmitting(true);
    try {
      // API call to submit form data
      console.log('Submitting application:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Application submitted successfully! We\'ll contact you soon.');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Reset animations on unmount
  useEffect(() => {
    return () => {
      cardAnimator.resetAllCards();
    };
  }, []);

  return {
    selectedDepartment,
    showForm,
    setShowForm,
    isSubmitting,
    sectionRef,
    scrollContainerRef,
    cardRefs,
    addToRefs,
    handleLearnMore,
    scrollLeft,
    scrollRight,
    handleCardEnter,
    handleCardLeave,
    handleFormSubmit,
    // Export animation manager for direct access if needed
    cardAnimator,
  };
};