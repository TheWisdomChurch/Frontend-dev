'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { fetchSermons } from '@/lib/store/slices/sermonsSlice';
import {
  H2,
  BaseText,
  BodyMD,
  SemiBoldText,
  Caption,
  SmallText,
  H1,
} from '@/shared/text';
import SermonUtil from '@/shared/ui/Sermons';
import Button from '@/shared/utils/buttons/CustomButton';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/shared/layout';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { Youtube } from 'lucide-react';
import PageHero from '@/features/hero/PageHero';

const SermonPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { colorScheme, isDark } = useTheme();

  // Use resolved theme flag instead of hard-coded color checks
  const isDarkMode = isDark;

  // Memoize theme-based styles to prevent recalculation on each render
  const themeStyles = {
    sectionBackground: isDarkMode
      ? colorScheme.backgroundSecondary
      : colorScheme.backgroundSecondary,
    textColor: colorScheme.text,
    secondaryTextColor: colorScheme.textSecondary,
    cardBackground: isDarkMode ? 'rgba(255,255,255,0.04)' : colorScheme.white,
    cardTextColor: colorScheme.text,
    borderColor: isDarkMode
      ? 'rgba(255,255,255,0.12)'
      : `${colorScheme.primary}40`,
  };

  // Single useEffect for data fetching
  useEffect(() => {
    dispatch(fetchSermons());
  }, [dispatch]);

  const handleYouTubeRedirect = () => {
    window.open(
      'https://www.youtube.com/@wisdomhousehq',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const youtubeOptions = [
    {
      platform: 'YouTube' as const,
      description: 'Full video messages with interactive features',
      action: 'Subscribe to Channel',
      icon: <Youtube className="w-12 h-12" style={{ color: '#FF0000' }} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Sermons & Teachings"
        subtitle="Catch up on every message"
        note="Transformative messages from Sundays, conferences, and midweek gatherings. Practical biblical teaching for daily life."
        chips={[
          'Platform: YouTube',
          'Format: Video + Audio',
          'New: Weekly uploads',
          'Live: Sun & Thu',
        ]}
      />

      <SermonUtil />

      {/* Ways to Listen Section */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: themeStyles.sectionBackground }}
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
              className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-center mb-6"
              style={{ color: themeStyles.textColor }}
            >
              Watch & Listen Anywhere
            </H2>

            <GridboxLayout
              columns={1}
              gap="lg"
              responsive={{ sm: 1, md: 1, lg: 1 }}
              className="max-w-4xl mx-auto"
            >
              {youtubeOptions.map((option, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-2xl transition-all duration-300 border max-w-md mx-auto"
                  style={{
                    backgroundColor: themeStyles.cardBackground,
                    borderColor: themeStyles.borderColor,
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
                      style={{ color: themeStyles.cardTextColor }}
                    >
                      {option.platform}
                    </BaseText>

                    <BodyMD
                      className="mb-6"
                      style={{ color: themeStyles.secondaryTextColor }}
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
                      onMouseEnter={e => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = '#CC0000';
                      }}
                      onMouseLeave={e => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = '#FF0000';
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
