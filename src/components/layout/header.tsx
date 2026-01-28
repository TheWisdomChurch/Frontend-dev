/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/utils/buttons/CustomButton';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import {
  Menu,
  Church,
  Home,
  Users,
  Calendar,
  BookOpen,
  Phone,
  X,
  ChevronRight,
} from 'lucide-react';
import { extendedNavLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '@/components/assets';
import { cn } from '@/lib/cn';
import { BricolageText, Caption, SmallText } from '../text'; 
import JoinCommunityModal from '../modal/joinUsModal';
import { useHeader } from '../utils/hooks/header';

const iconMap = {
  Home: Home,
  Users: Users,
  Calendar: Calendar,
  BookOpen: BookOpen,
  Phone: Phone,
};

export default function Header() {
  const {
    isHeaderScrolled,
    isSheetOpen,
    isCommunityModalOpen,
    colorScheme,
    setSheetOpen,
    handleLinkClick,
    handleNavHover,
    handleNavMouseDown,
    handleNavMouseUp,
    openCommunityModal,
    closeCommunityModal,
    isLinkActive,
    closeAllDropdowns,
    hoveredNav,
    setNavItemRef,
  } = useHeader();

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 w-full transition-all duration-300',
          isHeaderScrolled
            ? 'h-16 bg-[rgba(6,6,6,0.92)] backdrop-blur-2xl border-b border-white/10 shadow-xl'
            : 'h-20 bg-[rgba(6,6,6,0.85)] backdrop-blur-2xl'
        )}
      >
        <div
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          aria-hidden
        />
        <div className="h-full mx-auto px-4 sm:px-5 lg:px-8 max-w-7xl">
          <div className="h-full flex items-center justify-between gap-3">
            {/* Logo on Left */}
            <Link
              href="/"
              onClick={closeAllDropdowns}
              className="flex items-center gap-2 group relative z-10"
            >
              <div className="relative">
                <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-black to-gray-900 p-0.5">
                  <div className="absolute inset-0 rounded-full border border-white/20" />
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                    <Image
                      src={WisdomeHouseLogo}
                      alt="The Wisdom House"
                      width={22}
                      height={22}
                      className="rounded-full object-cover scale-90 group-hover:scale-95 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* White Divider */}
              <div className="hidden md:block h-4 w-px bg-white/20 mx-1" />

              {/* Ultra Compact Stacked Logo Text */}
              <div className="hidden md:flex flex-col leading-[0.8] -space-y-0.5">
                <Caption className="text-white opacity-70 tracking-[0.2em] uppercase text-[7px]">
                  The
                </Caption>
                <Caption
                  weight="semibold"
                  className="text-[9px] tracking-tight leading-none"
                  style={{ color: colorScheme.primary }}
                >
                  Wisdom
                </Caption>
                <Caption
                  weight="semibold"
                  className="text-[9px] tracking-tight leading-none"
                  style={{ color: colorScheme.primary }}
                >
                  Church
                </Caption>
              </div>
            </Link>

            {/* Desktop Navigation - Only on xl screens */}
            <nav className="hidden xl:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/10">
                {extendedNavLinks.map(link => {
                  const isActive = isLinkActive(link.href);
                  const Icon = iconMap[link.icon as keyof typeof iconMap];

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      ref={(el) => setNavItemRef(link.href, el)}
                      onClick={e => handleLinkClick(link.href, false, e)}
                      onMouseEnter={() => handleNavHover(link.href, true)}
                      onMouseLeave={() => handleNavHover(link.href, false)}
                      onMouseDown={handleNavMouseDown}
                      onMouseUp={handleNavMouseUp}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold transition-all duration-300 rounded-full group relative',
                        isActive
                          ? 'text-white bg-primary shadow-md'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      )}
                      style={{
                        transform: hoveredNav === link.href ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {Icon && (
                        <Icon className="w-2.5 h-2.5 transition-transform group-hover:scale-110" />
                      )}
                      <span className="text-[11px]">{link.label}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -bottom-0.5 left-3 right-3 h-[1px] bg-white/80 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Desktop Join Us Button */}
              <Button
                onClick={openCommunityModal}
                className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-medium rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(120deg, ${colorScheme.primary} 0%, ${colorScheme.primaryDark} 100%)`,
                  color: '#000000',
                  boxShadow: `0 10px 30px ${colorScheme.opacity.primary20}`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Church className="w-3 h-3" />
                  <span>Join Us</span>
                </div>
              </Button>

              {/* Mobile/Tablet Menu */}
              <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    className="xl:hidden flex items-center justify-center p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105"
                    aria-label="Open menu"
                  >
                    <Menu className="w-4 h-4 md:w-4 md:h-4 text-white" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="sheet-content w-full max-w-[260px] sm:max-w-[280px] p-0 border-l border-white/20 bg-black/95 backdrop-blur-xl"
                >
                  <MobileNavigation
                    colorScheme={colorScheme}
                    isLinkActive={isLinkActive}
                    setSheetOpen={setSheetOpen}
                    openCommunityModal={openCommunityModal}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <JoinCommunityModal
        isOpen={isCommunityModalOpen}
        onClose={closeCommunityModal}
      />
    </>
  );
}

// Compact Mobile & Tablet Navigation
const MobileNavigation: React.FC<{
  colorScheme: any;
  isLinkActive: (href: string) => boolean;
  setSheetOpen: (open: boolean) => void;
  openCommunityModal: () => void;
}> = ({ colorScheme, isLinkActive, setSheetOpen, openCommunityModal }) => {
  const { animateClick } = useHeader();

  const handleMobileLinkClick = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    animateClick(target);
    setTimeout(() => setSheetOpen(false), 200);
  };

  const handleMobileButtonClick = () => {
    setSheetOpen(false);
    setTimeout(openCommunityModal, 200);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-black to-gray-900 p-0.5">
            <div className="absolute inset-0 rounded-full border border-white/20" />
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src={WisdomeHouseLogo}
                alt="Logo"
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            </div>
          </div>
          
          {/* White Divider */}
          <div className="h-5 w-px bg-white/20 mx-1" />

          {/* Compact Stacked Text */}
          <div className="flex flex-col leading-[0.8] -space-y-0.5">
            <Caption className="text-white opacity-70 tracking-[0.2em] uppercase text-[8px] sm:text-[9px]">
              The
            </Caption>
            <BricolageText
              weight="semibold"
              className="text-[10px] sm:text-[11px] tracking-tight leading-none"
              style={{ color: colorScheme.primary }}
            >
              Wisdom
            </BricolageText>
            <BricolageText
              weight="semibold"
              className="text-[10px] sm:text-[11px] tracking-tight leading-none"
              style={{ color: colorScheme.primary }}
            >
              Church
            </BricolageText>
          </div>
        </div>
        
        <button
          onClick={() => setSheetOpen(false)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Compact Navigation */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {extendedNavLinks.map(link => {
          const isActive = isLinkActive(link.href);
          const Icon = iconMap[link.icon as keyof typeof iconMap];

          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleMobileLinkClick}
              className={cn(
                'flex items-center gap-2 p-2 sm:p-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary/15 border-l border-primary'
                  : 'hover:bg-white/5'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-lg transition-colors flex-shrink-0',
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-gray-300 group-hover:text-white group-hover:bg-primary/20'
              )}>
                {Icon && <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-[11px] mb-0.5 truncate">
                  {link.label}
                </div>
                <div className="text-[9px] text-gray-400 truncate">
                  {link.href === '/' && 'Homepage'}
                  {link.href === '/leadership' && 'Leadership team'}
                  {link.href === '/events' && 'Events & schedules'}
                  {link.href === '/teachings' && 'Teachings & resources'}
                  {link.href === '/contact' && 'Contact & location'}
                </div>
              </div>

              <ChevronRight className={cn(
                'w-3 h-3 flex-shrink-0',
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-500 group-hover:text-white'
              )} />
            </Link>
          );
        })}
      </div>

      {/* Compact Footer */}
      <div className="p-3 sm:p-4 border-t border-white/10">
        <div className="mb-2">
          <div className="text-[11px] text-gray-300 mb-0.5">Ready to join?</div>
          <div className="text-[9px] text-gray-400">Become part of our community</div>
        </div>
        
        <Button
          onClick={handleMobileButtonClick}
          className="w-full py-2 text-[11px] font-medium rounded-lg transition-all duration-300"
          style={{
            backgroundColor: colorScheme.primary,
            color: '#000000',
          }}
        >
          <div className="flex items-center justify-center gap-1">
            <Church className="w-2.5 h-2.5" />
            <span>Join Community</span>
          </div>
        </Button>

        <div className="mt-2 pt-2 border-t border-white/5">
          <Link
            href="/about"
            onClick={() => setSheetOpen(false)}
            className="text-[10px] text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            Learn more <ChevronRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </div>
  ); 
};
