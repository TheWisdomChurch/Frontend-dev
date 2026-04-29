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

import { Container, Section } from '@/shared/layout';
import { H2, BaseText, LightText } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';
import { useTheme } from '@/shared/contexts/ThemeContext';
import OrderConfirmation from '@/features/store/Store/orderDetails';
import PageHero from '@/features/hero/PageHero';

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
  const { colorScheme } = useTheme();

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
    <div className="min-h-screen bg-[#050505] text-white">
      <PageHero
        title="Order Confirmation"
        subtitle="Thank you for supporting the ministry."
        description="Your order is confirmed and a receipt has been sent to your email."
        compact
      />

      <Section
        padding="lg"
        fullHeight={false}
        className="relative overflow-hidden bg-[#050505]"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(247,222,18,0.14),transparent_34%),radial-gradient(circle_at_15%_30%,rgba(255,255,255,0.06),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
        </div>

        <Container size="xl" className="relative z-10">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="confirmation-animate border-b border-white/10 p-6 text-center sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                <div
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
                  style={{
                    backgroundColor: `${colorScheme.success}18`,
                    borderColor: `${colorScheme.success}30`,
                    color: colorScheme.success,
                  }}
                >
                  <CheckCircle2 className="h-12 w-12" />
                </div>

                <H2
                  className="mt-7 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
                  useThemeColor={false}
                >
                  Order Confirmed
                </H2>

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
                  <Link href="/resources/store">
                    <Button
                      variant="primary"
                      size="lg"
                      curvature="full"
                      leftIcon={<ShoppingBag className="h-5 w-5" />}
                      className="h-12 w-full px-6 font-bold sm:w-auto"
                      style={{
                        backgroundColor: colorScheme.primary,
                        color: colorScheme.black,
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button
                      variant="outline"
                      size="lg"
                      curvature="full"
                      leftIcon={<Home className="h-5 w-5" />}
                      className="h-12 w-full border px-6 font-bold text-white sm:w-auto"
                      style={{
                        borderColor: `${colorScheme.primary}88`,
                        color: colorScheme.primary,
                      }}
                    >
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="confirmation-animate mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-white/65">
                  <PackageCheck
                    className="h-3.5 w-3.5"
                    style={{ color: colorScheme.primary }}
                  />
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
                        className="confirmation-animate rounded-[1.35rem] border border-white/10 bg-black/24 p-4"
                        style={{ transitionDelay: `${index * 60}ms` }}
                      >
                        <div className="flex gap-4">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                            style={{
                              backgroundColor: `${colorScheme.primary}18`,
                              color: colorScheme.primary,
                            }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-semibold text-white">
                              {item.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-white/55">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="confirmation-animate mt-6 rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4">
                  <p className="text-sm leading-6 text-white/60">
                    Need help with your order? Contact the church/store team
                    from the contact page and include your order information.
                  </p>

                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold"
                    style={{ color: colorScheme.primary }}
                  >
                    Contact support
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const hasOrderDetails = searchParams.has('orderId');

  return hasOrderDetails ? <OrderConfirmation /> : <SimpleConfirmation />;
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<SimpleConfirmation />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
