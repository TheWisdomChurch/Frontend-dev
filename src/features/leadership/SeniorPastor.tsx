'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Bishop } from '@/shared/assets';
import { seniorPastorData } from '@/lib/data';
import { Section } from '@/shared/layout';
import { IMAGE_QUALITY } from '@/shared/constants';

const IgIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YtIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0d0a06" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/gabrielayilara?igsh=MXZpMHhnNGloMnViZw==',
    Icon: IgIcon,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/wisdomhousehq',
    Icon: FbIcon,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@wisdomchurchhq',
    Icon: YtIcon,
  },
  { label: 'X', href: 'https://x.com/wisdomchurchhq', Icon: XIcon },
];

const BIO_PREVIEW_LENGTH = 220;

export default function SeniorPastor() {
  const [bioExpanded, setBioExpanded] = useState(false);

  const bio = useMemo(
    () =>
      (seniorPastorData?.description ?? [])
        .slice(0, 1)
        .map(s => s.replace(/\s+/g, ' ').trim())
        .join(' ') ||
      "Bishop Gabriel Ayilara is the Senior Pastor of The Wisdom Church. Over the years, he has faithfully discipled and mentored countless individuals, demonstrating the practical workings of God's Word in everyday life. He is lawfully wedded to Pastor Kenny Ayilara, and together they are blessed with godly children. Through their exemplary marriage and ministry, they continue to inspire, equip, and impact lives for the Kingdom of God. His vision for The Wisdom Church is to create a place where everyone can encounter God's transformative love and discover their unique purpose.",
    []
  );

  const canExpand = bio.length > BIO_PREVIEW_LENGTH;

  return (
    <Section
      padding="none"
      fullHeight={false}
      className="relative w-full overflow-hidden bg-[var(--app-dark)]"
    >
      {/* Two-column grid — fixed: removed inline style that broke mobile */}
      <div className="grid min-h-[580px] grid-cols-1 lg:grid-cols-2 lg:min-h-[700px]">
        {/* ── Left — cinematic full-height portrait ────────── */}
        <div className="relative order-1 aspect-[25/14] max-h-[520px] overflow-hidden lg:order-none lg:aspect-auto lg:h-auto lg:max-h-none">
          <Image
            src={Bishop}
            alt="Bishop Gabriel Ayilara — Senior Pastor, The Wisdom Church"
            fill
            priority={false}
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={IMAGE_QUALITY}
            className="object-cover object-top"
          />
          {/* Mobile bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--app-dark)] to-transparent lg:hidden" />
          {/* Desktop right-edge blend */}
          <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-r from-transparent to-[var(--app-dark)] lg:block" />
        </div>

        {/* ── Right — editorial content ──────────────────── */}
        <div className="order-2 flex flex-col justify-center px-6 py-12 sm:px-10 lg:order-none lg:px-12 xl:px-16">
          {/* Eyebrow */}
          <p className="mb-6 font-ui text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
            Senior Pastor
          </p>

          {/* Name */}
          <h2
            className="font-headline font-normal text-white"
            // eslint-disable-next-line no-restricted-syntax
            style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', lineHeight: 1.1 }}
          >
            Bishop Gabriel
            <br />
            Ayilara
          </h2>

          {/* Pull quote */}
          <blockquote
            className="relative mt-8 pl-5"
            // eslint-disable-next-line no-restricted-syntax
            style={{ borderLeft: '2px solid var(--app-primary)' }}
          >
            <p
              className="font-headline font-normal italic text-white/78"
              // eslint-disable-next-line no-restricted-syntax
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
                lineHeight: 1.6,
              }}
            >
              &ldquo;You are not just a member —
              <br className="hidden sm:block" />
              you are a carrier of God&rsquo;s glory.&rdquo;
            </p>
          </blockquote>

          {/* Bio — accordion on mobile */}
          <div className="mt-7 max-w-[420px]">
            <div
              className={`overflow-hidden transition-all duration-400 ease-in-out lg:max-h-none ${
                bioExpanded ? 'max-h-[600px]' : 'max-h-[5.5rem]'
              }`}
            >
              <p className="font-ui text-[0.92rem] leading-[1.9] text-white/70">
                {bio}
              </p>
            </div>

            {canExpand && (
              <button
                type="button"
                onClick={() => setBioExpanded(p => !p)}
                className="mt-3 inline-flex items-center gap-1.5 font-ui text-[0.78rem] font-semibold text-[var(--app-primary)] transition hover:text-[var(--app-primary-light)] lg:hidden"
              >
                {bioExpanded ? 'Read less' : 'Read more'}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${bioExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>

          {/* Links row */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/leadership"
              className="group inline-flex items-center gap-1.5 font-ui text-[0.8rem] font-semibold text-[var(--app-primary)] transition"
            >
              Meet the team
              <span
                className="transition duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/[0.04] text-white/40 transition hover:border-white/22 hover:text-white/75"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
