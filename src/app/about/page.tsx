// pages/about.tsx
'use client';

import HeroSection from '@/components/ui/Homepage/Herosection';
import { Banner_1, hero_bg_3, WisdomeHouseLogo } from '@/components/assets';
import { H1, H2, H3, LightText } from '@/components/text';
import CustomButton from '@/components/utils/CustomButton';
import Image from 'next/image';
import { Section, Container, GridboxLayout } from '@/components/layout';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/contexts/ThemeContext';

const AboutUsPage = () => {
  const { colorScheme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection
        title="About Us"
        subtitle="A Trans-Generational Movement of Greatness"
        description="Discover the heart, identity, and purpose of The Wisdom House — a vibrant, spirit-filled assembly committed to raising complete believers."
        backgroundImage={hero_bg_3.src}
        showButtons={false}
        showScrollIndicator={true}
      />

      {/* Who We Are */}
      <Section background="light" className="py-24 lg:py-32">
        <Container size="xl" className="px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <H1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-10"
              style={{ color: colorScheme.black }}
            >
              Who We Are
            </H1>
            <div
              className="p-12 lg:p-20 rounded-3xl shadow-2xl border-l-8"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.secondary}08)`,
                borderLeftColor: colorScheme.primary,
              }}
            >
              <LightText
                className="text-xl sm:text-2xl lg:text-3xl leading-relaxed"
                style={{ color: colorScheme.body }}
              >
                The Wisdom House is a vibrant, spirit-filled assembly committed
                to raising complete believers — men, women, and children — who
                are rooted in Christ, empowered by His wisdom, and established
                in faith.
              </LightText>
              <LightText
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-10 block"
                style={{ color: colorScheme.black }}
              >
                We are a trans-generational movement — a house of light,
                transformation, and greatness.
              </LightText>
            </div>
          </div>
        </Container>
      </Section>

      {/* Our Identity */}
      <Section
        className="py-24 lg:py-32"
        style={{ backgroundColor: colorScheme.background }}
      >
        <Container size="xl" className="px-6 lg:px-8">
          <GridboxLayout
            columns={2}
            gap="xl"
            responsive={{ sm: 1, md: 2 }}
            className="items-center"
          >
            {/* Left: Text */}
            <div className="space-y-8 lg:space-y-10">
              <H2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Our Identity
                <br />
                <span style={{ color: colorScheme.primary }}>
                  The Wave of Greatness
                </span>
              </H2>
              <div
                className="space-y-6 text-lg lg:text-xl leading-relaxed"
                style={{ color: colorScheme.text }}
              >
                <p>
                  We are not just a church — we are a{' '}
                  <strong>Wisdom House</strong>. A place where greatness is
                  cultivated, excellence is pursued, and dominion is exercised.
                </p>
                <p
                  className="font-semibold text-xl lg:text-2xl"
                  style={{ color: colorScheme.heading }}
                >
                  Our DNA is greatness. Our culture is wisdom. Our calling is to
                  manifest the fullness of Christ in every sphere of life.
                </p>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl -z-10 scale-125" />
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden ring-8 ring-primary/10 shadow-2xl">
                  <Image
                    src={WisdomeHouseLogo}
                    alt="Wave of Greatness"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <H3
                className="mt-10 text-3xl lg:text-4xl font-bold"
                style={{ color: colorScheme.primaryDark }}
              >
                Wave of Greatness
              </H3>
            </div>
          </GridboxLayout>
        </Container>
      </Section>

      {/* What It Means to Be a Member */}
      <Section className="relative overflow-hidden py-28 lg:py-40">
        {/* Background Slider */}
        <div className="absolute inset-0 -z-10">
          <div className="relative h-full w-full">
            <div
              className="absolute inset-0 animate-slide bg-cover bg-center"
              style={{ backgroundImage: "url('/images/membership-1.jpg')" }}
            />
            <div
              className="absolute inset-0 animate-slide bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/membership-2.jpg')",
                animationDelay: '10s',
              }}
            />
            <div
              className="absolute inset-0 animate-slide bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/membership-3.jpg')",
                animationDelay: '20s',
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>

        <Container size="xl" className="relative z-10 px-6 lg:px-8">
          <div className="text-center mb-20 lg:mb-28">
            <H1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white drop-shadow-2xl">
              What It Means to Be a Member
            </H1>
            <LightText className="text-xl lg:text-2xl text-white/90 mt-6 max-w-4xl mx-auto">
              Embracing our identity and living out our purpose
            </LightText>
          </div>

          <GridboxLayout columns={2} gap="md" responsive={{ sm: 1, md: 2 }}>
            {/* Left Column */}
            <div className="space-y-4">
              {[
                {
                  icon: Banner_1.src,
                  title: "Embrace God's Sovereignty",
                  desc: "To embrace God's sovereignty and grace in every aspect of life",
                },
                {
                  icon: Banner_1.src,
                  title: 'Spirit-Filled Living',
                  desc: 'To be Spirit-filled, Spirit-yielded, and Spirit-deep in our walk with God',
                },
                {
                  icon: '/images/icons/lightning-icon.png',
                  title: 'Bold Representation',
                  desc: 'To represent Christ boldly in every sphere of influence',
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="relative rounded-xl p-4 shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 overflow-hidden group min-h-[120px]"
                  style={{
                    borderColor: colorScheme.primary,
                    // For the first item, use Banner_1 as full background
                    ...(index === 0 && {
                      backgroundImage: `url(${item.icon})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }),
                  }}
                >
                  {/* Dark overlay for better text readability on Banner_1 */}
                  {index === 0 && (
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
                  )}

                  {/* Content */}
                  <div className="relative z-10 h-full">
                    <div className="flex gap-4 items-start h-full">
                      {/* Show small icon for non-Banner_1 items */}
                      {index !== 0 && (
                        <div className="flex-shrink-0">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-sm"
                            style={{
                              backgroundColor: `${colorScheme.primary}20`,
                            }}
                          >
                            <Image
                              src={item.icon}
                              alt={item.title}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain"
                            />
                          </div>
                        </div>
                      )}
                      <div
                        className={`flex-1 ${index === 0 ? 'text-white' : ''}`}
                      >
                        <H3
                          className={`text-lg font-bold mb-1 ${index === 0 ? 'text-white' : ''}`}
                          style={
                            index !== 0 ? { color: colorScheme.heading } : {}
                          }
                        >
                          {item.title}
                        </H3>
                        <p
                          className={`text-sm leading-relaxed ${index === 0 ? 'text-white/90' : ''}`}
                          style={index !== 0 ? { color: colorScheme.body } : {}}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {[
                {
                  icon: '/images/icons/star-icon.png',
                  title: 'Pursue Excellence',
                  desc: 'To pursue excellence and productivity in all endeavors',
                },
                {
                  icon: '/images/icons/heart-icon.png',
                  title: 'Live in Love & Righteousness',
                  desc: 'To live in love, righteousness, and generosity toward others',
                },
                {
                  icon: '/images/icons/cross-icon.png',
                  title: 'Uphold Holiness',
                  desc: 'To reject compromise while upholding holiness in daily life',
                },
              ].map(item => (
                <div
                  key={item.title}
                  className="relative rounded-xl p-4 shadow-lg border-l-4 border-secondary hover:shadow-xl transition-all duration-300 overflow-hidden group min-h-[120px]"
                >
                  {/* Content */}
                  <div className="relative z-10 h-full">
                    <div className="flex gap-4 items-start h-full">
                      <div className="flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-sm"
                          style={{
                            backgroundColor: `${colorScheme.secondary}20`,
                          }}
                        >
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <H3
                          className="text-lg font-bold mb-1"
                          style={{ color: colorScheme.heading }}
                        >
                          {item.title}
                        </H3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: colorScheme.body }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GridboxLayout>

          {/* Closing */}
          <div className="mt-24 text-center">
            <div className="inline-block p-12 lg:p-16 rounded-3xl shadow-2xl bg-gradient-to-r from-primary to-secondary">
              <LightText className="text-2xl lg:text-4xl font-medium text-white">
                This is what it means to be part of{' '}
                <span className="font-black">The Wisdom House</span> —<br />a
                community where God’s wisdom transforms ordinary lives into
                extraordinary testimonies of His glory.
              </LightText>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section
        className="py-28 lg:py-36"
        style={{ backgroundColor: colorScheme.text }}
      >
        <Container size="xl" className="text-center px-6 lg:px-8">
          <H1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8"
            style={{ color: colorScheme.black }}
          >
            Join Our Family
          </H1>
          <LightText className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Ready to become part of this trans-generational movement of
            greatness?
          </LightText>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <CustomButton
              variant="secondary"
              size="lg"
              curvature="full"
              elevated
              className="px-12 py-6 text-lg font-bold"
            >
              Plan Your First Visit
            </CustomButton>
            <CustomButton
              variant="outline"
              size="lg"
              curvature="full"
              elevated
              rightIcon={<ArrowRight className="w-5 h-5 ml-3" />}
              className="px-12 py-6 text-lg font-bold border-2 border-white text-white hover:bg-white hover:text-black"
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
