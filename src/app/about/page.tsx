/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/about.tsx
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { Banner_1, hero_bg_3, WisdomeHouseLogo } from '@/components/assets';
import { H2, H3, H4, P, SmallText, Caption } from '@/components/text';
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

      {/* Mission Statement Section */}
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
            className="text-center"
          >
            <H2
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ color: headingColor }}
            >
              Our Mission
            </H2>

            <div
              className="border-l-4 sm:border-l-8 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 w-full max-w-4xl"
              style={{
                backgroundColor: primaryLightOpacity,
                borderLeftColor: colorScheme.primary,
                border: `1px solid ${borderColor}`,
              }}
            >
              <P
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold italic leading-relaxed text-center"
                style={{ color: textColor }}
              >
                "{missionStatement}"
              </P>
            </div>
          </FlexboxLayout>
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

      {/* Vision Section */}
      <Section
        style={{ backgroundColor: colorScheme.backgroundSecondary }}
        className="py-12 sm:py-16 lg:py-20"
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
              Where God is leading us in the coming years
            </Caption>
          </FlexboxLayout>

          <GridboxLayout
            columns={3}
            gap="lg"
            responsive={{
              sm: 1,
              md: 2,
              lg: 3,
            }}
            className="w-full"
          >
            {[
              {
                icon: '🙏',
                title: 'Spiritual Growth',
                description:
                  'To see every member growing in their relationship with Christ through discipleship, prayer, and biblical teaching.',
              },
              {
                icon: '👨‍👩‍👧‍👦',
                title: 'Community Impact',
                description:
                  'To be a light in our community, meeting practical needs and sharing the hope of the Gospel through service and outreach.',
              },
              {
                icon: '🌍',
                title: 'Global Reach',
                description:
                  "To support missions and spread God's love worldwide, making disciples of all nations as Jesus commanded.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-xl"
                style={{
                  backgroundColor: cardBackground,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                  style={{
                    backgroundColor: primaryLightOpacity,
                  }}
                >
                  <span className="text-2xl sm:text-3xl md:text-4xl">
                    {item.icon}
                  </span>
                </div>
                <H4
                  className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4"
                  style={{ color: headingColor }}
                >
                  {item.title}
                </H4>
                <SmallText
                  className="text-xs sm:text-sm md:text-base leading-relaxed"
                  style={{ color: textColor }}
                >
                  {item.description}
                </SmallText>
              </div>
            ))}
          </GridboxLayout>
        </Container>
      </Section>

      {/* Membership Meaning */}
      <Section className="py-16 lg:py-24 bg-gray-50">
        <Container size="xl" className="px-6 lg:px-8">
          <div className="text-center mb-12">
            <H3
              className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4"
              style={{ color: headingColor }}
            >
              What It Means to Be a Member
            </H3>
            <P style={{ color: textColor }}>
              Embracing our identity and living out our purpose
            </P>
          </div>

          <GridboxLayout
            columns={2}
            gap="md"
            responsive={{ sm: 1, md: 2 }}
            className="mb-12"
          >
            {/* Left Column */}
            <div className="space-y-4">
              {[
                {
                  title: "Embrace God's Sovereignty",
                  desc: "To embrace God's sovereignty and grace in every aspect of life",
                },
                {
                  title: 'Spirit-Filled Living',
                  desc: 'To be Spirit-filled, Spirit-yielded, and Spirit-deep in our walk with God',
                },
                {
                  title: 'Bold Representation',
                  desc: 'To represent Christ boldly in every sphere of influence',
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[100px] flex items-center"
                  style={{
                    borderLeftColor: colorScheme.primary,
                    backgroundColor: cardBackground,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <div className="flex-1">
                    <H4
                      className="text-sm font-semibold mb-2"
                      style={{ color: headingColor }}
                    >
                      {item.title}
                    </H4>
                    <SmallText style={{ color: textColor }}>
                      {item.desc}
                    </SmallText>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {[
                {
                  title: 'Pursue Excellence',
                  desc: 'To pursue excellence and productivity in all endeavors',
                },
                {
                  title: 'Live in Love & Righteousness',
                  desc: 'To live in love, righteousness, and generosity toward others',
                },
                {
                  title: 'Uphold Holiness',
                  desc: 'To reject compromise while upholding holiness in daily life',
                },
              ].map(item => (
                <div
                  key={item.title}
                  className="p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[100px] flex items-center"
                  style={{
                    borderLeftColor: colorScheme.secondary,
                    backgroundColor: cardBackground,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <div className="flex-1">
                    <H4
                      className="text-sm font-semibold mb-2"
                      style={{ color: headingColor }}
                    >
                      {item.title}
                    </H4>
                    <SmallText style={{ color: textColor }}>
                      {item.desc}
                    </SmallText>
                  </div>
                </div>
              ))}
            </div>
          </GridboxLayout>

          {/* Closing Statement */}
          <div className="text-center">
            <div
              className="inline-block p-8 lg:p-12 rounded-2xl shadow-lg"
              style={{
                background: colorScheme.primaryGradient,
              }}
            >
              <P className="text-white font-medium" useThemeColor={false}>
                This is what it means to be part of{' '}
                <span className="font-bold">The Wisdom House</span> — a
                community where God's wisdom transforms ordinary lives into
                extraordinary testimonies of His glory.
              </P>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Values Section */}
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
              Our Core Values
            </H2>
            <Caption
              className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: textColor }}
            >
              The principles that guide our decisions and actions
            </Caption>
          </FlexboxLayout>

          <div className="space-y-6 sm:space-y-8 lg:space-y-10 max-w-4xl mx-auto">
            {[
              {
                title: 'Biblical Authority',
                description:
                  'We submit to the absolute authority of Scripture in all matters of faith and practice.',
              },
              {
                title: 'Prayer & Dependence',
                description:
                  'We rely on God through fervent prayer, recognizing our need for His guidance and power.',
              },
              {
                title: 'Authentic Community',
                description:
                  'We pursue genuine relationships where we can grow, serve, and care for one another.',
              },
              {
                title: 'Generous Service',
                description:
                  'We serve others with the love of Christ, both within our church and in our community.',
              },
              {
                title: 'Spiritual Growth',
                description:
                  'We are committed to helping every believer mature in their faith and Christlikeness.',
              },
            ].map((value, index) => (
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
                    {value.title}
                  </H4>
                  <SmallText
                    className="text-xs sm:text-sm md:text-base leading-relaxed"
                    style={{ color: textColor }}
                  >
                    {value.description}
                  </SmallText>
                </div>
              </FlexboxLayout>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section
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
      </Section>
    </div>
  );
};

export default AboutUsPage;
