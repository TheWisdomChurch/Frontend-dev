// C:\Users\Admin\Desktop\WisdomHouse\WisdomHouse-frontendDev\src\app\order-confirmation\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import {
  Container,
  Section,
  PageSection,
  FlexboxLayout,
  Gridbox,
} from '@/shared/layout';
import { H2, BaseText, LightText } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';
import { useTheme } from '@/shared/contexts/ThemeContext';
import OrderConfirmation from '@/shared/ui/Store/orderDetails';

// Simple confirmation page component
const SimpleConfirmation = () => {
  const { colorScheme } = useTheme();

  useEffect(() => {
    gsap.fromTo(
      '.confirmation-element',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Section padding="xl" fullHeight={false} className="bg-[#050505]">
        <Container size="xl">
          <FlexboxLayout
            direction="column"
            justify="center"
            align="center"
            gap="lg"
            className="text-center min-h-[60vh]"
          >
            <CheckCircle
              className="w-24 h-24 confirmation-element"
              style={{ color: colorScheme.success }}
            />

            <H2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight confirmation-element"
              style={{ color: colorScheme.text }}
            >
              Order Confirmed!
            </H2>

            <LightText
              className="text-xl confirmation-element"
              style={{ color: colorScheme.textSecondary }}
            >
              Thank you for your purchase
            </LightText>

            <BaseText
              className="confirmation-element max-w-md"
              style={{ color: colorScheme.textSecondary }}
            >
              Your order has been successfully processed. You will receive a
              confirmation email shortly with your order details and tracking
              information.
            </BaseText>

            <FlexboxLayout gap="md" className="confirmation-element mt-8">
              <Button
                variant="primary"
                size="lg"
                curvature="full"
                leftIcon={<ShoppingBag className="w-5 h-5" />}
                onClick={() => (window.location.href = '/resources/store')}
                style={{
                  background: colorScheme.primaryGradient,
                  color: colorScheme.onPrimary,
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.backgroundColor = colorScheme.primary;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.background =
                    colorScheme.primaryGradient;
                }}
              >
                Continue Shopping
              </Button>

              <Button
                variant="outline"
                size="lg"
                curvature="full"
                leftIcon={<Home className="w-5 h-5" />}
                onClick={() => (window.location.href = '/')}
                style={{
                  borderColor: colorScheme.primary,
                  color: colorScheme.primary,
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.backgroundColor =
                    colorScheme.opacity.primary10;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Back to Home
              </Button>
            </FlexboxLayout>
          </FlexboxLayout>
        </Container>
      </Section>
    </div>
  );
};

// Main Order Confirmation Page Component
const OrderConfirmationContent = () => {
  const searchParams = useSearchParams();

  // Check if we have order details in URL (coming from checkout)
  const hasOrderDetails = searchParams.has('orderId');

  return hasOrderDetails ? <OrderConfirmation /> : <SimpleConfirmation />;
};

const OrderConfirmationPage = () => {
  return (
    <Suspense fallback={<SimpleConfirmation />}>
      <OrderConfirmationContent />
    </Suspense>
  );
};

export default OrderConfirmationPage;
