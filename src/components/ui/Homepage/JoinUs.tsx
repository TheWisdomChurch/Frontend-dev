'use client';

import { WisdomeHouseLogo, Workforce_bg } from '@/components/assets';
import { H2, BaseText, BodySM } from '@/components/text';
import Button from '@/components/utils/buttons/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { useJoinWisdomHouse } from '@/components/utils/hooks/useJoin';
import { JoinUsModal } from '@/components/modal/DepartmentModals';
import { ChevronLeft, ChevronRight, Users, Video, Music, Baby, Users2, Cpu, ArrowRight } from 'lucide-react';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import Image from 'next/image';
import { RefObject, useState } from 'react';

// Department data - simplified without descriptions
const departments = [
  {
    title: 'Ushers',
    gradient: 'from-purple-500 to-pink-500',
    icon: Users,
  },
  {
    title: 'Media Team',
    gradient: 'from-blue-500 to-cyan-500',
    icon: Video,
  },
  {
    title: 'Wave City Music',
    gradient: 'from-amber-500 to-orange-500',
    icon: Music,
  },
  {
    title: 'Children Ministry',
    gradient: 'from-green-500 to-emerald-500',
    icon: Baby,
  },
  {
    title: 'Youth Ministry',
    gradient: 'from-indigo-500 to-purple-500',
    icon: Users2,
  },
  {
    title: 'Technical Team',
    gradient: 'from-slate-600 to-zinc-800',
    icon: Cpu,
  },
];

/* --------------------------------------------
   DEPARTMENT CARD COMPONENT with Flip Animation
--------------------------------------------- */
interface DepartmentCardProps {
  dept: typeof departments[0];
  colorScheme: any;
  onLearnMore: (title: string) => void;
  isMobile?: boolean;
  addToRefs?: (el: HTMLDivElement | null, index: number) => void;
  index?: number;
}

function DepartmentCard({
  dept,
  colorScheme,
  onLearnMore,
  isMobile = false,
  index,
}: DepartmentCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = dept.icon;

  const {
    handleCardEnter,
    handleCardLeave,
  } = useJoinWisdomHouse();

  const handleMouseEnter = () => {
    if (!isMobile && index !== undefined) {
      handleCardEnter(index, {} as React.MouseEvent);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && index !== undefined) {
      handleCardLeave(index, {} as React.MouseEvent);
    }
  };

  const handleCardClick = () => {
    if (isMobile && index !== undefined) {
      // On mobile, handle tap animation
      handleCardEnter(index, {} as React.MouseEvent);
      
      // Flip the card after a short delay for better UX
      setTimeout(() => {
        setIsFlipped(!isFlipped);
      }, 150);
    }
  };

  const frontCardClasses = `absolute inset-0 bg-gradient-to-br ${dept.gradient} backdrop-blur-sm rounded-2xl border-2 border-white/30 p-6 flex flex-col items-center justify-center transition-transform duration-300 cursor-pointer ${
    !isMobile ? 'hover:scale-105' : ''
  }`;

  const backCardClasses = `absolute inset-0 bg-gradient-to-br from-gray-900 to-black backdrop-blur-md rounded-2xl border-2 border-white/20 p-6 flex flex-col items-center justify-center`;

  return (
    <div
      className={`relative ${isMobile ? 'flex-shrink-0 w-72 h-72' : 'h-64'} perspective-1000`}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-card-index={index}
    >
      {/* Card Container */}
      <div
        className={`relative w-full h-full transition-all duration-500 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className={`${frontCardClasses} backface-hidden`}>
          {/* Logo/Icon */}
          <div className="relative mb-4">
            <div 
              className="absolute inset-0 rounded-full opacity-30"
              style={{ background: colorScheme.primary }} 
            />
            <div 
              className="relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40"
              data-card-icon
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-xl text-white text-center mb-6"
            data-card-title
          >
            {dept.title}
          </BaseText>

          {/* Mobile Flip Indicator */}
          {isMobile && (
            <div className="absolute bottom-3 text-xs text-white/70">
              Tap to flip
            </div>
          )}
        </div>

        {/* BACK SIDE */}
        <div className={`${backCardClasses} backface-hidden rotate-y-180`}>
          {/* Department Title on Back */}
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className="text-xl text-white text-center mb-4"
            style={{ color: colorScheme.primary }}
          >
            {dept.title}
          </BaseText>

          {/* Join Button */}
          <button
            className="w-full py-3 px-4 font-bold shadow-xl border-2 border-white/40 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: colorScheme.primary,
              color: '#000000',
              borderRadius: '16px',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore(dept.title);
            }}
            data-card-button
          >
            <span>Join Us</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------
   MOBILE SCROLL SECTION
--------------------------------------------- */
interface MobileScrollProps {
  departments: typeof departments;
  colorScheme: any;
  onLearnMore: (title: string) => void;
  scrollLeft: () => void;
  scrollRight: () => void;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

function MobileScrollSection({
  departments,
  colorScheme,
  onLearnMore,
  scrollLeft,
  scrollRight,
  scrollContainerRef,
}: MobileScrollProps) {
  return (
    <div className="sm:hidden px-4 py-4">
      <FlexboxLayout direction="column" gap="md">
        {/* Header */}
        <FlexboxLayout justify="center" align="center" className="mb-4">
          <BodySM className="font-bold text-2xl text-white text-center">
            Departments
          </BodySM>
        </FlexboxLayout>

        {/* Scroll Container with Cards */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/30 hover:bg-black transition-all shadow-lg"
            aria-label="Scroll left"
            style={{ background: colorScheme.primary }}
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>

          {/* Cards */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 px-2 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollPadding: '0 40px' }}
          >
            <div className="flex-shrink-0 w-4" /> {/* Left spacer */}
            {departments.map((dept, index) => (
              <div key={dept.title} className="snap-center">
                <DepartmentCard
                  dept={dept}
                  colorScheme={colorScheme}
                  onLearnMore={onLearnMore}
                  isMobile={true}
                  index={index}
                />
              </div>
            ))}
            <div className="flex-shrink-0 w-4" /> {/* Right spacer */}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/30 hover:bg-black transition-all shadow-lg"
            aria-label="Scroll right"
            style={{ background: colorScheme.primary }}
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {departments.map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index === 0 ? colorScheme.primary : 'rgba(255, 255, 255, 0.3)',
                transform: index === 0 ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </FlexboxLayout>
    </div>
  );
}

/* --------------------------------------------
   DESKTOP/TABLET GRID SECTION - 3x2 Layout
--------------------------------------------- */
interface DesktopGridProps {
  departments: typeof departments;
  colorScheme: any;
  onLearnMore: (title: string) => void;
  addToRefs: (el: HTMLDivElement | null, index: number) => void;
}

function DesktopGridSection({
  departments,
  colorScheme,
  onLearnMore,
  addToRefs,
}: DesktopGridProps) {
  return (
    <div className="hidden sm:block">
      <div className="max-w-6xl mx-auto px-4">
        {/* 3x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => (
            <DepartmentCard
              key={dept.title}
              dept={dept}
              colorScheme={colorScheme}
              onLearnMore={onLearnMore}
              addToRefs={addToRefs}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------
   MAIN COMPONENT
--------------------------------------------- */
export default function JoinWisdomHouse() {
  const { colorScheme } = useTheme();

  const {
    selectedDepartment,
    showForm,
    sectionRef,
    scrollContainerRef,
    handleLearnMore,
    scrollLeft,
    scrollRight,
    setShowForm,
    handleFormSubmit,
  } = useJoinWisdomHouse();

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    // Ref callback for department cards
  };

  return (
    <>
      <Section
        ref={sectionRef}
        background="image"
        backgroundImage={Workforce_bg.src}
        overlay={true}
        overlayOpacity={70}
        fullHeight={false}
        className="overflow-hidden"
        padding="none"
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-0" />

        <Container size="xl" className="relative z-10 py-12 lg:py-20">
          {/* Hero Header */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-12 lg:mb-20 px-4"
          >
            <H2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white">
              Join Our{' '}
              <BaseText
                fontFamily="playfair"
                className="italic inline-block"
                style={{
                  color: colorScheme.primary,
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                }}
              >
                Workforce
              </BaseText>
            </H2>

            <BodySM className="max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-gray-200">
              &quot;Each of you should use whatever gift you have received to
              serve others, as faithful stewards of God&apos;s grace in its
              various forms.&quot; – 1 Peter 4:10
            </BodySM>
          </FlexboxLayout>

          {/* Departments Section */}
          <DesktopGridSection
            departments={departments}
            colorScheme={colorScheme}
            onLearnMore={handleLearnMore}
            addToRefs={addToRefs}
          />

          <MobileScrollSection
            departments={departments}
            colorScheme={colorScheme}
            onLearnMore={handleLearnMore}
            scrollLeft={scrollLeft}
            scrollRight={scrollRight}
            scrollContainerRef={scrollContainerRef}
          />
        </Container>
      </Section>

      {/* Modal for joining department */}
      {selectedDepartment && (
        <JoinUsModal
          department={selectedDepartment as any}
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </>
  );
}