'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ShoppingBag } from 'lucide-react';

import { useAppSelector } from '@/shared/utils/hooks/redux';
import CheckoutForm from '@/features/store/Store/checkoutForm';
import SiteHero from '@/features/hero/SiteHero';
import ReduxProvider from '@/shared/providers/ReduxProvider';
import {
  Container,
  SectionEmpty,
  SectionHeader,
  Page,
  Panel,
  Section,
} from '@/shared/ui/layout';

function CheckoutPageContent() {
  const router = useRouter();
  const { items } = useAppSelector(state => state.cart);

  useEffect(() => {
    gsap.fromTo(
      '.checkout-section',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power3.out' }
    );
  }, []);

  if (items.length === 0) {
    return (
      <Page tone="dark">
        <SiteHero
          title="Checkout"
          subtitle="Complete your order securely."
          description="Review your items and finalize your purchase."
          compact
        />

        <Section tone="dark">
          <Container>
            <SectionEmpty
              className="checkout-section mx-auto max-w-xl"
              title="Your cart is empty"
              description="Add some resources from the store before proceeding to checkout."
              tone="dark"
              action={
                <button
                  type="button"
                  onClick={() => router.push('/resources/store')}
                  className="inline-flex min-h-12 items-center justify-center rounded-button bg-[var(--app-primary)] px-7 font-ui text-label font-bold uppercase tracking-widest text-[var(--app-ink)]"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Back to store
                </button>
              }
            />
          </Container>
        </Section>
      </Page>
    );
  }

  return (
    <Page tone="dark">
      <SiteHero
        title="Checkout"
        subtitle="Complete your order securely."
        description="Review your items and finalize your purchase."
        compact
      />

      <Section tone="dark">
        <Container>
          <SectionHeader
            eyebrow="Secure checkout"
            title="Complete your order with confidence."
            description="Confirm your details and complete your purchase securely."
            tone="dark"
            className="checkout-section mx-auto mb-10 max-w-3xl text-center"
          />

          <Panel tone="dark" className="checkout-section p-4 sm:p-6 lg:p-8">
            <CheckoutForm />
          </Panel>
        </Container>
      </Section>
    </Page>
  );
}

export default function CheckoutPage() {
  return (
    <ReduxProvider>
      <CheckoutPageContent />
    </ReduxProvider>
  );
}
