 
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  pastorsData,
  ministryLeadersData,
  associatePastorsContent,
} from '@/lib/data';
import { H3, H4, SmallText, Caption } from '@/components/text';
import CustomButton from '@/components/utils/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { useAssociatePastors } from '@/components/utils/hooks/useAssociate';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';

/* --------------------------------------------
   REUSABLE CARD COMPONENT — Optimized & Responsive
--------------------------------------------- */
function PersonCard({ item, colorScheme, mainAccentColor, addToRefs }: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && addToRefs) {
      addToRefs(cardRef.current);
    }
  }, [addToRefs]);

  return (
    <div ref={cardRef} className="group w-full">
      <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 border border-gray-200 relative overflow-hidden flex flex-col h-full">
        {/* Subtle Background on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary}02, ${colorScheme.primaryDark}01)`,
          }}
        />

        {/* Centered Circular Image with Optimization */}
        <div className="flex justify-center mb-4 flex-shrink-0">
          <div className="relative">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-2 ring-gray-100 transform group-hover:scale-105 transition-transform duration-300">
              <Image
                src={item.image}
                alt={`${item.name} - ${item.role}`}
                width={112}
                height={112}
                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                className="object-cover transition-all duration-300 group-hover:scale-110"
                loading="lazy"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEyIiBoZWlnaHQ9IjExMiIgdmlld0JveD0iMCAwIDExMiAxMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjExMiIgaGVpZ2h0PSIxMTIiIGZpbGw9IiNGRjVGODUiIHJ4PSI1NiIvPjwvc3ZnPg=="
              />
            </div>

            {/* Role Badge */}
            <div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap z-10 transition-all duration-300 group-hover:-translate-y-1 min-w-[80px] text-center"
              style={{
                backgroundColor: colorScheme.primary,
                color: '#000000',
              }}
            >
              {item.role}
            </div>
          </div>
        </div>

        {/* Name & Description */}
        <div className="text-center pt-6 relative z-10 flex flex-col flex-grow justify-start">
          <SmallText
            weight="semibold"
            smWeight="bold"
            style={{ color: mainAccentColor }}
            useThemeColor={false}
            className="text-sm sm:text-base mb-2 transition-colors duration-300 line-clamp-1"
          >
            {item.name}
          </SmallText>
          {item.description && (
            <Caption
              className="text-gray-600 px-1 transition-all duration-300 line-clamp-3 leading-tight min-h-[3.5rem] flex items-center justify-center text-xs sm:text-sm"
              useThemeColor={false}
            >
              {item.description}
            </Caption>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------
   MAIN COMPONENT - Optimized & Responsive
--------------------------------------------- */
export default function AssociatePastors() {
  const { colorScheme } = useTheme();
  const {
    sectionRef,
    contentRef,
    headingRef,
    descriptionRef,
    handleSeeMore,
    addSectionHeaderRef,
    addToRefs,
  } = useAssociatePastors();

  const isDarkMode = colorScheme.pageBackground === '#000000';
  const mainAccentColor = isDarkMode ? colorScheme.primary : '#000000';

  // Get only first 4 items for preview
  const previewPastors = pastorsData.slice(0, 4);
  const previewMinistryLeaders = ministryLeadersData.slice(0, 4);

  return (
    <Section
      ref={sectionRef}
      padding="lg"
      fullHeight={false}
      style={{ backgroundColor: '#FFFFFF' }}
      className="relative overflow-hidden bg-white"
    >
      <Container size="xl" className="relative z-10">
        {/* Header Section */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="md"
          className="text-center pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 lg:pb-12"
        >
          <div className="relative">
            <H3
              ref={headingRef}
              className="leading-tight relative text-2xl sm:text-3xl lg:text-4xl"
              style={{ color: mainAccentColor }}
              useThemeColor={false}
              weight="black"
              smWeight="black"
            >
              {associatePastorsContent.mainHeader}
            </H3>
          </div>
          <Caption
            ref={descriptionRef}
            className="max-w-2xl sm:max-w-3xl mx-auto leading-relaxed text-gray-600 mt-2 sm:mt-4 px-4 text-base sm:text-lg font-light"
            useThemeColor={false}
          >
            {associatePastorsContent.mainDescription}
          </Caption>
        </FlexboxLayout>

        <div ref={contentRef}>
          {/* Pastoral Team Section - Only first 4 */}
          <div className="w-full mb-12 lg:mb-16">
            <div className="relative flex justify-center mb-8 sm:mb-10">
              <H4
                ref={addSectionHeaderRef}
                className="text-center relative inline-block text-lg sm:text-xl lg:text-2xl"
                style={{ color: mainAccentColor }}
                useThemeColor={false}
                weight="bold"
                smWeight="extrabold"
              >
                {associatePastorsContent.pastoralSection.title}
                <div
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 transition-all duration-500"
                  style={{ backgroundColor: colorScheme.primary }}
                />
              </H4>
            </div>
            <GridboxLayout
              columns={4}
              gap="lg"
              responsive={{
                sm: 1, // Mobile: 1 column
                md: 2, // Tablet: 2 columns
                lg: 4, // Desktop: 4 columns
              }}
              className="w-full items-stretch"
            >
              {previewPastors.map(item => (
                <PersonCard
                  key={`pastor-${item.name}`}
                  item={item}
                  colorScheme={colorScheme}
                  mainAccentColor={mainAccentColor}
                  addToRefs={addToRefs}
                />
              ))}
            </GridboxLayout>
          </div>

          {/* Ministry Leaders Section - Only first 4 */}
          <div className="w-full mb-10 lg:mb-14">
            <div className="relative flex justify-center mb-8 sm:mb-10">
              <H4
                ref={addSectionHeaderRef}
                className="text-center relative inline-block text-lg sm:text-xl lg:text-2xl"
                style={{ color: mainAccentColor }}
                useThemeColor={false}
                weight="bold"
                smWeight="extrabold"
              >
                {associatePastorsContent.ministrySection.title}
                <div
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 transition-all duration-500"
                  style={{ backgroundColor: colorScheme.primary }}
                />
              </H4>
            </div>

            {/* Show only first 4 ministry leaders */}
            <GridboxLayout
              columns={4}
              gap="lg"
              responsive={{
                sm: 1, // Mobile: 1 column
                md: 2, // Tablet: 2 columns
                lg: 4, // Desktop: 4 columns
              }}
              className="w-full items-stretch"
            >
              {previewMinistryLeaders.map(item => (
                <PersonCard
                  key={`leader-${item.name}`}
                  item={item}
                  colorScheme={colorScheme}
                  mainAccentColor={mainAccentColor}
                  addToRefs={addToRefs}
                />
              ))}
            </GridboxLayout>
          </div>

          {/* Clean See More Button */}
          <FlexboxLayout
            justify="center"
            className="pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-10 lg:pb-12"
          >
            <div className="relative group">
              <CustomButton
                onClick={handleSeeMore}
                variant="primary"
                size="lg"
                curvature="xl"
                elevated={false}
                leftIcon={
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 transition-transform duration-300 group-hover:scale-110" />
                }
                rightIcon={
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3 transition-transform duration-300 group-hover:rotate-180" />
                }
                className="group relative px-5 sm:px-7 md:px-10 lg:px-12 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-bold transition-all duration-300 border border-gray-200 w-full sm:w-auto"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: '#000000',
                }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {associatePastorsContent.seeMoreButton}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </CustomButton>
            </div>
          </FlexboxLayout>
        </div>
      </Container>
    </Section>
  );
}
