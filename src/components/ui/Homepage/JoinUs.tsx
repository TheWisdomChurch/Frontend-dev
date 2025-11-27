'use client';

import { WisdomeHouseLogo, Workforce_bg } from '@/components/assets';
import { H2, BaseText, BodySM, Caption } from '@/components/text';
import Button from '@/components/utils/CustomButton';
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

// Remove departmentIcons mapping since we're using the same logo for all
const departmentColors = {
  Ushers: 'from-purple-500 to-pink-500',
  'Media Team': 'from-blue-500 to-cyan-500',
  Choir: 'from-amber-500 to-orange-500',
  'Children Ministry': 'from-green-500 to-emerald-500',
  'Youth Ministry': 'from-indigo-500 to-purple-500',
  'Technical Team': 'from-slate-600 to-zinc-800',
};

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

  const departments = [
    {
      title: 'Ushers',
      description: 'Welcome and guide attendees with warmth and excellence',
    },
    {
      title: 'Media Team',
      description:
        'Capture and broadcast the move of God through visuals and sound',
    },
    {
      title: 'Choir',
      description: 'Lead powerful worship and create heavenly atmospheres',
    },
    {
      title: 'Children Ministry',
      description: 'Nurture young hearts and teach them the ways of God',
    },
    {
      title: 'Youth Ministry',
      description: 'Empower the next generation to walk in purpose and power',
    },
    {
      title: 'Technical Team',
      description:
        'Ensure seamless operations behind the scenes with excellence',
    },
  ];

  return (
    <>
      <Section
        ref={sectionRef}
        background="image"
        backgroundImage={Workforce_bg.src}
        overlay={true}
        overlayOpacity={70}
        fullHeight={false}
        className="overflow-hidden min-h-screen"
        padding="none"
      >
        {/* Beautiful dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-0" />

        <Container size="xl" className="relative z-10 py-16 lg:py-28">
          {/* Hero Header - Mobile Responsive */}
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-12 lg:mb-20 px-4"
          >
            <H2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight"
              style={{ color: '#FFFFFF' }}
            >
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

            <BodySM
              className="max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed text-gray-200 px-2"
              style={{ color: '#E5E7EB' }}
            >
              "Each of you should use whatever gift you have received to serve
              others, as faithful stewards of God's grace in its various forms."
              – 1 Peter 4:10
            </BodySM>
          </FlexboxLayout>

          {/* Desktop & Tablet Grid */}
          <div className="hidden sm:block">
            <GridboxLayout
              columns={3}
              gap="lg"
              responsive={{ sm: 1, md: 2, lg: 3 }}
              className="max-w-6xl mx-auto items-stretch"
            >
              {departments.map((dept, index) => {
                const gradient =
                  departmentColors[
                    dept.title as keyof typeof departmentColors
                  ] || 'from-gray-600 to-gray-800';

                return (
                  <div
                    key={dept.title}
                    ref={el => addToRefs(el, index)}
                    onMouseEnter={e => handleCardEnter(index, e)}
                    onMouseLeave={e => handleCardLeave(index, e)}
                    className="group w-full perspective-1000"
                  >
                    {/* Compact Futuristic Glass Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20 relative overflow-hidden flex flex-col h-full">
                      {/* Animated Background Gradient */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.primaryDark}05)`,
                        }}
                      />

                      {/* Floating Particles */}
                      <div className="absolute top-3 right-3 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                      <div className="absolute bottom-3 left-3 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping" />

                      {/* Centered WisdomHouse Logo - ROUND SHAPE */}
                      <div className="flex justify-center mb-3 flex-shrink-0">
                        <div className="relative">
                          {/* Outer Glow Ring */}
                          <div
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
                            style={{
                              background: `radial-gradient(circle, ${colorScheme.primary}30 0%, transparent 70%)`,
                              transform: 'scale(1.1)',
                            }}
                          />

                          {/* Logo Container - CHANGED TO ROUND */}
                          <div
                            className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br ${gradient} p-3 shadow-xl transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
                          >
                            <Image
                              src={WisdomeHouseLogo}
                              alt="WisdomHouse Logo"
                              width={32}
                              height={32}
                              className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Title & Description - Compact Section */}
                      <div className="text-center pt-4 relative z-10 flex flex-col flex-grow justify-start">
                        <BaseText
                          fontFamily="bricolage"
                          weight="bold"
                          className="text-lg sm:text-xl mb-2 transform group-hover:scale-105 transition-transform duration-200"
                          style={{ color: '#FFFFFF' }}
                        >
                          {dept.title}
                        </BaseText>

                        <Caption
                          className="text-gray-300 opacity-90 px-1 transition-all duration-300 group-hover:opacity-100 line-clamp-2 leading-tight min-h-[2.5rem] flex items-center justify-center text-xs sm:text-sm"
                          useThemeColor={false}
                        >
                          {dept.description}
                        </Caption>
                      </div>

                      {/* Button Section */}
                      <div className="mt-4 flex-shrink-0">
                        <Button
                          variant="primary"
                          size="md"
                          curvature="xl"
                          className="w-full py-3 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-white/20 backdrop-blur-sm"
                          style={{
                            background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                            color: '#000000',
                          }}
                          onClick={() => handleLearnMore(dept.title)}
                        >
                          Join {dept.title}
                        </Button>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                );
              })}
            </GridboxLayout>
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="sm:hidden px-4">
            <FlexboxLayout direction="column" gap="md">
              <FlexboxLayout justify="between" align="center" className="mb-6">
                <button
                  onClick={scrollLeft}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <BodySM
                  className="font-bold text-base"
                  style={{ color: '#FFFFFF' }}
                >
                  Choose Department
                </BodySM>

                <button
                  onClick={scrollRight}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </FlexboxLayout>

              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
              >
                {departments.map(dept => {
                  const gradient =
                    departmentColors[
                      dept.title as keyof typeof departmentColors
                    ] || 'from-gray-600 to-gray-800';

                  return (
                    <div
                      key={dept.title}
                      className="flex-shrink-0 w-64 snap-center"
                    >
                      {/* Mobile Card - More Compact */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/20 relative overflow-hidden flex flex-col h-full">
                        {/* Centered WisdomHouse Logo - ROUND SHAPE & FIXED SOURCE */}
                        <div className="flex justify-center mb-3">
                          <div
                            className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${gradient} p-2 shadow-xl flex items-center justify-center`}
                          >
                            <Image
                              src={WisdomeHouseLogo} // FIXED: Using the imported variable
                              alt="WisdomHouse Logo"
                              width={28}
                              height={28}
                              className="w-full h-full object-contain rounded-full"
                            />
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div className="text-center pt-4 flex flex-col flex-grow justify-start">
                          <BaseText
                            fontFamily="bricolage"
                            weight="bold"
                            className="text-lg mb-2"
                            style={{ color: '#FFFFFF' }}
                          >
                            {dept.title}
                          </BaseText>

                          <Caption
                            className="text-gray-300 opacity-90 px-1 line-clamp-2 leading-tight min-h-[2.5rem] flex items-center justify-center text-xs"
                            useThemeColor={false}
                          >
                            {dept.description}
                          </Caption>
                        </div>

                        {/* Button */}
                        <div className="mt-4">
                          <Button
                            variant="primary"
                            size="md"
                            curvature="xl"
                            className="w-full py-3 font-semibold text-sm"
                            style={{
                              background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                              color: '#000000',
                            }}
                            onClick={() => handleLearnMore(dept.title)}
                          >
                            Join Team
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex-shrink-0 w-4" />
              </div>
            </FlexboxLayout>
          </div>
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
