// utils/hooks/header.ts
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/contexts/ThemeContext';
import gsap from 'gsap';

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
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<Map<string, HTMLElement>>(new Map());
  const hoverEffectRef = useRef<HTMLDivElement>(null);

  // GSAP animations for hover effects
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const ctx = gsap.context(() => {
      // Setup hover effect element
      if (hoverEffectRef.current) {
        gsap.set(hoverEffectRef.current, {
          scale: 0,
          opacity: 0,
          borderRadius: '9999px'
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Handle scroll effect - More sensitive
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 30;
      setIsHeaderScrolled(scrolled);
      
      // Add subtle animation to header on scroll
      gsap.to('header', {
        y: scrolled ? -2 : 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hover effects
  useEffect(() => {
    if (!hoveredNav || typeof window === 'undefined') return;

    const element = navItemsRef.current.get(hoveredNav);
    if (element && hoverEffectRef.current) {
      const rect = element.getBoundingClientRect();
      
      gsap.killTweensOf(hoverEffectRef.current);
      
      gsap.to(hoverEffectRef.current, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        scale: 1,
        opacity: 0.1,
        duration: 0.3,
        ease: 'power2.out',
        borderRadius: '9999px',
        backgroundColor: colorScheme.primary
      });
    } else if (!hoveredNav && hoverEffectRef.current) {
      gsap.to(hoverEffectRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      });
    }
  }, [hoveredNav, colorScheme.primary]);

  // Handle click animation
  const animateClick = (element: HTMLElement) => {
    gsap.killTweensOf(element);
    
    gsap.timeline()
      .to(element, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.in'
      })
      .to(element, {
        scale: 1,
        duration: 0.2,
        ease: 'elastic.out(1, 0.5)'
      });
  };

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

  // Prevent body scroll when mobile sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
      // Animate sheet opening
      gsap.fromTo('.sheet-content',
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSheetOpen]);

  // Navigation handlers with animations
  const handleLinkClick = (
    href: string,
    hasDropdown: boolean,
    e: React.MouseEvent
  ) => {
    const target = e.currentTarget as HTMLElement;
    animateClick(target);
    
    if (hasDropdown && e.currentTarget === e.target) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === href ? null : href);
      return;
    }
    
    // Add navigation transition effect
    gsap.to('main', {
      opacity: 0.8,
      duration: 0.1,
      onComplete: () => {
        closeAllDropdowns();
        gsap.to('main', {
          opacity: 1,
          duration: 0.3
        });
      }
    });
  };

  const handleNavHover = (href: string, isHovering: boolean) => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) return;
    
    if (isHovering) {
      setHoveredNav(href);
    } else if (hoveredNav === href) {
      setHoveredNav(null);
    }
  };

  const handleNavMouseDown = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    gsap.to(target, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.in'
    });
  };

  const handleNavMouseUp = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    gsap.to(target, {
      scale: 1,
      duration: 0.2,
      ease: 'elastic.out(1, 0.5)'
    });
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setMobileOpenDropdown(null);
    setSheetOpen(false);
    setHoveredNav(null);
  };

  const handleDropdownItemClick = () => {
    closeAllDropdowns();
  };

  const toggleMobileDropdown = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Animate mobile dropdown
    const dropdownElement = document.querySelector(`[data-dropdown="${label}"]`);
    if (dropdownElement) {
      if (mobileOpenDropdown === label) {
        gsap.to(dropdownElement, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            setMobileOpenDropdown(null);
          }
        });
      } else {
        setMobileOpenDropdown(label);
        gsap.fromTo(dropdownElement,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    } else {
      setMobileOpenDropdown(mobileOpenDropdown === label ? null : label);
    }
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

  // Set nav item ref for GSAP animations
  const setNavItemRef = (href: string, element: HTMLElement | null) => {
    if (element) {
      navItemsRef.current.set(href, element);
    } else {
      navItemsRef.current.delete(href);
    }
  };

  return {
    // State
    isHeaderScrolled,
    activeDropdown,
    mobileOpenDropdown,
    isSheetOpen,
    isCommunityModalOpen,
    isQRDisplayOpen,
    hoveredNav,

    // Refs
    dropdownRef,
    hoverEffectRef,
    setNavItemRef,

    // Theme
    colorScheme,

    // State setters
    setActiveDropdown,
    setSheetOpen,
    setHoveredNav,

    // Handlers
    handleLinkClick,
    handleNavHover,
    handleNavMouseDown,
    handleNavMouseUp,
    handleDropdownItemClick,
    toggleMobileDropdown,
    openCommunityModal,
    closeCommunityModal,
    openQRDisplay,
    closeQRDisplay,
    isLinkActive,
    closeAllDropdowns,
    animateClick,
  };
};