/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { hero_bg_3 } from '@/components/assets';
import { missionStatement } from '@/lib/data';
import { H1, H3, LightText, SmallText } from '@/components/text';
import CustomButton from '@/components/utils/CustomButton';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';

const MissionPage = () => {
  const { colorScheme } = useTheme();

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const textColor = isDarkMode ? colorScheme.text : colorScheme.text;
  const headingColor = isDarkMode ? colorScheme.heading : colorScheme.heading;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const borderColor = isDarkMode ? colorScheme.border : colorScheme.border;
  const primaryLightOpacity = isDarkMode
    ? colorScheme.opacity.primary10
    : colorScheme.opacity.primary20;

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Our Mission & Vision"
        subtitle="Purpose Driven, Spirit Led"
        description="Discover the God-given purpose that guides everything we do as a church family, from local outreach to global impact."
        backgroundImage={hero_bg_3.src}
        showButtons={false}
        primaryButtonText="Get Involved"
        secondaryButtonText="Our Ministries"
        showScrollIndicator={true}
      />

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
            <H1
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: headingColor }}
            >
              Our Mission
            </H1>

            <div
              className="border-l-4 sm:border-l-8 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 w-full max-w-4xl"
              style={{
                backgroundColor: primaryLightOpacity,
                borderLeftColor: colorScheme.primary,
                border: `1px solid ${borderColor}`,
              }}
            >
              <LightText
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold italic leading-relaxed text-center"
                style={{ color: textColor }}
              >
                "{missionStatement}"
              </LightText>
            </div>
          </FlexboxLayout>
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
            <H1
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              style={{ color: headingColor }}
            >
              Our Vision
            </H1>
            <LightText
              className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: textColor }}
            >
              Where God is leading us in the coming years
            </LightText>
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
                <H3
                  className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4"
                  style={{ color: headingColor }}
                >
                  {item.title}
                </H3>
                <SmallText
                  className="text-sm sm:text-base md:text-lg leading-relaxed"
                  style={{ color: textColor }}
                >
                  {item.description}
                </SmallText>
              </div>
            ))}
          </GridboxLayout>
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
            <H1
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              style={{ color: headingColor }}
            >
              Our Core Values
            </H1>
            <LightText
              className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: textColor }}
            >
              The principles that guide our decisions and actions
            </LightText>
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
                  <H3
                    className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3"
                    style={{ color: headingColor }}
                  >
                    {value.title}
                  </H3>
                  <SmallText
                    className="text-sm sm:text-base md:text-lg leading-relaxed"
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

      {/* Call to Action */}
      <Section
        className="py-12 sm:py-16 lg:py-20"
        style={{ backgroundColor: colorScheme.primary }}
      >
        <Container size="xl" className="px-4 sm:px-6 lg:px-8">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center"
          >
            <H1
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              style={{ color: colorScheme.onPrimary }}
            >
              Join Us in Our Mission
            </H1>
            <LightText
              className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10"
              style={{ color: colorScheme.onPrimary }}
            >
              Ready to be part of what God is doing at The Wisdom House?
            </LightText>

            <FlexboxLayout
              direction="column"
              responsiveDirection={{ sm: 'row' }}
              gap="md"
              justify="center"
              align="center"
              className="w-full sm:w-auto"
            >
              <CustomButton
                variant="secondary"
                size="lg"
                curvature="full"
                elevated={true}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
                style={{
                  backgroundColor: colorScheme.secondary,
                  color: colorScheme.onSecondary,
                }}
              >
                Plan Your Visit
              </CustomButton>
              <CustomButton
                variant="outline"
                size="lg"
                curvature="full"
                elevated={true}
                rightIcon={<ArrowRight className="w-4 h-4 ml-2" />}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base border-2"
                style={{
                  borderColor: colorScheme.onPrimary,
                  color: colorScheme.onPrimary,
                }}
              >
                Contact Us
              </CustomButton>
            </FlexboxLayout>
          </FlexboxLayout>
        </Container>
      </Section>
    </div>
  );
};

export default MissionPage;
