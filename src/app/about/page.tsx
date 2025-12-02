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

  // Text colors
  const headingColor = isDarkMode ? colorScheme.heading : colorScheme.gray[900];
  const bodyTextColor = isDarkMode ? colorScheme.text : colorScheme.gray[800];
  const subtleTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.gray[600];
  const lightTextColor = isDarkMode ? colorScheme.text : colorScheme.gray[100];

  // Background colors
  const primaryDarkBg = isDarkMode
    ? colorScheme.surface
    : colorScheme.gray[900];
  const secondaryDarkBg = isDarkMode
    ? colorScheme.backgroundSecondary
    : colorScheme.gray[800];
  const lightBg = isDarkMode ? colorScheme.background : colorScheme.white;
  const subtleBg = isDarkMode
    ? colorScheme.backgroundSecondary
    : colorScheme.gray[50];

  // Card and border colors
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const darkCardBackground = isDarkMode
    ? colorScheme.backgroundSecondary
    : colorScheme.gray[800];
  const borderColor = isDarkMode ? colorScheme.border : colorScheme.gray[200];
  const darkBorderColor = isDarkMode
    ? colorScheme.borderLight
    : colorScheme.gray[700];
  const primaryBorderColor = isDarkMode
    ? colorScheme.primary
    : colorScheme.primaryDark;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colorScheme.pageBackground }}
    >
      {/* Hero Section */}
      <HeroSection
        title="About Us"
        subtitle="A Trans-Generational Movement of Greatness"
        description="Discover the heart, identity, and purpose of The Wisdom House — a vibrant, spirit-filled assembly committed to raising complete believers."
        backgroundImage={hero_bg_3.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Who We Are - Dark Section in Light Mode */}
      <Section
        className="py-12 md:py-16 lg:py-20"
        style={{
          backgroundColor: primaryDarkBg,
          borderBottom: isDarkMode ? `1px solid ${borderColor}` : 'none',
        }}
      >
        <Container size="xl" className="px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <H3
              className="text-lg md:text-xl font-medium mb-6 tracking-tight"
              style={{ color: isDarkMode ? headingColor : colorScheme.white }}
              weight="medium"
            >
              Who We Are
            </H3>
            <div
              className="p-6 md:p-8 rounded-xl"
              style={{
                backgroundColor: isDarkMode ? cardBackground : secondaryDarkBg,
                border: `1px solid ${isDarkMode ? borderColor : darkBorderColor}`,
                boxShadow: isDarkMode
                  ? colorScheme.shadowMd
                  : '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              <P
                className="text-sm md:text-base leading-relaxed mb-4 font-light"
                style={{
                  color: isDarkMode ? subtleTextColor : colorScheme.gray[300],
                }}
              >
                The Wisdom House is a vibrant, spirit-filled assembly committed
                to raising complete believers — men, women, and children — who
                are rooted in Christ, empowered by His wisdom, and established
                in faith.
              </P>
              <P
                className="text-sm md:text-base font-normal leading-relaxed"
                style={{
                  color: isDarkMode ? bodyTextColor : colorScheme.gray[100],
                }}
              >
                We are a trans-generational movement — a house of light,
                transformation, and greatness.
              </P>
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision Section - Dark Background */}
      <Section
        className="py-12 md:py-16 lg:py-20"
        style={{
          backgroundColor: isDarkMode
            ? colorScheme.backgroundSecondary
            : colorScheme.black,
        }}
      >
        <Container size="xl" className="px-4 md:px-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-8 md:mb-12"
          >
            <H3
              className="text-lg md:text-xl font-medium tracking-tight mb-3"
              style={{
                color: isDarkMode ? colorScheme.heading : colorScheme.white,
              }}
              weight="medium"
            >
              Our Vision
            </H3>
            <Caption
              className="text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-light"
              style={{
                color: isDarkMode
                  ? colorScheme.textSecondary
                  : colorScheme.primaryLight,
              }}
            >
              Making Many Great By The Wisdom And Power Of God
            </Caption>
          </FlexboxLayout>

          <div className="max-w-3xl mx-auto">
            <div
              className="border-l-4 rounded-xl p-6 md:p-8"
              style={{
                backgroundColor: isDarkMode
                  ? colorScheme.surface
                  : colorScheme.gray[900],
                borderLeftColor: colorScheme.primary,
                border: `1px solid ${isDarkMode ? colorScheme.borderLight : colorScheme.gray[800]}`,
                boxShadow: '0 4px 20px rgba(247, 222, 18, 0.1)',
              }}
            >
              <P
                className="text-sm md:text-base font-normal italic leading-relaxed mb-4 text-center"
                style={{
                  color: isDarkMode
                    ? colorScheme.textSecondary
                    : colorScheme.gray[200],
                }}
              >
                "The vision of the Church is: To Equip a people with the Wisdom
                and Power of God, for their establishment in the Faith and for
                manifesting Greatness in every facet of life."
              </P>
              <div className="text-center">
                <H4
                  className="text-sm md:text-base font-medium"
                  style={{
                    color: isDarkMode ? colorScheme.text : colorScheme.primary,
                    textShadow: isDarkMode
                      ? 'none'
                      : '0 0 10px rgba(247, 222, 18, 0.3)',
                  }}
                  weight="medium"
                >
                  OBEDIENCE IS AT THE CORE OF SERVICE TO GOD
                </H4>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission Section - Light Background */}
      <Section
        className="py-12 md:py-16 lg:py-20"
        style={{
          backgroundColor: lightBg,
        }}
      >
        <Container size="xl" className="px-4 md:px-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-8 md:mb-12"
          >
            <H3
              className="text-lg md:text-xl font-medium tracking-tight mb-3"
              style={{ color: headingColor }}
              weight="medium"
            >
              Our Mission
            </H3>
            <P
              className="text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-light"
              style={{ color: subtleTextColor }}
            >
              The mission of the church is to help men, women and children,
              experience dimensions found in God and each of them to operate in
              the earth realm as children of God
            </P>
          </FlexboxLayout>

          <GridboxLayout
            columns={2}
            gap="md"
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
                className="rounded-lg p-4 transition-all duration-200 hover:shadow-lg border min-h-[120px] flex flex-col justify-center"
                style={{
                  backgroundColor: cardBackground,
                  borderColor: borderColor,
                  boxShadow: isDarkMode
                    ? colorScheme.shadowSm
                    : '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <BodyMD
                  className="text-sm font-medium mb-2"
                  style={{ color: headingColor }}
                  weight="medium"
                >
                  {item.title}
                </BodyMD>
                <Caption
                  className="text-xs leading-relaxed"
                  style={{ color: subtleTextColor }}
                >
                  {item.description}
                </Caption>
              </div>
            ))}
          </GridboxLayout>
        </Container>
      </Section>

      {/* Five Pillars Section - Dark Background */}
      <Section
        className="py-12 md:py-16 lg:py-20"
        style={{
          backgroundColor: secondaryDarkBg,
          borderTop: isDarkMode ? `1px solid ${borderColor}` : 'none',
          borderBottom: isDarkMode ? `1px solid ${borderColor}` : 'none',
        }}
      >
        <Container size="xl" className="px-4 md:px-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-8 md:mb-12"
          >
            <H3
              className="text-lg md:text-xl font-medium tracking-tight mb-3"
              style={{ color: isDarkMode ? headingColor : colorScheme.white }}
              weight="medium"
            >
              Our Five Pillars
            </H3>
            <Caption
              className="text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-light"
              style={{
                color: isDarkMode ? subtleTextColor : colorScheme.gray[300],
              }}
            >
              The foundational principles that define our identity and purpose
            </Caption>
          </FlexboxLayout>

          <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
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
                className="rounded-lg p-5 md:p-6 transition-all duration-200 hover:shadow-lg border"
                style={{
                  backgroundColor: isDarkMode
                    ? cardBackground
                    : colorScheme.gray[800],
                  borderColor: isDarkMode ? borderColor : colorScheme.gray[700],
                  boxShadow: isDarkMode
                    ? 'none'
                    : '0 4px 20px rgba(0,0,0,0.15)',
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-black font-medium text-base md:text-lg shadow-lg"
                  style={{
                    background: colorScheme.primaryGradient,
                    boxShadow: '0 4px 15px rgba(247, 222, 18, 0.3)',
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <BodyMD
                    className="text-sm md:text-base font-medium mb-2"
                    style={{
                      color: isDarkMode ? headingColor : colorScheme.white,
                    }}
                    weight="medium"
                  >
                    {pillar.title}
                  </BodyMD>
                  <Caption
                    className="text-xs leading-relaxed"
                    style={{
                      color: isDarkMode
                        ? subtleTextColor
                        : colorScheme.gray[300],
                    }}
                  >
                    {pillar.description}
                  </Caption>
                </div>
              </FlexboxLayout>
            ))}
          </div>
        </Container>
      </Section>

      {/* Our Beliefs Section - Light Background */}
      <Section
        className="py-12 md:py-16 lg:py-20"
        style={{
          backgroundColor: subtleBg,
        }}
      >
        <Container size="xl" className="px-4 md:px-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="md"
            className="text-center mb-8 md:mb-12"
          >
            <H3
              className="text-lg md:text-xl font-medium tracking-tight mb-3"
              style={{ color: headingColor }}
              weight="medium"
            >
              Our Beliefs
            </H3>
            <Caption
              className="text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-light"
              style={{ color: subtleTextColor }}
            >
              The foundational truths that guide our faith and practice
            </Caption>
          </FlexboxLayout>

          <GridboxLayout
            columns={2}
            gap="md"
            responsive={{ sm: 1, md: 2 }}
            className="max-w-6xl mx-auto"
          >
            {/* Foundational Beliefs */}
            <div className="space-y-3">
              <BodyMD
                className="text-base font-medium mb-3 text-center"
                style={{ color: headingColor }}
                weight="medium"
              >
                Foundational Beliefs
              </BodyMD>
              <div className="space-y-2">
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
                    className="flex items-start gap-2 p-3 rounded-lg border"
                    style={{
                      backgroundColor: cardBackground,
                      borderColor: primaryBorderColor,
                      borderLeftWidth: '4px',
                      borderLeftColor: primaryBorderColor,
                      boxShadow: '0 2px 8px rgba(247, 222, 18, 0.08)',
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: colorScheme.primary }}
                    />
                    <Caption
                      className="text-xs leading-relaxed"
                      style={{ color: subtleTextColor }}
                    >
                      {belief}
                    </Caption>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Beliefs */}
            <div className="space-y-3">
              <BodyMD
                className="text-base font-medium mb-3 text-center"
                style={{ color: headingColor }}
                weight="medium"
              >
                Individual Belief
              </BodyMD>
              <div className="space-y-3">
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
                    className="p-4 rounded-lg text-center border"
                    style={{
                      backgroundColor: cardBackground,
                      borderColor: borderColor,
                      boxShadow: isDarkMode
                        ? colorScheme.shadowSm
                        : '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                  >
                    <BodyMD
                      className="text-sm font-medium mb-2"
                      style={{ color: colorScheme.primary }}
                      weight="medium"
                    >
                      {belief.title}
                    </BodyMD>
                    <Caption
                      className="text-xs"
                      style={{ color: subtleTextColor }}
                    >
                      {belief.description}
                    </Caption>
                  </div>
                ))}
              </div>
            </div>
          </GridboxLayout>
        </Container>
      </Section>

      {/* Our Identity - Dark Background */}
      <Section
        className="py-12 md:py-16 lg:py-20"
        style={{
          backgroundColor: primaryDarkBg,
          borderTop: isDarkMode ? `1px solid ${borderColor}` : 'none',
        }}
      >
        <Container size="xl" className="px-4 md:px-8">
          <GridboxLayout
            columns={2}
            gap="lg"
            responsive={{ sm: 1, md: 2 }}
            className="items-center"
          >
            {/* Text Content */}
            <div className="space-y-4">
              <H4
                className="text-base md:text-lg font-medium leading-relaxed"
                style={{ color: isDarkMode ? headingColor : colorScheme.white }}
                weight="medium"
              >
                Our Identity
                <br />
                <span
                  className="font-normal"
                  style={{
                    color: colorScheme.primary,
                    textShadow: '0 0 20px rgba(247, 222, 18, 0.4)',
                  }}
                >
                  The Wave of Greatness
                </span>
              </H4>
              <div className="space-y-3">
                <P
                  className="leading-relaxed"
                  style={{
                    color: isDarkMode ? subtleTextColor : colorScheme.gray[300],
                  }}
                >
                  We are not just a church — we are a{' '}
                  <span
                    className="font-medium"
                    style={{
                      color: isDarkMode ? headingColor : colorScheme.white,
                    }}
                  >
                    Wisdom House
                  </span>
                  . A place where greatness is cultivated, excellence is
                  pursued, and dominion is exercised.
                </P>
                <P
                  className="font-medium leading-relaxed"
                  style={{
                    color: isDarkMode ? headingColor : colorScheme.white,
                  }}
                >
                  Our DNA is greatness. Our culture is wisdom. Our calling is to
                  manifest the fullness of Christ in every sphere of life.
                </P>
              </div>
            </div>

            {/* Visual Content */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-2xl -z-10 scale-125 opacity-40"
                  style={{
                    background: `radial-gradient(circle at center, ${colorScheme.primary}30 0%, transparent 70%)`,
                  }}
                />
                <div
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-4 shadow-2xl"
                  style={{
                    borderColor: isDarkMode
                      ? colorScheme.primary + '40'
                      : colorScheme.primary + '60',
                    backgroundColor: isDarkMode
                      ? cardBackground
                      : colorScheme.gray[800],
                    boxShadow: `0 20px 60px ${isDarkMode ? 'rgba(247, 222, 18, 0.2)' : 'rgba(247, 222, 18, 0.25)'}`,
                  }}
                >
                  <Image
                    src={WisdomeHouseLogo}
                    alt="Wave of Greatness"
                    width={224}
                    height={224}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              <BodyMD
                className="mt-6 text-sm md:text-base font-medium"
                style={{
                  color: colorScheme.primary,
                  textShadow: '0 0 15px rgba(247, 222, 18, 0.5)',
                }}
                weight="medium"
              >
                Wave of Greatness
              </BodyMD>
            </div>
          </GridboxLayout>
        </Container>
      </Section>
    </div>
  );
};

export default AboutUsPage;
