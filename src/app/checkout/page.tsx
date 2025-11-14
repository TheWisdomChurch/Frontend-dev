'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/components/utils/hooks/redux';
import CheckoutForm from '@/components/ui/Store/checkoutForm';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { Section, Container, FlexboxLayout } from '@/components/layout';
import { H2, BaseText } from '@/components/text';

const CheckoutPage = () => {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/store');
    }
  }, [items, router]);

  useEffect(() => {
    gsap.fromTo(
      '.checkout-section',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
    );
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Section background="light" padding="xl" fullHeight={false}>
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            gap="lg"
            className="text-center mb-12 checkout-section"
          >
            <H2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Checkout
            </H2>
            <BaseText className="text-xl text-gray-600">
              Complete your order with confidence
            </BaseText>
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
