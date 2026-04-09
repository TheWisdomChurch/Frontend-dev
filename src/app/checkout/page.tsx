'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/shared/utils/hooks/redux';
import CheckoutForm from '@/shared/ui/Store/checkoutForm';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { Container, Section, FlexboxLayout } from '@/shared/layout';
import { H2, LightText } from '@/shared/text';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { ShoppingBag } from 'lucide-react';

const CheckoutPage = () => {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);
  const { colorScheme } = useTheme();

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
      <div className="min-h-screen py-8 bg-[#050505] text-white">
        <Section padding="xl" fullHeight={false} className="bg-[#050505]">
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
                style={{ color: colorScheme.textSecondary }}
              />
              <H2
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                style={{ color: colorScheme.text }}
              >
                Your cart is empty
              </H2>
              <LightText
                className="text-xl mb-6"
                style={{ color: colorScheme.textSecondary }}
              >
                Add some items to get started
              </LightText>
              <button
                onClick={() => router.push('/resources/store')}
                className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                style={{
                  background: colorScheme.primaryGradient,
                  color: colorScheme.onPrimary,
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
    <div className="min-h-screen py-8 bg-[#050505] text-white">
      <Section padding="xl" fullHeight={false} className="bg-[#050505]">
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            gap="lg"
            className="text-center mb-12 checkout-section"
          >
            <H2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              style={{ color: colorScheme.text }}
            >
              Checkout
            </H2>
            <LightText
              className="text-xl"
              style={{ color: colorScheme.textSecondary }}
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
