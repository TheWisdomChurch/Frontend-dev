// utils/hooks/header.ts
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/contexts/ThemeContext';

export const useHeader = () => {
  const pathname = usePathname();
  const { colorScheme } = useTheme();

  // Header state
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(
    null
  );
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isQRDisplayOpen, setIsQRDisplayOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation handlers
  const handleLinkClick = (
    href: string,
    hasDropdown: boolean,
    e: React.MouseEvent
  ) => {
    if (hasDropdown && e.currentTarget === e.target) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === href ? null : href);
      return;
    }
    closeAllDropdowns();
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setMobileOpenDropdown(null);
    setSheetOpen(false);
  };

  const handleDropdownItemClick = () => {
    closeAllDropdowns();
  };

  const toggleMobileDropdown = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileOpenDropdown(mobileOpenDropdown === label ? null : label);
  };

  // Modal handlers
  const openCommunityModal = () => {
    setIsCommunityModalOpen(true);
    closeAllDropdowns();
  };

  const closeCommunityModal = () => {
    setIsCommunityModalOpen(false);
  };

  const openQRDisplay = () => {
    setIsQRDisplayOpen(true);
    closeAllDropdowns();
  };

  const closeQRDisplay = () => {
    setIsQRDisplayOpen(false);
  };

  // Check if link is active
  const isLinkActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return {
    // State
    isHeaderScrolled,
    activeDropdown,
    mobileOpenDropdown,
    isSheetOpen,
    isCommunityModalOpen,
    isQRDisplayOpen,

    // Refs
    dropdownRef,

    // Theme
    colorScheme,

    // State setters
    setActiveDropdown, // Add this
    setSheetOpen,

    // Handlers
    handleLinkClick,
    handleDropdownItemClick,
    toggleMobileDropdown,
    openCommunityModal,
    closeCommunityModal,
    openQRDisplay,
    closeQRDisplay,
    isLinkActive,
    closeAllDropdowns,
  };
};
