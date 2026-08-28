// src/app/order-confirmation/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import {
  ArrowRight,
  CheckCircle2,
  Home,
  MailCheck,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

import { BodySM, BaseText, LightText } from '@/shared/text';
import OrderConfirmation from '@/features/store/Store/orderDetails';
import SiteHero from '@/features/hero/SiteHero';
import ReduxProvider from '@/shared/providers/ReduxProvider';
import {
  EditorialContainer,
  EditorialHeader,
  EditorialPanel,
  EditorialPage,
  EditorialSection,
} from '@/shared/ui/editorial';
import { buttonClass } from '@/shared/ui/button';

const nextSteps = [
  {
    title: 'Receipt sent',
    description: 'A confirmation email will be sent with your order details.',
    icon: MailCheck,
  },
  {
    title: 'Order processing',
    description: 'Your order will be reviewed and prepared by the store team.',
    icon: PackageCheck,
  },
  {
    title: 'Secure checkout',
    description: 'Your purchase details are handled through a protected flow.',
    icon: ShieldCheck,
  },
];

function SimpleConfirmation() {
  useEffect(() => {
    gsap.fromTo(
      '.confirmation-animate',
      { opacity: 0, y: 22, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <EditorialPage tone="dark">
      <SiteHero
        title="Order Confirmation"
        subtitle="Thank you for supporting the ministry."
        description="Your order is confirmed and a receipt has been sent to your email."
        compact
      />

      <EditorialSection tone="dark">
        <EditorialContainer>
          <EditorialPanel tone="dark" className="mx-auto max-w-5xl">
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="confirmation-animate border-b border-white/10 p-6 text-center sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-500">
                  <CheckCircle2 className="h-12 w-12" />
                </div>

                <EditorialHeader
                  eyebrow="Purchase complete"
                  title="Order confirmed."
                  tone="dark"
                  className="mt-7"
                />

                <LightText
                  className="mt-4 block text-base leading-7 text-white/62"
                  useThemeColor={false}
                >
                  Thank you for your purchase. Your order has been successfully
                  processed.
                </LightText>

                <BaseText
                  className="mx-auto mt-4 block max-w-md text-sm leading-7 text-white/52"
                  useThemeColor={false}
                >
                  You will receive a confirmation email shortly with your order
                  details and tracking information where applicable.
                </BaseText>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/resources/store"
                    className={`${buttonClass('primary')} w-full gap-2 sm:w-auto`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Continue Shopping
                  </Link>

                  <Link
                    href="/"
                    className={`${buttonClass('outline')} w-full gap-2 text-[var(--app-primary)] sm:w-auto`}
                  >
                    <Home className="h-5 w-5" />
                    Back to Home
                  </Link>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="confirmation-animate mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-white/65">
                  <PackageCheck className="h-3.5 w-3.5 text-[var(--app-primary)]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
                    What happens next
                  </span>
                </div>

                <div className="grid gap-3">
                  {nextSteps.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="confirmation-animate border-t border-white/12 p-4"
                        // eslint-disable-next-line no-restricted-syntax
                        style={{ transitionDelay: `${index * 60}ms` }}
                      >
                        <div className="flex gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary)]/[0.09] text-[var(--app-primary)]">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <BodySM weight="semibold" className="text-white">
                              {item.title}
                            </BodySM>
                            <BodySM className="mt-1 text-white/55">
                              {item.description}
                            </BodySM>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="confirmation-animate mt-6 border-t border-white/12 p-4">
                  <BodySM className="text-white/60">
                    Need help with your order? Contact the church/store team
                    from the contact page and include your order information.
                  </BodySM>

                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--app-primary)]"
                  >
                    Contact support
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </EditorialPanel>
        </EditorialContainer>
      </EditorialSection>
    </EditorialPage>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const hasOrderDetails = searchParams.has('orderId');

  return hasOrderDetails ? <OrderConfirmation /> : <SimpleConfirmation />;
}

export default function OrderConfirmationPage() {
  return (
    <ReduxProvider>
      <Suspense fallback={<SimpleConfirmation />}>
        <OrderConfirmationContent />
      </Suspense>
    </ReduxProvider>
  );
}
