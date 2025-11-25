/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  pastorsData,
  ministryLeadersData,
  associatePastorsContent,
} from '@/lib/data';
import { H3, H4, BodyMD, SmallText, Caption } from '@/components/text';
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
   REUSABLE CARD COMPONENT — Futuristic & Professional
--------------------------------------------- */
function PersonCard({ item, colorScheme, mainAccentColor, addToRefs }: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      addToRefs(cardRef.current);
    }
  }, [addToRefs]);

  return (
    <div ref={cardRef} className="group w-full perspective-1000">
      {/* Futuristic Glass Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-3 border border-white/20 relative overflow-hidden flex flex-col h-full">
        {/* Animated Background Gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.primaryDark}05)`,
          }}
        />

        {/* Floating Particles */}
        <div className="absolute top-4 right-4 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
        <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping" />

        {/* Centered Circular Image with Glow */}
        <div className="flex justify-center mb-4 flex-shrink-0">
          <div className="relative">
            {/* Outer Glow Ring */}
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
              style={{
                background: `radial-gradient(circle, ${colorScheme.primary}30 0%, transparent 70%)`,
                transform: 'scale(1.1)',
              }}
            />

            {/* Image Container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white/80 shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
              <Image
                src={item.image}
                alt={item.name}
                width={128}
                height={128}
                className="object-cover transition-all duration-700 group-hover:scale-110"
                priority
              />
            </div>

            {/* Animated Role Badge */}
            <div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-5 py-2 rounded-full text-xs font-bold shadow-2xl whitespace-nowrap z-10 border border-white/20 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
                color: '#000000',
              }}
            >
              {item.role}
            </div>
          </div>
        </div>

        {/* Name & Description - Uniform Height Section */}
        <div className="text-center pt-6 relative z-10 flex flex-col flex-grow justify-start">
          <SmallText
            weight="semibold"
            smWeight="bold"
            style={{ color: mainAccentColor }}
            useThemeColor={false}
            className="text-sm sm:text-base mb-2 transform group-hover:scale-105 transition-transform duration-300"
          >
            {item.name}
          </SmallText>
          {item.description && (
            <Caption
              className="text-gray-600 opacity-90 px-1 transition-all duration-500 group-hover:opacity-100 line-clamp-3 leading-tight min-h-[3rem] flex items-center justify-center"
              useThemeColor={false}
            >
              {item.description}
            </Caption>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

/* --------------------------------------------
   MAIN COMPONENT - 2025 Futuristic Design
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

  return (
    <Section
      ref={sectionRef}
      padding="xl"
      fullHeight={false}
      style={{ backgroundColor: '#FFFFFF' }}
      className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-white"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ backgroundColor: colorScheme.primary }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-15 animate-pulse delay-1000"
          style={{ backgroundColor: colorScheme.primaryDark }}
        />
      </div>

      <Container size="xl" className="relative z-10">
        {/* Header Section */}
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="lg"
          className="text-center pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16"
        >
          {/* Main Title with Gradient Text */}
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark})`,
              }}
            />
            <H3
              ref={headingRef}
              className="leading-tight relative"
              style={{ color: mainAccentColor }}
              useThemeColor={false}
              weight="black"
              smWeight="black"
            >
              {associatePastorsContent.mainHeader}
            </H3>
          </div>

          {/* Description with Reduced Margin */}
          <BodyMD
            ref={descriptionRef}
            className="max-w-3xl mx-auto leading-relaxed text-gray-600 mt-4 px-4 sm:px-6 lg:px-0 text-lg sm:text-xl font-light"
            useThemeColor={false}
          >
            {associatePastorsContent.mainDescription}
          </BodyMD>
        </FlexboxLayout>

        <div ref={contentRef}>
          {/* Pastoral Team Section */}
          <div className="w-full mb-16 lg:mb-20">
            <div className="relative flex justify-center mb-10">
              <H4
                ref={addSectionHeaderRef}
                className="text-center relative inline-block"
                style={{ color: mainAccentColor }}
                useThemeColor={false}
                weight="bold"
                smWeight="extrabold"
              >
                {associatePastorsContent.pastoralSection.title}
                {/* Underline Animation */}
                <div
                  className="absolute -bottom-2 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: colorScheme.primary }}
                />
              </H4>
            </div>
            <GridboxLayout
              columns={3}
              gap="xl"
              responsive={{ sm: 1, md: 2, lg: 3 }}
              className="w-full items-stretch"
            >
              {pastorsData.slice(0, 3).map(item => (
                <PersonCard
                  key={item.name}
                  item={item}
                  colorScheme={colorScheme}
                  mainAccentColor={mainAccentColor}
                  addToRefs={addToRefs}
                />
              ))}
            </GridboxLayout>
          </div>

          {/* Ministry Leaders Section */}
          <div className="w-full mb-12 lg:mb-16">
            <div className="relative flex justify-center mb-10">
              <H4
                ref={addSectionHeaderRef}
                className="text-center relative inline-block"
                style={{ color: mainAccentColor }}
                useThemeColor={false}
                weight="bold"
                smWeight="extrabold"
              >
                {associatePastorsContent.ministrySection.title}
                {/* Underline Animation */}
                <div
                  className="absolute -bottom-2 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: colorScheme.primary }}
                />
              </H4>
            </div>
            <GridboxLayout
              columns={3}
              gap="xl"
              responsive={{ sm: 1, md: 2, lg: 3 }}
              className="w-full items-stretch"
            >
              {ministryLeadersData.slice(3, 6).map(item => (
                <PersonCard
                  key={item.name}
                  item={item}
                  colorScheme={colorScheme}
                  mainAccentColor={mainAccentColor}
                  addToRefs={addToRefs}
                />
              ))}
            </GridboxLayout>
          </div>

          {/* Enhanced See More Button - Much closer to last section */}
          <FlexboxLayout
            justify="center"
            className="pt-2 sm:pt-4 lg:pt-6 pb-8 sm:pb-10 lg:pb-12"
          >
            <div className="relative group">
              {/* Background Glow Effect - Reduced size */}
              <div
                className="absolute -inset-2 sm:-inset-3 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.primary}30, ${colorScheme.primaryDark}20)`,
                }}
              />

              {/* Main Button */}
              <CustomButton
                onClick={handleSeeMore}
                variant="primary"
                size="lg"
                curvature="xl"
                elevated
                leftIcon={
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 transition-transform duration-300 group-hover:scale-110" />
                }
                rightIcon={
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3 transition-transform duration-700 group-hover:rotate-180" />
                }
                className="group relative px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg font-bold sm:font-black shadow-xl sm:shadow-2xl lg:shadow-3xl hover:shadow-3xl sm:hover:shadow-4xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 sm:border-white/30 backdrop-blur-sm bg-clip-padding overflow-hidden w-full sm:w-auto"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.primaryDark}, ${colorScheme.primary})`,
                  backgroundSize: '200% 200%',
                  color: '#000000',
                }}
              >
                {/* Animated Gradient Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, transparent, rgba(255,255,255,0.2), transparent)`,
                    backgroundSize: '200% 200%',
                    animation: 'shimmer 3s infinite linear',
                  }}
                />

                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center">
                  {associatePastorsContent.seeMoreButton}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </CustomButton>

              {/* Floating Particles - Smaller and closer */}
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/80 animate-ping" />
              <div
                className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-white/60 animate-ping"
                style={{ animationDelay: '1s' }}
              />
            </div>
          </FlexboxLayout>
        </div>
      </Container>

      {/* Custom CSS for Shimmer Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Section>
  );
}
