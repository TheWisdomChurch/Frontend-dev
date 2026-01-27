/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { OnlinegivingOptions } from '@/lib/data';
import { createScrollFunctions } from '../functionUtils/contactUtils';
export const useOnlineGiving = () => {
  const total = OnlinegivingOptions.length;
  const [isVisible, setIsVisible] = useState(false);
  const [selectedGivingOption, setSelectedGivingOption] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const handleGiveNow = (option: any) => {
    setSelectedGivingOption(option);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGivingOption(null);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
   
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    // Apply parallax effect to cards
    cardsRef.current.forEach((card, index) => {
      if (card && isHovered !== index) {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
       
        const distanceX = e.clientX - cardCenterX;
        const distanceY = e.clientY - cardCenterY;
       
        const rotateY = distanceX * 0.01;
        const rotateX = -distanceY * 0.01;
       
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }
    });
  };
  const handleMouseLeave = () => {
    if (isMobile) return;
   
    setMousePosition({ x: 0, y: 0 });
    cardsRef.current.forEach(card => {
      if (card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      }
    });
  };
  const handleCardHover = (index: number) => {
    if (isMobile) return;
    setIsHovered(index);
   
    // Reset all cards except hovered one
    cardsRef.current.forEach((card, i) => {
      if (card && i !== index) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(0.95)';
      }
    });
  };
  const handleCardLeave = (index: number) => {
    if (isMobile) return;
    setIsHovered(null);
   
    // Reset all cards
    cardsRef.current.forEach((card, i) => {
      if (card && i !== index) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      }
    });
  };
  const { scrollLeft, scrollRight } = createScrollFunctions(scrollContainerRef);
  const previousCard = () => setCurrentIndex(prev => Math.max(0, prev - 1));
  const nextCard = () => setCurrentIndex(prev => Math.min(total - 1, prev + 1));
  return {
    isVisible,
    setIsVisible,
    selectedGivingOption,
    isModalOpen,
    isHovered,
    mousePosition,
    isMobile,
    sectionRef,
    scrollContainerRef,
    cardsRef,
    handleGiveNow,
    closeModal,
    scrollLeft,
    scrollRight,
    handleMouseMove,
    handleMouseLeave,
    handleCardHover,
    handleCardLeave,
    currentIndex,
    previousCard,
    nextCard,
  };
};