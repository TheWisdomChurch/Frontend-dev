import { useEffect, useRef, useState } from 'react';

export const useSeniorPastor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const handleLearnMore = () => {
    console.log('Learn more clicked');
    // You can replace this with navigation or modal opening
  };

  return {
    isVisible,
    sectionRef,
    handleLearnMore,
  };
};
