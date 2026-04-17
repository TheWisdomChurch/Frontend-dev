import { canonicalUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';

const title = `Events & Programs | ${SITE_NAME}`;
const description =
  'Explore upcoming church events, weekly programs, and special gatherings at The Wisdom Church.';
const canonical = canonicalUrl('/events');

export default function Head() {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
    </>
  );
}
