// Server-safe JSON-LD renderer — no 'use client' needed, works in both
// server and client components since it only emits a <script> tag.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
