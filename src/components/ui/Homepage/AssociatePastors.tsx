/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const { sectionRef, contentRef, headingRef, handleSeeMore, addToRefs } =
    useAssociatePastors();

  return (
    <Section
      ref={sectionRef}
      background="light"
      // REMOVE THIS: padding="xl" - This is causing the gap!
      className="bg-gradient-to-b from-gray-500 to-white"
    >
      <Container size="xl" className="py-16 lg:py-20">
        {/* Main Section Header */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="md"
          className="text-center mb-12 lg:mb-16"
        >
          <H1
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            style={{
              color: colorScheme.background,
            }}
          >
            {associatePastorsContent.mainHeader}
          </H1>
          <LightText
            className="text-base sm:text-lg md:text-xl lg:text-xl max-w-3xl mx-auto leading-relaxed mt-4"
            style={{ color: colorScheme.buttonText }}
          >
            {associatePastorsContent.mainDescription}
          </LightText>
        </FlexboxLayout>

        <div ref={contentRef} className="flex flex-col items-center">
          {/* First Leaders Section */}
          <FlexboxLayout
            direction="column"
            gap="lg"
            className="w-full mb-16 lg:mb-20"
          >
            <H2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-center mb-12"
              style={{
                color: colorScheme.background,
              }}
            >
              {associatePastorsContent.pastoralSection.title}
            </H2>
            <GridboxLayout
              columns={3}
              gap="lg"
              responsive={{
                sm: 1,
                md: 3,
                lg: 3,
              }}
            >
              {pastorsData.slice(0, 3).map((pastor, index) => (
                <div
                  key={`pastoral-${pastor.name}`}
                  ref={addToRefs}
                  className="flex flex-col items-center group"
                >
                  <div className="relative inline-block mb-6">
                    <div
                      className="w-52 h-52 rounded-full overflow-hidden border-4 shadow-2xl mx-auto group-hover:shadow-2xl transition-all duration-500"
                      style={{
                        borderColor: colorScheme.white,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      <Image
                        src={pastor.image}
                        alt={pastor.name}
                        width={208}
                        height={208}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Responsive badge */}
                    <div
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs md:text-sm lg:text-base font-medium shadow-lg whitespace-normal text-center max-w-[130px] md:max-w-[150px] break-words leading-tight"
                      style={{
                        background: `linear-gradient(to right, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                        color: colorScheme.black,
                      }}
                    >
                      {pastor.role}
                    </div>
                  </div>

                  <H3
                    className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold mb-3 transition-colors duration-300"
                    style={{ color: colorScheme.black }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.color = colorScheme.primary;
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.color = colorScheme.black;
                    }}
                  >
                    {pastor.name}
                  </H3>
                  {pastor.description && (
                    <SmallText
                      className="text-sm md:text-base lg:text-base leading-relaxed px-2 text-center"
                      style={{ color: colorScheme.body }}
                    >
                      {pastor.description}
                    </SmallText>
                  )}
                </div>
              ))}
            </GridboxLayout>
          </FlexboxLayout>

          {/* Second Leaders Section */}
          <FlexboxLayout
            direction="column"
            gap="lg"
            className="w-full mb-16 lg:mb-20"
          >
            <H2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-center mb-12"
              style={{
                color: colorScheme.black,
              }}
            >
              {associatePastorsContent.ministrySection.title}
            </H2>
            <GridboxLayout
              columns={3}
              gap="lg"
              responsive={{
                sm: 1,
                md: 3,
                lg: 3,
              }}
            >
              {ministryLeadersData.slice(3, 6).map((pastor, index) => (
                <div
                  key={`ministry-${pastor.name}`}
                  ref={addToRefs}
                  className="flex flex-col items-center group"
                >
                  <div className="relative inline-block mb-6">
                    <div
                      className="w-52 h-52 rounded-full overflow-hidden border-4 shadow-2xl mx-auto group-hover:shadow-2xl transition-all duration-500"
                      style={{
                        borderColor: colorScheme.white,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      <Image
                        src={pastor.image}
                        alt={pastor.name}
                        width={208}
                        height={208}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Responsive badge */}
                    <div
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs md:text-sm lg:text-base font-medium shadow-lg whitespace-normal text-center max-w-[130px] md:max-w-[150px] break-words leading-tight"
                      style={{
                        background: `linear-gradient(to right, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                        color: colorScheme.black,
                      }}
                    >
                      {pastor.role}
                    </div>
                  </div>

                  <H3
                    className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold mb-3 transition-colors duration-300"
                    style={{ color: colorScheme.black }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.color = colorScheme.primary;
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.color = colorScheme.black;
                    }}
                  >
                    {pastor.name}
                  </H3>
                  {pastor.description && (
                    <SmallText
                      className="text-sm md:text-base lg:text-base leading-relaxed px-2 text-center"
                      style={{ color: colorScheme.buttonText }}
                    >
                      {pastor.description}
                    </SmallText>
                  )}
                </div>
              ))}
            </GridboxLayout>
          </FlexboxLayout>

          {/* See More Button */}
          <FlexboxLayout justify="center" className="mt-8">
            <CustomButton
              onClick={handleSeeMore}
              variant="primary"
              size="lg"
              curvature="full"
              elevated={true}
              rightIcon={
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ml-2" />
              }
              className="group transition-all duration-300 transform hover:scale-105"
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
