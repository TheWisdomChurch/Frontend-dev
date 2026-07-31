import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { canonicalUrl } from '@/lib/seo';

// checkout/page.tsx is a Client Component and can't export its own
// `metadata` — without this it inherited the root layout's homepage
// canonical and indexable defaults. This is a transactional, per-session
// page (cart contents), so it's explicitly noindex — robots.ts also
// disallows /checkout, this is defense-in-depth in case it's ever linked.
export const metadata: Metadata = {
  title: 'Checkout',
  alternates: { canonical: canonicalUrl('/checkout') },
  robots: { index: false, follow: true },
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
