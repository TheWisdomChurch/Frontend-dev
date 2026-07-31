import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { canonicalUrl } from '@/lib/seo';

// order-confirmation/page.tsx is a Client Component and can't export its
// own `metadata` — without this it inherited the root layout's homepage
// canonical and indexable defaults. Contains order-specific query params
// and is per-session, so it's explicitly noindex — robots.ts also
// disallows /order-confirmation, this is defense-in-depth in case it's
// ever linked.
export const metadata: Metadata = {
  title: 'Order Confirmation',
  alternates: { canonical: canonicalUrl('/order-confirmation') },
  robots: { index: false, follow: true },
};

export default function OrderConfirmationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
