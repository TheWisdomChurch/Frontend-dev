import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import apiClient from '@/lib/api';
import { buildPageMetadata } from '@/lib/seo';

// forms/[slug]/page.tsx is a Client Component (interactive, multi-step form
// state) and can't export its own metadata — without this layout every form
// URL fell through to the root layout's generic title/description and
// self-canonicalized to "/". This fetches the real form server-side (same
// apiClient the page uses, safe to call from a Server Component — see
// resolveConfiguredApiOrigin) so each form gets its own title, description,
// and canonical.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const form = await apiClient.getPublicForm(slug).catch(() => null);

  const title = form?.title ? `${form.title} — Forms` : 'Forms';
  const rawDescription =
    form?.description ||
    `Fill out the "${form?.title ?? slug}" form for The Wisdom Church.`;
  // Cap at Google's ~155-char snippet limit — CMS-authored form
  // descriptions have no length constraint of their own.
  const description =
    rawDescription.length > 155
      ? `${rawDescription.slice(0, 154).trimEnd()}…`
      : rawDescription;

  return buildPageMetadata({
    title,
    description,
    path: `/forms/${slug}`,
  });
}

export default function FormLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
