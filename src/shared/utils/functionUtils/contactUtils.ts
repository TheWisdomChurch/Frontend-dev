import { useEffect } from 'react';

// Contact-related utility functions
export const contactPhoneNumber =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || '+2347069995333';

export const handleContactCall = () => {
  if (!contactPhoneNumber) {
    console.error('Phone number not configured');
    return;
  }

  // Create a confirmation dialog for better UX
  if (window.confirm(`Do you want to call ${contactPhoneNumber}?`)) {
    window.location.href = `tel:${contactPhoneNumber}`;
  }
};

// Scroll utility functions - FIXED: Accept HTMLDivElement | null
export const createScrollFunctions = (
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
) => {
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

  return { scrollLeft, scrollRight };
};

// Intersection Observer utility - FIXED: Accept HTMLDivElement | null
export const useIntersectionObserver = (
  setIsVisible: (visible: boolean) => void,
  sectionRef: React.RefObject<HTMLDivElement | null>
) => {
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
  }, [setIsVisible, sectionRef]);
};
