import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useJoinWisdomHouse = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Add card to ref array
  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current[index] = el;
    }
  };

  const handleLearnMore = (department: string) => {
    setSelectedDepartment(department);
    setShowForm(true);
  };

  // Scroll functions for mobile
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // GSAP animations for cards entrance only
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        {
          y: 80,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle card hover with proper event handling
  const handleCardEnter = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCard(index);
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.killTweensOf(card);
    gsap.killTweensOf(card.querySelector('img'));
    gsap.killTweensOf(card.querySelector('.card-content'));

    gsap.to(card, {
      y: -12,
      scale: 1.03,
      duration: 0.5,
      ease: 'power2.out',
    });

    const image = card.querySelector('img');
    if (image) {
      gsap.to(image, {
        scale: 1.1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    const content = card.querySelector('.card-content');
    if (content) {
      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const handleCardLeave = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCard(null);
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.killTweensOf(card);
    gsap.killTweensOf(card.querySelector('img'));
    gsap.killTweensOf(card.querySelector('.card-content'));

    gsap.to(card, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });

    const image = card.querySelector('img');
    if (image) {
      gsap.to(image, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    const content = card.querySelector('.card-content');
    if (content) {
      gsap.to(content, {
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return {
    isVisible,
    activeCard,
    selectedDepartment,
    showForm,
    sectionRef,
    cardsRef,
    scrollContainerRef,
    addToRefs,
    handleLearnMore,
    scrollLeft,
    scrollRight,
    handleCardEnter,
    handleCardLeave,
    setShowForm,
  };
};
