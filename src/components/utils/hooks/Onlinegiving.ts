/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react';

import { createScrollFunctions } from '../functionUtils/contactUtils';

export const useOnlineGiving = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedGivingOption, setSelectedGivingOption] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleGiveNow = (option: any) => {
    setSelectedGivingOption(option);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGivingOption(null);
  };

  const { scrollLeft, scrollRight } = createScrollFunctions(scrollContainerRef);

  return {
    isVisible,
    setIsVisible,
    selectedGivingOption,
    isModalOpen,
    sectionRef,
    scrollContainerRef,
    handleGiveNow,
    closeModal,
    scrollLeft,
    scrollRight,
  };
};
