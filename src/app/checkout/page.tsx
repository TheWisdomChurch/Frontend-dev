'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/components/utils/hooks/redux';
import CheckoutForm from '@/components/ui/Store/checkoutForm';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { Section, Container, FlexboxLayout } from '@/components/layout';
import { H2, LightText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { ShoppingBag } from 'lucide-react';

const CheckoutPage = () => {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);
  const { colorScheme } = useTheme();

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const sectionBackground = isDarkMode ? colorScheme.black : colorScheme.white;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;

  useEffect(() => {
    gsap.fromTo(
      '.checkout-section',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
    );
  }, []);

  // If cart is empty, show empty cart message
  if (items.length === 0) {
    return (
      <div
        className="min-h-screen py-8"
        style={{ backgroundColor: sectionBackground }}
      >
        <Section
          padding="xl"
          fullHeight={false}
          style={{ backgroundColor: sectionBackground }}
        >
          <Container size="xl">
            <FlexboxLayout
              direction="column"
              justify="center"
              align="center"
              gap="md"
              className="text-center min-h-[60vh] checkout-section"
            >
              <ShoppingBag
                className="w-16 h-16 mb-4"
                style={{ color: secondaryTextColor }}
              />
              <H2
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                style={{ color: textColor }}
              >
                Your cart is empty
              </H2>
              <LightText
                className="text-xl mb-6"
                style={{ color: secondaryTextColor }}
              >
                Add some items to get started
              </LightText>
              <button
                onClick={() => router.push('/resources/store')}
                className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.black,
                }}
              >
                Back to Store
              </button>
            </FlexboxLayout>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: sectionBackground }}
    >
      <Section
        padding="xl"
        fullHeight={false}
        style={{ backgroundColor: sectionBackground }}
      >
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            gap="lg"
            className="text-center mb-12 checkout-section"
          >
            <H2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: textColor }}
            >
              Checkout
            </H2>
            <LightText
              className="text-xl"
              style={{ color: secondaryTextColor }}
            >
              Complete your order with confidence
            </LightText>
          </FlexboxLayout>

          <div className="checkout-section">
            <CheckoutForm />
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default CheckoutPage;
