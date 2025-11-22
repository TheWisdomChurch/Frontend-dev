/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import {
  pastorsData,
  ministryLeadersData,
  associatePastorsContent,
} from '@/lib/data';
import { H1, H2, H3, LightText, SmallText } from '@/components/text';
import CustomButton from '@/components/utils/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { useAssociatePastors } from '@/components/utils/hooks/useAssociate';
import { ArrowRight } from 'lucide-react';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';

export default function AssociatePastors() {
  const { colorScheme } = useTheme();
  const {
    sectionRef,
    contentRef,
    headingRef,
    descriptionRef,
    handleSeeMore,
    addToRefs,
    addSectionHeaderRef,
  } = useAssociatePastors();

  const isDarkMode = colorScheme.pageBackground === '#000000';

  // Main headings & names: yellow in dark, deep gold in light
  const mainAccentColor = isDarkMode
    ? colorScheme.primary
    : colorScheme.accentText;

  // Sub-text (descriptions): always black on white background → perfect visibility
  const subTextColor = '#000000';

  return (
    <Section
      ref={sectionRef}
      background="light"
      style={{ backgroundColor: '#FFFFFF' }} // Always white bg
      className="relative"
    >
      <Container size="xl" className="py-12 sm:py-16 lg:py-20">
        {/* Main Section Header */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="md"
          className="text-center mb-10 sm:mb-12 lg:mb-16 px-4"
        >
          <H1
            ref={headingRef}
            className="leading-tight"
            style={{ color: mainAccentColor }}
            useThemeColor={false}
          >
            {associatePastorsContent.mainHeader}
          </H1>
          <LightText
            ref={descriptionRef}
            className="max-w-3xl mx-auto leading-relaxed mt-3 sm:mt-4 px-2"
            style={{ color: subTextColor }}
            useThemeColor={false}
          >
            {associatePastorsContent.mainDescription}
          </LightText>
        </FlexboxLayout>

        <div ref={contentRef} className="flex flex-col items-center">
          {/* Pastoral Team */}
          <FlexboxLayout
            direction="column"
            gap="lg"
            className="w-full mb-12 sm:mb-16 lg:mb-20 px-4 sm:px-0"
          >
            <H2
              ref={addSectionHeaderRef}
              className="text-center mb-8 sm:mb-10 lg:mb-12"
              style={{ color: mainAccentColor }}
              useThemeColor={false}
            >
              {associatePastorsContent.pastoralSection.title}
            </H2>
            <GridboxLayout
              columns={3}
              gap="lg"
              responsive={{ sm: 1, md: 2, lg: 3 }}
              className="w-full"
            >
              {pastorsData.slice(0, 3).map(pastor => (
                <div
                  key={`pastoral-${pastor.name}`}
                  ref={addToRefs}
                  className="flex flex-col items-center group"
                >
                  <div className="relative inline-block mb-4 sm:mb-6">
                    <div
                      className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full overflow-hidden border-4 shadow-2xl mx-auto transition-all duration-300"
                      style={{
                        borderColor: colorScheme.primary,
                        boxShadow: `0 25px 50px -12px ${colorScheme.black}40`,
                      }}
                    >
                      <Image
                        src={pastor.image}
                        alt={pastor.name}
                        width={208}
                        height={208}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div
                      className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm md:text-base font-medium shadow-lg whitespace-normal text-center max-w-[110px] sm:max-w-[130px] md:max-w-[150px] break-words leading-tight"
                      style={{
                        background: `linear-gradient(to right, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                        color: colorScheme.black,
                      }}
                    >
                      {pastor.role}
                    </div>
                  </div>

                  <H3
                    className="text-center mb-2 sm:mb-3 px-2"
                    style={{ color: mainAccentColor }}
                    useThemeColor={false}
                  >
                    {pastor.name}
                  </H3>
                  {pastor.description && (
                    <SmallText
                      className="leading-relaxed px-2 sm:px-3 text-center opacity-90"
                      style={{ color: subTextColor }}
                      useThemeColor={false}
                    >
                      {pastor.description}
                    </SmallText>
                  )}
                </div>
              ))}
            </GridboxLayout>
          </FlexboxLayout>

          {/* Ministry Leaders */}
          <FlexboxLayout
            direction="column"
            gap="lg"
            className="w-full mb-12 sm:mb-16 lg:mb-20 px-4 sm:px-0"
          >
            <H2
              ref={addSectionHeaderRef}
              className="text-center mb-8 sm:mb-10 lg:mb-12"
              style={{ color: mainAccentColor }}
              useThemeColor={false}
            >
              {associatePastorsContent.ministrySection.title}
            </H2>
            <GridboxLayout
              columns={3}
              gap="lg"
              responsive={{ sm: 1, md: 2, lg: 3 }}
              className="w-full"
            >
              {ministryLeadersData.slice(3, 6).map(pastor => (
                <div
                  key={`ministry-${pastor.name}`}
                  ref={addToRefs}
                  className="flex flex-col items-center group"
                >
                  <div className="relative inline-block mb-4 sm:mb-6">
                    <div
                      className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full overflow-hidden border-4 shadow-2xl mx-auto transition-all duration-300"
                      style={{
                        borderColor: colorScheme.primary,
                        boxShadow: `0 25px 50px -12px ${colorScheme.black}40`,
                      }}
                    >
                      <Image
                        src={pastor.image}
                        alt={pastor.name}
                        width={208}
                        height={208}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div
                      className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm md:text-base font-medium shadow-lg whitespace-normal text-center max-w-[110px] sm:max-w-[130px] md:max-w-[150px] break-words leading-tight"
                      style={{
                        background: `linear-gradient(to right, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                        color: colorScheme.black,
                      }}
                    >
                      {pastor.role}
                    </div>
                  </div>

                  <H3
                    className="text-center mb-2 sm:mb-3 px-2"
                    style={{ color: mainAccentColor }}
                    useThemeColor={false}
                  >
                    {pastor.name}
                  </H3>
                  {pastor.description && (
                    <SmallText
                      className="leading-relaxed px-2 sm:px-3 text-center opacity-90"
                      style={{ color: subTextColor }}
                      useThemeColor={false}
                    >
                      {pastor.description}
                    </SmallText>
                  )}
                </div>
              ))}
            </GridboxLayout>
          </FlexboxLayout>

          {/* See More Button */}
          <FlexboxLayout justify="center" className="mt-6 sm:mt-8 px-4">
            <CustomButton
              onClick={handleSeeMore}
              variant="primary"
              size="lg"
              curvature="full"
              elevated={true}
              rightIcon={
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ml-2" />
              }
              className="group transition-all duration-300 transform hover:scale-105 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4"
              style={{
                background: `linear-gradient(to right, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                color: colorScheme.black,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${colorScheme.primaryLight}, ${colorScheme.primary})`;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${colorScheme.primary}, ${colorScheme.primaryDark})`;
              }}
            >
              {associatePastorsContent.seeMoreButton}
            </CustomButton>
          </FlexboxLayout>
        </div>
      </Container>
    </Section>
  );
}
