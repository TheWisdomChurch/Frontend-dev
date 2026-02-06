'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { fetchSermons } from '@/lib/store/slices/sermonsSlice';
import { H2, BaseText, BodyMD, SemiBoldText, Caption, SmallText, H1 } from '@/components/text';
import { WisdomeHouseLogo } from '@/components/assets';
import Image from 'next/image';
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

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Memoize theme-based styles to prevent recalculation on each render
  const themeStyles = {
    sectionBackground: isDarkMode ? colorScheme.white : colorScheme.black,
    textColor: isDarkMode ? colorScheme.black : colorScheme.white,
    secondaryTextColor: isDarkMode
      ? colorScheme.textSecondary
      : colorScheme.textTertiary,
    cardBackground: isDarkMode ? colorScheme.black : colorScheme.white,
    cardTextColor: isDarkMode ? colorScheme.white : colorScheme.black,
    borderColor: isDarkMode ? colorScheme.border : `${colorScheme.primary}40`,
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
    <div className="min-h-screen">
      <Section padding="none" className="relative overflow-hidden bg-black" perf="none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.05) 0%, transparent 35%), radial-gradient(circle at 82% 12%, rgba(255,255,255,0.05) 0%, transparent 32%), radial-gradient(circle at 55% 90%, rgba(255,255,255,0.04) 0%, transparent 40%)',
            filter: 'blur(70px)',
          }}
        />
        <div className="hero-animated" />
        <Container
          size="xl"
          className="relative z-10 flex flex-col gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 py-16 lg:py-22 min-h-[100vh]"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 w-fit backdrop-blur">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/15 bg-black/60">
              <Image src={WisdomeHouseLogo} alt="The Wisdom House" fill className="object-contain p-1.5" />
            </div>
            <Caption className="text-white/80 uppercase tracking-[0.22em] text-[11px]">
              The Wisdom House Church
            </Caption>
          </div>

          <div className="space-y-4 max-w-4xl">
            <H1 className="hero-title-glow text-3xl sm:text-4xl md:text-[2.8rem] lg:text-[3.1rem] font-black text-white leading-tight">
              Sermons & Teachings
            </H1>
            <H2 className="text-xl sm:text-2xl lg:text-3xl font-semibold" style={{ color: colorScheme.primary }}>
              Catch up on every message.
            </H2>
            <BodyMD className="text-white/85 leading-relaxed text-base sm:text-lg">
              Discover transformative messages from Sundays, conferences, and midweek gatherings. Grow through practical biblical teaching.
            </BodyMD>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
            {[
              { label: 'Platform', value: 'YouTube' },
              { label: 'Format', value: 'Video + Audio' },
              { label: 'New', value: 'Weekly uploads' },
              { label: 'Live', value: 'Sundays & Thursdays' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 space-y-1"
                style={{ boxShadow: `0 10px 30px ${colorScheme.primary}20` }}
              >
                <Caption className="text-white/60">{item.label}</Caption>
                <SmallText className="text-white font-semibold">{item.value}</SmallText>
              </div>
            ))}
          </div>
        </Container>
      </Section>

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
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center mb-8"
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
