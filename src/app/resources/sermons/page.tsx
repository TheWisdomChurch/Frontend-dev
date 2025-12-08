/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { fetchSermons } from '@/lib/store/slices/sermonsSlice';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, BaseText, BodyMD, SemiBoldText } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import SermonUtil from '@/components/ui/Sermons';
import Button from '@/components/utils/buttons/CustomButton';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';
import { useTheme } from '@/components/contexts/ThemeContext';
import { Youtube } from 'lucide-react';

const SermonPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { colorScheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles using colorScheme
  const sectionBackground = isDarkMode ? colorScheme.white : colorScheme.black;
  const textColor = isDarkMode ? colorScheme.black : colorScheme.white;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const cardBackground = isDarkMode ? colorScheme.black : colorScheme.white;
  const cardTextColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const borderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.primary + '40';

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      dispatch(fetchSermons());
    }
  }, [dispatch, isClient]);

  const handleYouTubeRedirect = () => {
    window.open('https://www.youtube.com/@wisdomhousehq', '_blank');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading sermons...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Sermons & Teachings"
        subtitle="Catch up on all our Sermons and Teachings"
        description="Discover transformative messages from Sunday Teachings, Catch up on all our teachings from our Outreaches(Wisdom Power Conferences,Prayer), and special teachings. Grow spiritually through practical biblical Teachings."
        backgroundImage={hero_bg_1.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      <SermonUtil />

      {/* Ways to Listen Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: sectionBackground }}
      >
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center"
          >
            <H2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center mb-8"
              style={{ color: textColor }}
            >
              Watch & Listen Anywhere
            </H2>

            <GridboxLayout
              columns={1}
              gap="lg"
              responsive={{ sm: 1, md: 1, lg: 1 }}
              className="max-w-4xl mx-auto"
            >
              {[
                {
                  platform: 'YouTube',
                  description: 'Full video messages with interactive features',
                  action: 'Subscribe to Channel',
                  icon: (
                    <Youtube
                      className="w-12 h-12"
                      style={{ color: '#FF0000' }}
                    />
                  ),
                },
              ].map((option, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-2xl transition-all duration-300 border max-w-md mx-auto"
                  style={{
                    backgroundColor: cardBackground,
                    borderColor: borderColor,
                  }}
                >
                  <FlexboxLayout
                    direction="column"
                    justify="center"
                    align="center"
                    gap="md"
                    className="text-center"
                  >
                    <div className="flex justify-center mb-4">
                      {option.icon}
                    </div>

                    <BaseText
                      fontFamily="bricolage"
                      weight="bold"
                      className="text-xl sm:text-2xl mb-3"
                      style={{ color: cardTextColor }}
                    >
                      {option.platform}
                    </BaseText>

                    <BodyMD
                      className="mb-6"
                      style={{ color: secondaryTextColor }}
                    >
                      {option.description}
                    </BodyMD>

                    <Button
                      onClick={handleYouTubeRedirect}
                      variant="primary"
                      size="lg"
                      curvature="full"
                      elevated={true}
                      leftIcon={
                        <Youtube
                          className="w-5 h-5"
                          style={{ color: 'white' }}
                        />
                      }
                      className="w-full transition-all duration-300 transform hover:scale-105"
                      style={{
                        backgroundColor: '#FF0000',
                        color: 'white',
                      }}
                      onMouseEnter={(e: any) => {
                        e.currentTarget.style.backgroundColor = '#CC0000';
                      }}
                      onMouseLeave={(e: any) => {
                        e.currentTarget.style.backgroundColor = '#FF0000';
                      }}
                    >
                      <SemiBoldText style={{ color: 'white' }}>
                        {option.action}
                      </SemiBoldText>
                    </Button>
                  </FlexboxLayout>
                </div>
              ))}
            </GridboxLayout>
          </FlexboxLayout>
        </Container>
      </Section>
    </div>
  );
};

export default SermonPage;

