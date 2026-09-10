import { asciiMetaDeep } from '@/lib/seo';

// Server-safe JSON-LD renderer — no 'use client' needed, works in both
// server and client components since it only emits a <script> tag.
// Every string is folded to ASCII first (see `asciiMeta`) so structured-data
// text can't be mangled by tools that ignore the page charset.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(asciiMetaDeep(data)),
      }}
    />
  );
}
