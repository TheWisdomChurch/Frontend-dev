import { canonicalUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';

const title = `Resources | Sermons, Media & Store | ${SITE_NAME}`;
const description =
  'Access sermons, live broadcasts, publications, and church resources designed for spiritual growth.';
const canonical = canonicalUrl('/resources');

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
