/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { fetchSermons } from '@/lib/store/slices/sermonsSlice';
import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, BaseText, LightText } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import SermonUtil from '@/components/ui/Sermons';
import Button from '@/components/utils/CustomButton';
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
  // useSelector((state: RootState) => state.sermons);

  useEffect(() => {
    dispatch(fetchSermons());
  }, [dispatch]);

  const handleYouTubeRedirect = () => {
    // Replace with your actual YouTube channel URL
    window.open('https://www.youtube.com/@wisdomhousehq', '_blank');
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Sermons & Teachings"
        subtitle="Catch up on all our Sermons and Teachings"
        description="Discover transformative messages from Sunday Teachings, Catch up on all our teachings from our Outreaches(Wisdom Power Conferences,Prayer), and special teachings. Grow spiritually through practical biblical Teachings."
        backgroundImage={hero_bg_1.src}
        showButtons={false}
        // primaryButtonText="Watch Latest Message"
        // secondaryButtonText="Browse All Series"
        // onPrimaryButtonClick={handleWatchSeries}
        // onSecondaryButtonClick={scrollToSeries}
        showScrollIndicator={true}
      />

      {/* Use the unified SermonUtil component */}
      <SermonUtil />

      {/* Ways to Listen Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: colorScheme.white }}
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
              style={{ color: colorScheme.black }}
            >
              Watch & Listen Anywhere
            </H2>

            <GridboxLayout
              columns={1}
              gap="lg"
              responsive={{
                sm: 1,
                md: 1,
                lg: 1,
              }}
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
                    backgroundColor: colorScheme.black,
                    borderColor: colorScheme.border,
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
                      style={{ color: colorScheme.white }}
                    >
                      {option.platform}
                    </BaseText>

                    <LightText
                      className="mb-6 text-sm sm:text-base"
                      style={{ color: colorScheme.textSecondary }}
                    >
                      {option.description}
                    </LightText>

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
                      {option.action}
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
