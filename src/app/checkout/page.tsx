'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ShoppingBag } from 'lucide-react';

import { useAppSelector } from '@/shared/utils/hooks/redux';
import CheckoutForm from '@/features/store/Store/checkoutForm';
import PageHero from '@/features/hero/PageHero';
import { Container, Section } from '@/shared/layout';

export default function CheckoutPage() {
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
      <main className="min-h-screen bg-[#050505] text-white">
        <PageHero
          title="Checkout"
          subtitle="Complete your order securely."
          description="Review your items and finalize your purchase."
          compact
        />

        <Section padding="xl" className="bg-[#050505]">
          <Container size="xl">
            <div className="checkout-section mx-auto flex min-h-[52vh] max-w-xl flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] px-5 py-12 text-center shadow-2xl shadow-black/30 sm:px-8">
              <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <ShoppingBag className="h-8 w-8 text-[#f7de12]" />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Your cart is empty
              </h1>

              <p className="mt-3 max-w-md text-sm leading-7 text-white/65 sm:text-base">
                Add some resources from the store before proceeding to checkout.
              </p>

              <button
                type="button"
                onClick={() => router.push('/resources/store')}
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#f7de12] px-6 text-sm font-extrabold text-black shadow-lg shadow-[#f7de12]/20 transition hover:-translate-y-0.5 hover:bg-[#ffe93d]"
              >
                Back to Store
              </button>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Checkout"
        subtitle="Complete your order securely."
        description="Review your items and finalize your purchase."
        compact
      />

      <Section padding="xl" className="bg-[#050505]">
        <Container size="xl">
          <div className="checkout-section mx-auto mb-8 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7de12]">
              Secure checkout
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Complete your order with confidence
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
              Confirm your details and complete your purchase securely.
            </p>
          </div>

          <div className="checkout-section rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 sm:rounded-[2rem] sm:p-6 lg:p-8">
            <CheckoutForm />
          </div>
        </Container>
      </Section>
    </main>
  );
}
