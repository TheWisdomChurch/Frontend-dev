// app/page.tsx

'use client';

import { H1, H2, H3, P, BoldText } from '../../components/text';
import { Button } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';

export default function Home() {
  const { colorScheme, isDark, toggleTheme } = useTheme();

  return (
    <div
      className="p-8 max-w-4xl mx-auto"
      style={{ backgroundColor: colorScheme.background, minHeight: '100vh' }}
    >
      {/* Theme Toggle Section */}
      <div
        className="flex justify-between items-center mb-8 p-6 rounded-2xl"
        style={{
          backgroundColor: colorScheme.primary,
          color: colorScheme.white,
        }}
      >
        <BoldText>Current Theme: {isDark ? 'Dark' : 'Light'}</BoldText>
        <Button
          onClick={toggleTheme}
          variant="accent-yellow"
          size="lg"
          curvature="xl"
          elevated
        >
          Switch to {isDark ? 'Light' : 'Dark'} Mode test
        </Button>
        <p> this is a button</p>
      </div>

      {/* Color Palette Display */}
      <div className="mb-8">
        <H2 useThemeColor>Color Palette - Yellow, Black, Grays & Orange</H2>

        {/* Primary Colors */}
        <H3 useThemeColor className="mt-6">
          Primary Colors
        </H3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: colorScheme.black,
              color: colorScheme.white,
            }}
          >
            <span className="font-bold">Black</span>
            <br />
            <span className="text-xs">{colorScheme.black}</span>
          </div>
          <div
            className="p-4 rounded-2xl text-center border"
            style={{
              backgroundColor: colorScheme.white,
              color: colorScheme.black,
            }}
          >
            <span className="font-bold">White</span>
            <br />
            <span className="text-xs">{colorScheme.white}</span>
          </div>
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: colorScheme.primary,
              color: colorScheme.white,
            }}
          >
            <span className="font-bold">Primary</span>
            <br />
            <span className="text-xs">{colorScheme.primary}</span>
          </div>
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: colorScheme.primaryLight,
              color: colorScheme.white,
            }}
          >
            <span className="font-bold">Primary Light</span>
            <br />
            <span className="text-xs">{colorScheme.primaryLight}</span>
          </div>
        </div>

        {/* Yellow Colors */}
        <H3 useThemeColor className="mt-6">
          Yellow Colors
        </H3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: colorScheme.yellow,
              color: colorScheme.black,
            }}
          >
            <span className="font-bold">Yellow</span>
            <br />
            <span className="text-xs">{colorScheme.yellow}</span>
          </div>
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: colorScheme.yellowLight,
              color: colorScheme.black,
            }}
          >
            <span className="font-bold">Yellow Light</span>
            <br />
            <span className="text-xs">{colorScheme.yellowLight}</span>
          </div>
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: colorScheme.yellowDark,
              color: colorScheme.black,
            }}
          >
            <span className="font-bold">Yellow Dark</span>
            <br />
            <span className="text-xs">{colorScheme.yellowDark}</span>
          </div>
        </div>

        {/* Orange Colors */}
        <H3 useThemeColor className="mt-6">
          Orange Colors
        </H3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: colorScheme.orange,
              color: colorScheme.black,
            }}
          >
            <span className="font-bold">Orange</span>
            <br />
            <span className="text-xs">{colorScheme.orange}</span>
          </div>
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: colorScheme.orangeLight,
              color: colorScheme.black,
            }}
          >
            <span className="font-bold">Orange Light</span>
            <br />
            <span className="text-xs">{colorScheme.orangeLight}</span>
          </div>
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: colorScheme.orangeDark,
              color: colorScheme.black,
            }}
          >
            <span className="font-bold">Orange Dark</span>
            <br />
            <span className="text-xs">{colorScheme.orangeDark}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <H1 useThemeColor>Welcome to Wisdom House</H1>

      <H2 useThemeColor>Your Learning Journey Starts Here</H2>

      <P useThemeColor>
        This is a regular paragraph with{' '}
        <BoldText useThemeColor>bold text</BoldText> inside it. The color scheme
        uses yellow, black, light grays, and orange throughout.
      </P>

      {/* ✅ Enhanced Button Showcase */}
      <div
        className="my-6 p-6 rounded-2xl"
        style={{ backgroundColor: colorScheme.surface }}
      >
        <H3 useThemeColor>Interactive Elements</H3>

        {/* Primary Buttons */}
        <div className="mb-6">
          <H3 useThemeColor className="text-sm font-semibold mb-4">
            Primary Buttons
          </H3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" size="lg" curvature="xl" elevated>
              Get Started
            </Button>
            <Button variant="primary" size="md" curvature="lg">
              Learn More
            </Button>
            <Button variant="primary" size="sm" curvature="md">
              Explore
            </Button>
          </div>
        </div>

        {/* Accent Buttons */}
        <div className="mb-6">
          <H3 useThemeColor className="text-sm font-semibold mb-4">
            Accent Buttons
          </H3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="accent-yellow" size="lg" curvature="xl" elevated>
              Premium Feature
            </Button>
            <Button variant="accent-orange" size="md" curvature="lg">
              Hot Deal
            </Button>
            <Button variant="success" size="sm" curvature="md">
              Success
            </Button>
          </div>
        </div>

        {/* Outline & Ghost Buttons */}
        <div className="mb-6">
          <H3 useThemeColor className="text-sm font-semibold mb-4">
            Secondary Buttons
          </H3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="outline" size="md" curvature="lg">
              Outline Button
            </Button>
            <Button variant="ghost" size="md" curvature="lg">
              Ghost Button
            </Button>
            <Button variant="secondary" size="md" curvature="lg">
              Secondary
            </Button>
          </div>
        </div>

        {/* Special Effects */}
        <div className="mb-6">
          <H3 useThemeColor className="text-sm font-semibold mb-4">
            Special Styles
          </H3>
          <div className="flex gap-4 flex-wrap">
            <Button variant="accent-yellow" curvature="full" size="lg">
              Rounded
            </Button>
            <Button variant="primary" elevated curvature="xl">
              Elevated
            </Button>
            <Button variant="outline" curvature="xl" fullWidth>
              Full Width
            </Button>
          </div>
        </div>

        {/* With Icons */}
        <div>
          <H3 useThemeColor className="text-sm font-semibold mb-4">
            With Icons
          </H3>
          <div className="flex gap-4 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              curvature="xl"
              leftIcon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              }
            >
              Add New
            </Button>
            <Button
              variant="accent-yellow"
              size="md"
              curvature="lg"
              rightIcon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              }
            >
              Continue
            </Button>
            <Button variant="outline" size="sm" curvature="md" loading={true}>
              Loading...
            </Button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: colorScheme.surface,
            borderColor: colorScheme.border,
          }}
        >
          <H3 useThemeColor>Surface Card</H3>
          <P useThemeColor>This card uses the surface color with border.</P>
          <div className="mt-4">
            <Button variant="primary" size="sm" curvature="lg">
              Action
            </Button>
          </div>
        </div>

        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: colorScheme.yellow,
            color: colorScheme.black,
          }}
        >
          <H3>Yellow Card</H3>
          <P>This card uses the yellow accent color.</P>
          <div className="mt-4">
            <Button variant="primary" size="sm" curvature="lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Text Variations */}
      <div
        className="my-6 p-6 rounded-2xl"
        style={{ backgroundColor: colorScheme.gray100 }}
      >
        <H3 useThemeColor>Text Color Variations</H3>
        <P useThemeColor>Primary text color</P>
        <P style={{ color: colorScheme.textSecondary }}>Secondary text color</P>
        <P style={{ color: colorScheme.textMuted }}>Muted text color</P>
        <P style={{ color: colorScheme.yellow }}>Yellow text color</P>
        <P style={{ color: colorScheme.orange }}>Orange text color</P>

        <div className="mt-4">
          <Button variant="outline" size="sm" curvature="md">
            Learn More
          </Button>
        </div>
      </div>

      {/* Call to Action Section */}
      <div
        className="my-8 p-8 rounded-3xl text-center"
        style={{
          backgroundColor: colorScheme.primary,
          color: colorScheme.white,
        }}
      >
        <H2 style={{ color: colorScheme.white }}>
          Ready to Begin Your Journey?
        </H2>
        <P style={{ color: colorScheme.white }} className="mb-6">
          Join thousands of learners who have transformed their skills with
          Wisdom House.
        </P>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button variant="accent-yellow" size="xl" curvature="xl" elevated>
            Start Learning Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            curvature="xl"
            style={{ color: colorScheme.white, borderColor: colorScheme.white }}
          >
            View Courses
          </Button>
        </div>
      </div>
    </div>
  );
}
