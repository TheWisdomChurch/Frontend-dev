/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/about.tsx
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { Banner_1, hero_bg_3, WisdomeHouseLogo } from '@/components/assets';
import { H2, H3, H4, P, Caption, BodyMD } from '@/components/text';
import CustomButton from '@/components/utils/CustomButton';
import Image from 'next/image';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';
import { missionStatement } from '@/lib/data';

const AboutUsPage = () => {
  const { colorScheme } = useTheme();

  // Theme-based styles
  const isDarkMode = colorScheme.background === '#000000';
  const textColor = isDarkMode ? colorScheme.text : colorScheme.text;
  const headingColor = isDarkMode ? colorScheme.heading : colorScheme.heading;

  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const borderColor = isDarkMode ? colorScheme.border : colorScheme.border;
  const primaryLightOpacity = isDarkMode
    ? colorScheme.opacity.primary10
    : colorScheme.opacity.primary20;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="About Us"
        subtitle="A Trans-Generational Movement of Greatness"
        description="Discover the heart, identity, and purpose of The Wisdom House — a vibrant, spirit-filled assembly committed to raising complete believers."
        backgroundImage={hero_bg_3.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Who We Are */}
      <Section className="py-16 lg:py-24 bg-white">
        <Container size="xl" className="px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <H2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-black"
              useThemeColor={false}
            >
              Who We Are
            </H2>
            <div
              className="p-8 lg:p-12 rounded-2xl shadow-lg border-l-4"
              style={{
                backgroundColor: '#ffffff',
                borderLeftColor: colorScheme.primary,
                border: `1px solid ${colorScheme.border}`,
              }}
            >
              <P
                className="text-base sm:text-lg leading-relaxed text-black mb-6"
                useThemeColor={false}
              >
                The Wisdom House is a vibrant, spirit-filled assembly committed
                to raising complete believers — men, women, and children — who
                are rooted in Christ, empowered by His wisdom, and established
                in faith.
              </P>
              <P
                className="text-lg sm:text-xl font-semibold text-black"
                useThemeColor={false}
              >
                We are a trans-generational movement — a house of light,
                transformation, and greatness.
              </P>
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision Section */}
      <Section
        className="py-12 sm:py-16 lg:py-20"
        style={{ backgroundColor: colorScheme.background }}
      >
        <Container size="xl" className="px-4 sm:px-6 lg:px-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <H2
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              style={{ color: headingColor }}
            >
              Our Vision
            </H2>
            <Caption
              className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: textColor }}
            >
              Making Many Great By The Wisdom And Power Of God
            </Caption>
          </FlexboxLayout>

          <div className="max-w-4xl mx-auto">
            <div
              className="border-l-4 sm:border-l-8 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 w-full"
              style={{
                backgroundColor: primaryLightOpacity,
                borderLeftColor: colorScheme.primary,
                border: `1px solid ${borderColor}`,
              }}
            >
              <P
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold italic leading-relaxed text-center mb-6"
                style={{ color: textColor }}
              >
                "The vision of the Church is: To Equip a people with the Wisdom
                and Power of God, for their establishment in the Faith and for
                manifesting Greatness in every facet of life."
              </P>
              <div className="text-center">
                <H4
                  className="text-lg sm:text-xl md:text-2xl font-bold"
                  style={{ color: colorScheme.primary }}
                >
                  OBEDIENCE IS AT THE CORE OF SERVICE TO GOD
                </H4>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission Section */}
      <Section
        className="py-12 sm:py-16 lg:py-20"
        style={{ backgroundColor: colorScheme.backgroundSecondary }}
      >
        <Container size="xl" className="px-4 sm:px-6 lg:px-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <H2
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              style={{ color: headingColor }}
            >
              Our Mission
            </H2>
            <P
              className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: textColor }}
            >
              The mission of the church is to help men, women and children,
              experience dimensions found in God and each of them to operate in
              the earth realm as children of God
            </P>
          </FlexboxLayout>

          <GridboxLayout
            columns={2}
            gap="lg"
            responsive={{
              sm: 1,
              md: 2,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            {[
              {
                title: 'Teaching Salvation & Love',
                description:
                  'By Teaching of the message of salvation & the love of God to save the unsaved',
              },
              {
                title: 'Extending Love',
                description:
                  'By extending love to the unchurched to get them back to the church',
              },
              {
                title: 'Equipping for Greatness',
                description: 'Equipping a generation for Greatness',
              },
              {
                title: 'Sound Doctrine',
                description: 'By Teaching sound doctrine of the word of God',
              },
              {
                title: 'Expressing Wisdom',
                description:
                  'Teaching the people how to express the manifold wisdom of God',
              },
              {
                title: 'Raising Prayer Warriors',
                description:
                  'Raising a people of prayer through teaching on prayers and consistent practice of praying',
              },
              {
                title: 'Apostolic Platform',
                description:
                  'To be an apostolic platform where men are raised, trained, and deployed for kingdom purposes in all spheres of influences',
              },
              {
                title: 'Financial Stewards',
                description:
                  'To raise financial stewards whom God will entrust with the end time grace for prosperity and kingdom wealth',
              },
              {
                title: 'True Worship',
                description:
                  'To be a platform where true worship is experienced and bringing many into the experience',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg min-h-[120px] flex flex-col justify-center"
                style={{
                  backgroundColor: cardBackground,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <H4
                  className="text-sm font-semibold mb-2"
                  style={{ color: headingColor }}
                >
                  {item.title}
                </H4>
                <BodyMD
                  className="text-xs leading-relaxed"
                  style={{ color: textColor }}
                >
                  {item.description}
                </BodyMD>
              </div>
            ))}
          </GridboxLayout>
        </Container>
      </Section>

      {/* Five Pillars Section */}
      <Section
        className="py-12 sm:py-16 lg:py-20"
        style={{ backgroundColor: colorScheme.background }}
      >
        <Container size="xl" className="px-4 sm:px-6 lg:px-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <H2
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              style={{ color: headingColor }}
            >
              Our Five Pillars
            </H2>
            <Caption
              className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: textColor }}
            >
              The foundational principles that define our identity and purpose
            </Caption>
          </FlexboxLayout>

          <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-4xl mx-auto">
            {[
              {
                title: 'Wisdom',
                description:
                  'To know the Word, To apply the Word, to Act according to the Word. Becoming one with the super intelligent spirit of God.',
              },
              {
                title: 'Leadership',
                description:
                  'To become better influence in society, to show by example kingdom virtues, impact and service. To lead like Christ.',
              },
              {
                title: 'Excellent Spirit',
                description:
                  'To be of sound Mind, aligned in obedience, Becoming a 1000 times better. To show superior skills and execution by the spirit of God.',
              },
              {
                title: 'Greatness',
                description:
                  "Greatness resides here, it's a DNA, it's an anointing, it's a covenant. Achieving God's intent in every area of life.",
              },
              {
                title: 'Dominion',
                description:
                  "Has the lord said be fruitful, multiply, fill the earth, subdue it, Have Dominion. This we shall obey to the later in every sphere of life, for God's kingdom and Glory. This is the wisdom Church.",
              },
            ].map((pillar, index) => (
              <FlexboxLayout
                key={index}
                direction="row"
                align="start"
                gap="md"
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: cardBackground,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg"
                  style={{
                    background: colorScheme.primaryGradient,
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <H4
                    className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3"
                    style={{ color: headingColor }}
                  >
                    {pillar.title}
                  </H4>
                  <BodyMD
                    className="text-sm leading-relaxed"
                    style={{ color: textColor }}
                  >
                    {pillar.description}
                  </BodyMD>
                </div>
              </FlexboxLayout>
            ))}
          </div>
        </Container>
      </Section>

      {/* Our Beliefs Section */}
      <Section
        className="py-12 sm:py-16 lg:py-20"
        style={{ backgroundColor: colorScheme.backgroundSecondary }}
      >
        <Container size="xl" className="px-4 sm:px-6 lg:px-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <H2
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              style={{ color: headingColor }}
            >
              Our Beliefs
            </H2>
            <Caption
              className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: textColor }}
            >
              The foundational truths that guide our faith and practice
            </Caption>
          </FlexboxLayout>

          <GridboxLayout
            columns={2}
            gap="lg"
            responsive={{ sm: 1, md: 2 }}
            className="max-w-6xl mx-auto"
          >
            {/* Foundational Beliefs */}
            <div className="space-y-4">
              <H3
                className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center"
                style={{ color: headingColor }}
              >
                Foundational Beliefs
              </H3>
              <div className="space-y-3">
                {[
                  'That the word of God is the final authority in the life of every believer',
                  'Prayer is a command for every believer',
                  'Holiness is a spiritual mandate for every believer',
                  'The Eternal Godhead',
                  'That Christ is the Son of God and he died and resurrected on the third day for the redemption of man',
                  'That our salvation is through the sacrifice of Jesus',
                  'That the holy Spirit was given as a seal of our salvation',
                  'That Jesus is coming back again for the rapture of the church',
                ].map((belief, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: cardBackground,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    <BodyMD
                      className="text-sm leading-relaxed"
                      style={{ color: textColor }}
                    >
                      {belief}
                    </BodyMD>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Beliefs */}
            <div className="space-y-4">
              <H3
                className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center"
                style={{ color: headingColor }}
              >
                Individual Belief
              </H3>
              <div className="space-y-4">
                {[
                  {
                    title: 'We are Light',
                    description:
                      "Called to shine in darkness and reveal God's glory",
                  },
                  {
                    title: 'We are Transformed',
                    description:
                      "Continually being changed into Christ's likeness",
                  },
                  {
                    title: 'We are Transgenerational',
                    description:
                      "Impacting present and future generations with God's wisdom",
                  },
                ].map((belief, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg text-center"
                    style={{
                      backgroundColor: primaryLightOpacity,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <H4
                      className="text-base font-semibold mb-2"
                      style={{ color: colorScheme.primary }}
                    >
                      {belief.title}
                    </H4>
                    <BodyMD className="text-sm" style={{ color: textColor }}>
                      {belief.description}
                    </BodyMD>
                  </div>
                ))}
              </div>
            </div>
          </GridboxLayout>
        </Container>
      </Section>

      {/* Our Identity */}
      <Section
        className="py-16 lg:py-24"
        style={{ backgroundColor: colorScheme.backgroundSecondary }}
      >
        <Container size="xl" className="px-6 lg:px-8">
          <GridboxLayout
            columns={2}
            gap="lg"
            responsive={{ sm: 1, md: 2 }}
            className="items-center"
          >
            {/* Text Content */}
            <div className="space-y-6">
              <H3
                className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight"
                style={{ color: headingColor }}
              >
                Our Identity
                <br />
                <span style={{ color: colorScheme.primary }}>
                  The Wave of Greatness
                </span>
              </H3>
              <div className="space-y-4">
                <P style={{ color: textColor }}>
                  We are not just a church — we are a{' '}
                  <strong>Wisdom House</strong>. A place where greatness is
                  cultivated, excellence is pursued, and dominion is exercised.
                </P>
                <P className="font-semibold" style={{ color: headingColor }}>
                  Our DNA is greatness. Our culture is wisdom. Our calling is to
                  manifest the fullness of Christ in every sphere of life.
                </P>
              </div>
            </div>

            {/* Visual Content */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-2xl -z-10 scale-125 opacity-50"
                  style={{ backgroundColor: colorScheme.primaryLight }}
                />
                <div
                  className="w-56 h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden ring-4 shadow-xl"
                  style={{
                    borderColor: colorScheme.primary + '30',
                    backgroundColor: cardBackground,
                  }}
                >
                  <Image
                    src={WisdomeHouseLogo}
                    alt="Wave of Greatness"
                    width={288}
                    height={288}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <H4
                className="mt-6 text-lg lg:text-xl font-bold"
                style={{ color: colorScheme.primary }}
              >
                Wave of Greatness
              </H4>
            </div>
          </GridboxLayout>
        </Container>
      </Section>

      {/* CTA Section */}
      {/* <Section
        className="py-16 lg:py-24"
        style={{ backgroundColor: colorScheme.primary }}
      >
        <Container size="xl" className="text-center px-6 lg:px-8">
          <H3
            className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-white"
            useThemeColor={false}
          >
            Join Our Family
          </H3>
          <P
            className="text-white mb-8 max-w-2xl mx-auto"
            useThemeColor={false}
          >
            Ready to become part of this trans-generational movement of
            greatness?
          </P>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CustomButton
              variant="secondary"
              size="md"
              curvature="full"
              elevated
              className="px-8 py-4 font-semibold"
              style={{
                backgroundColor: colorScheme.secondary,
                color: colorScheme.onSecondary,
              }}
            >
              Plan Your First Visit
            </CustomButton>
            <CustomButton
              variant="outline"
              size="md"
              curvature="full"
              elevated
              rightIcon={<ArrowRight className="w-4 h-4 ml-2" />}
              className="px-8 py-4 font-semibold border-2 text-white border-white"
            >
              Learn More About Us
            </CustomButton>
          </div>
        </Container>
      </Section> */}
    </div>
  );
};

export default AboutUsPage;
