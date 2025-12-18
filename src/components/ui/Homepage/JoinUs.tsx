'use client';

import { WisdomeHouseLogo, Workforce_bg } from '@/components/assets';
import { H2, BaseText, BodySM, Caption } from '@/components/text';
import Button from '@/components/utils/buttons/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { FormModal } from '@/components/modal/FormModal';
import { useJoinWisdomHouse } from '@/components/utils/hooks/useJoin';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import Image from 'next/image';
import { RefObject } from 'react';

// Department data
const departments = [
  {
    title: 'Ushers',
    description: 'Welcome and guide attendees with warmth and excellence',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Media Team',
    description: 'Capture and broadcast the move of God through visuals and sound',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Choir',
    description: 'Lead powerful worship and create heavenly atmospheres',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Children Ministry',
    description: 'Nurture young hearts and teach them the ways of God',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Youth Ministry',
    description: 'Empower the next generation to walk in purpose and power',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    title: 'Technical Team',
    description: 'Ensure seamless operations behind the scenes with excellence',
    gradient: 'from-slate-600 to-zinc-800',
  },
];

/* --------------------------------------------
   DEPARTMENT CARD COMPONENT
--------------------------------------------- */
interface DepartmentCardProps {
  dept: typeof departments[0];
  colorScheme: any;
  onLearnMore: (title: string) => void;
  isMobile?: boolean;
  addToRefs?: (el: HTMLDivElement | null, index: number) => void;
  index?: number;
  handleCardEnter?: (index: number, e: React.MouseEvent) => void;
  handleCardLeave?: (index: number, e: React.MouseEvent) => void;
}

function DepartmentCard({
  dept,
  colorScheme,
  onLearnMore,
  isMobile = false,
  addToRefs,
  index,
  handleCardEnter,
  handleCardLeave,
}: DepartmentCardProps) {
  const cardClasses = `bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 relative overflow-hidden flex flex-col h-full ${
    !isMobile ? 'p-5 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl' : 'p-4'
  }`;

  // Handle ref assignment properly
  const handleRef = (el: HTMLDivElement | null) => {
    if (addToRefs && index !== undefined) {
      addToRefs(el, index);
    }
  };

  return (
    <div
      ref={handleRef}
      onMouseEnter={e => handleCardEnter && index !== undefined && handleCardEnter(index, e)}
      onMouseLeave={e => handleCardLeave && index !== undefined && handleCardLeave(index, e)}
      className={isMobile ? 'flex-shrink-0 w-64' : 'group w-full'}
    >
      <div className={cardClasses}>
        {/* Animated Background Gradient */}
        {!isMobile && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.primaryDark}05)`,
            }}
          />
        )}

        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* Outer Glow Ring - Desktop only */}
            {!isMobile && (
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${colorScheme.primary}30 0%, transparent 70%)`,
                  transform: 'scale(1.1)',
                }}
              />
            )}

            {/* Logo Container */}
            <div
              className={`relative rounded-full bg-gradient-to-br ${dept.gradient} shadow-xl flex items-center justify-center ${
                isMobile 
                  ? 'w-14 h-14 p-2' 
                  : 'w-16 h-16 p-3 group-hover:scale-105 transition-transform duration-300'
              }`}
            >
              <Image
                src={WisdomeHouseLogo}
                alt="WisdomHouse Logo"
                width={isMobile ? 28 : 32}
                height={isMobile ? 28 : 32}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="text-center flex flex-col flex-grow justify-start">
          <BaseText
            fontFamily="bricolage"
            weight="bold"
            className={`${isMobile ? 'text-lg' : 'text-xl group-hover:scale-105 transition-transform duration-200'} mb-2`}
            style={{ color: '#FFFFFF' }}
          >
            {dept.title}
          </BaseText>

          <Caption
            className="text-gray-300 opacity-90 px-1 line-clamp-2 leading-tight flex items-center justify-center"
            useThemeColor={false}
            style={{
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              minHeight: isMobile ? '2.5rem' : '3rem',
            }}
          >
            {dept.description}
          </Caption>
        </div>

        {/* Button Section */}
        <div className={`${isMobile ? 'mt-4' : 'mt-5'}`}>
          <Button
            variant="primary"
            size={isMobile ? "sm" : "md"}
            curvature="xl"
            className="w-full font-semibold shadow-lg border border-white/20 backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
              color: '#000000',
            }}
            onClick={() => onLearnMore(dept.title)}
          >
            {isMobile ? 'Join Team' : `Join ${dept.title}`}
          </Button>
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
    <div className="sm:hidden px-4">
      <FlexboxLayout direction="column" gap="md">
        <FlexboxLayout justify="between" align="center" className="mb-4">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <BodySM className="font-bold text-base text-white">
            Choose Department
          </BodySM>

          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </FlexboxLayout>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
        >
          {departments.map((dept, index) => (
            <DepartmentCard
              key={dept.title}
              dept={dept}
              colorScheme={colorScheme}
              onLearnMore={onLearnMore}
              isMobile={true}
              index={index}
            />
          ))}
          <div className="flex-shrink-0 w-4" />
        </div>
      </FlexboxLayout>
    </div>
  );
}

/* --------------------------------------------
   DESKTOP/TABLET GRID SECTION
--------------------------------------------- */
interface DesktopGridProps {
  departments: typeof departments;
  colorScheme: any;
  onLearnMore: (title: string) => void;
  addToRefs: (el: HTMLDivElement | null, index: number) => void;
  handleCardEnter: (index: number, e: React.MouseEvent) => void;
  handleCardLeave: (index: number, e: React.MouseEvent) => void;
}

function DesktopGridSection({
  departments,
  colorScheme,
  onLearnMore,
  addToRefs,
  handleCardEnter,
  handleCardLeave,
}: DesktopGridProps) {
  return (
    <div className="hidden sm:block">
      <GridboxLayout
        columns={3}
        gap="lg"
        responsive={{ sm: 1, md: 2, lg: 3 }}
        className="max-w-6xl mx-auto"
      >
        {departments.map((dept, index) => (
          <DepartmentCard
            key={dept.title}
            dept={dept}
            colorScheme={colorScheme}
            onLearnMore={onLearnMore}
            addToRefs={addToRefs}
            index={index}
            handleCardEnter={handleCardEnter}
            handleCardLeave={handleCardLeave}
          />
        ))}
      </GridboxLayout>
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
    addToRefs,
    handleLearnMore,
    scrollLeft,
    scrollRight,
    handleCardEnter,
    handleCardLeave,
    setShowForm,
  } = useJoinWisdomHouse();

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
            className="text-center mb-10 lg:mb-16 px-4"
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
            handleCardEnter={handleCardEnter}
            handleCardLeave={handleCardLeave}
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

      <FormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        department={selectedDepartment || ''}
      />
    </>
  );
}