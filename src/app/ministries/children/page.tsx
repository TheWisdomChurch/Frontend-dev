import HeroSection from '@/components/ui/Homepage/Herosection';
import { H2, BaseText, LightText } from '@/components/text';
import { hero_bg_1 } from '@/components/assets';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  Section,
  Container,
  GridboxLayout,
  FlexboxLayout,
} from '@/components/layout';

const ChildrenPage = () => {
  const { colorScheme } = useTheme();

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const sectionBackground = isDarkMode ? colorScheme.black : colorScheme.white;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const cardTextColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const accentBackground = isDarkMode
    ? colorScheme.opacity.primary20
    : colorScheme.opacity.primary10;
  const borderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.primary + '40';

  return (
    <div>
      <HeroSection
        title="Children Ministry"
        subtitle="Nurturing Young Hearts in Faith"
        description="A safe and engaging environment where children discover God's love through fun activities, Bible stories, and age-appropriate teachings."
        backgroundImage={hero_bg_1.src}
        showButtons={true}
        primaryButtonText="Register Your Child"
        secondaryButtonText="Volunteer With Us"
        showScrollIndicator={true}
      />

      {/* Ministry Details */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{ backgroundColor: sectionBackground }}
      >
        <Container size="xl">
          <div className="max-w-6xl mx-auto">
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="text-center mb-12"
            >
              <H2 style={{ color: textColor }}>
                Welcome to Our Children's Ministry!
              </H2>
              <LightText
                className="text-xl mt-4"
                style={{ color: secondaryTextColor }}
              >
                Where kids learn about Jesus in a way they can understand and
                enjoy
              </LightText>
            </FlexboxLayout>

            <GridboxLayout
              columns={1}
              responsive={{ md: 2 }}
              gap="lg"
              className="items-center"
            >
              <div>
                <BaseText
                  fontFamily="bricolage"
                  weight="bold"
                  className="text-2xl mb-6"
                  style={{ color: textColor }}
                >
                  Our Mission
                </BaseText>
                <LightText
                  className="mb-6 text-lg leading-relaxed"
                  style={{ color: secondaryTextColor }}
                >
                  To partner with parents in laying a spiritual foundation that,
                  in God's timing, will lead a child into a personal
                  relationship with Jesus Christ.
                </LightText>
                <LightText
                  className="text-lg leading-relaxed"
                  style={{ color: secondaryTextColor }}
                >
                  We create engaging, age-appropriate environments where
                  children can learn biblical truths and discover how much God
                  loves them.
                </LightText>
              </div>

              <div
                className="rounded-2xl p-8"
                style={{
                  backgroundColor: accentBackground,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <BaseText
                  fontFamily="bricolage"
                  weight="bold"
                  className="text-2xl mb-6"
                  style={{ color: textColor }}
                >
                  Service Times
                </BaseText>
                <div className="space-y-4">
                  <FlexboxLayout
                    justify="between"
                    align="center"
                    className="pb-4 border-b"
                    style={{ borderColor: borderColor }}
                  >
                    <BaseText weight="semibold" style={{ color: textColor }}>
                      Sunday School
                    </BaseText>
                    <BaseText
                      weight="bold"
                      style={{ color: colorScheme.primary }}
                    >
                      10:30 AM
                    </BaseText>
                  </FlexboxLayout>
                  <FlexboxLayout
                    justify="between"
                    align="center"
                    className="pb-4 border-b"
                    style={{ borderColor: borderColor }}
                  >
                    <BaseText weight="semibold" style={{ color: textColor }}>
                      Children's Church
                    </BaseText>
                    <BaseText
                      weight="bold"
                      style={{ color: colorScheme.primary }}
                    >
                      9:00 AM & 11:00 AM
                    </BaseText>
                  </FlexboxLayout>
                  <FlexboxLayout justify="between" align="center">
                    <BaseText weight="semibold" style={{ color: textColor }}>
                      Wednesday Nights
                    </BaseText>
                    <BaseText
                      weight="bold"
                      style={{ color: colorScheme.primary }}
                    >
                      7:00 PM
                    </BaseText>
                  </FlexboxLayout>
                </div>
              </div>
            </GridboxLayout>
          </div>
        </Container>
      </Section>

      {/* Age Groups */}
      <Section
        padding="lg"
        fullHeight={false}
        style={{
          backgroundColor: isDarkMode
            ? colorScheme.surface
            : colorScheme.backgroundSecondary,
        }}
      >
        <Container size="xl">
          <div className="max-w-6xl mx-auto">
            <H2 className="text-center mb-12" style={{ color: textColor }}>
              Programs by Age Group
            </H2>

            <GridboxLayout columns={1} responsive={{ md: 3 }} gap="lg">
              {[
                {
                  age: 'Ages 2-4',
                  title: 'Little Explorers',
                  description:
                    'Simple Bible stories, songs, and play-based learning in a safe, nurturing environment.',
                  activities: [
                    'Bible Stories',
                    'Worship Songs',
                    'Creative Play',
                  ],
                },
                {
                  age: 'Ages 5-7',
                  title: 'Bible Adventurers',
                  description:
                    'Interactive lessons, crafts, and games that make Bible learning fun and memorable.',
                  activities: [
                    'Interactive Lessons',
                    'Arts & Crafts',
                    'Memory Verses',
                  ],
                },
                {
                  age: 'Ages 8-12',
                  title: 'Faith Builders',
                  description:
                    'Deeper Bible study, service projects, and building friendships centered on Christ.',
                  activities: [
                    'Bible Studies',
                    'Service Projects',
                    'Group Activities',
                  ],
                },
              ].map((group, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 shadow-lg text-center"
                  style={{
                    backgroundColor: cardBackground,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      backgroundColor: colorScheme.primary,
                      color: colorScheme.black,
                    }}
                  >
                    <BaseText weight="bold" className="text-lg">
                      {group.age.split('-')[0]}
                    </BaseText>
                  </div>
                  <BaseText
                    fontFamily="bricolage"
                    weight="bold"
                    className="text-xl mb-2"
                    style={{ color: cardTextColor }}
                  >
                    {group.title}
                  </BaseText>
                  <LightText
                    className="mb-4"
                    style={{ color: secondaryTextColor }}
                  >
                    {group.description}
                  </LightText>
                  <ul className="text-sm space-y-1">
                    {group.activities.map((activity, i) => (
                      <li key={i} style={{ color: secondaryTextColor }}>
                        • {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </GridboxLayout>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default ChildrenPage;
