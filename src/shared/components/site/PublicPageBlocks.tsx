'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Check } from 'lucide-react';

import { cn } from '@/lib/cn';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { Container, Section } from '@/shared/layout';
import { BodyMD, Caption, H2, H3 } from '@/shared/text';

export type StatItem = {
  label: string;
  value: string;
  detail?: string;
  icon?: LucideIcon;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon?: LucideIcon;
  href?: string;
  badge?: string;
};

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

interface StatStripProps {
  items: readonly StatItem[];
}

interface FeatureGridProps {
  items: readonly FeatureItem[];
  columns?: 2 | 3 | 4;
}

interface SplitSectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  points?: readonly string[];
  panelTitle?: string;
  panelBody?: string;
  panelItems?: readonly string[];
  children?: ReactNode;
}

interface ActionBannerProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'space-y-3',
        centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'
      )}
    >
      {eyebrow ? (
        <Caption className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
          {eyebrow}
        </Caption>
      ) : null}
      <H2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </H2>
      {description ? (
        <BodyMD className="text-base leading-relaxed text-white/68 sm:text-lg">
          {description}
        </BodyMD>
      ) : null}
    </div>
  );
}

export function StatStrip({ items }: StatStripProps) {
  const { colorScheme } = useTheme();

  return (
    <Section
      padding="md"
      className="relative overflow-hidden border-y border-white/10 bg-[#070708]"
    >
      <Container size="xl" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map(item => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-[1.4rem] border border-white/12 bg-white/[0.03] p-4 backdrop-blur"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/52">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                    {item.value}
                  </p>
                </div>
                {Icon ? (
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10"
                    style={{ backgroundColor: colorScheme.opacity.primary10 }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: colorScheme.primary }}
                    />
                  </div>
                ) : null}
              </div>
              {item.detail ? (
                <p className="text-sm leading-relaxed text-white/62">
                  {item.detail}
                </p>
              ) : null}
            </div>
          );
        })}
      </Container>
    </Section>
  );
}

function FeatureCard({
  item,
  interactive,
}: {
  item: FeatureItem;
  interactive: boolean;
}) {
  const { colorScheme } = useTheme();
  const Icon = item.icon;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        {Icon ? (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
            style={{ backgroundColor: colorScheme.opacity.primary10 }}
          >
            <Icon className="h-5 w-5" style={{ color: colorScheme.primary }} />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.04]" />
        )}
        {item.badge ? (
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/58">
            {item.badge}
          </span>
        ) : null}
      </div>

      <H3 className="text-xl font-semibold text-white">{item.title}</H3>
      <BodyMD className="mt-3 text-sm leading-relaxed text-white/65">
        {item.description}
      </BodyMD>

      {interactive ? (
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#d7bb75]">
          Explore this page
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      ) : null}
    </>
  );
}

export function FeatureGrid({ items, columns = 3 }: FeatureGridProps) {
  const gridClass =
    columns === 4
      ? 'md:grid-cols-2 xl:grid-cols-4'
      : columns === 2
        ? 'lg:grid-cols-2'
        : 'md:grid-cols-2 xl:grid-cols-3';

  return (
    <div className={cn('grid gap-4', gridClass)}>
      {items.map(item => {
        const classes = cn(
          'group rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 transition duration-300',
          item.href
            ? 'hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]'
            : ''
        );

        if (item.href) {
          return (
            <Link key={item.title} href={item.href} className={classes}>
              <FeatureCard item={item} interactive />
            </Link>
          );
        }

        return (
          <div key={item.title} className={classes}>
            <FeatureCard item={item} interactive={false} />
          </div>
        );
      })}
    </div>
  );
}

export function SplitSection({
  eyebrow,
  title,
  description,
  points = [],
  panelTitle,
  panelBody,
  panelItems = [],
  children,
}: SplitSectionProps) {
  const { colorScheme } = useTheme();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="space-y-5">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        {points.length ? (
          <div className="grid gap-3">
            {points.map(point => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <div
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: colorScheme.opacity.primary10 }}
                >
                  <Check
                    className="h-4 w-4"
                    style={{ color: colorScheme.primary }}
                  />
                </div>
                <p className="text-sm leading-relaxed text-white/70">{point}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(0,0,0,0.25))] p-6 sm:p-7"
        style={{ boxShadow: `0 24px 70px ${colorScheme.opacity.black50}` }}
      >
        {panelTitle ? (
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7bb75]">
            {panelTitle}
          </p>
        ) : null}
        {panelBody ? (
          <p className="mt-4 text-base leading-relaxed text-white/72">
            {panelBody}
          </p>
        ) : null}
        {panelItems.length ? (
          <div className="mt-6 grid gap-3">
            {panelItems.map(item => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72"
              >
                {item}
              </div>
            ))}
          </div>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}

export function ActionBanner({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: ActionBannerProps) {
  return (
    <Section padding="lg" className="bg-[#080808]">
      <Container size="xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(215,187,117,0.14),rgba(255,255,255,0.03),rgba(0,0,0,0.22))] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              {eyebrow ? (
                <Caption className="text-[0.66rem] uppercase tracking-[0.22em] text-[#d7bb75]">
                  {eyebrow}
                </Caption>
              ) : null}
              <H2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {title}
              </H2>
              <BodyMD className="text-base leading-relaxed text-white/70 sm:text-lg">
                {description}
              </BodyMD>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-full bg-[#d7bb75] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                {primaryLabel}
              </Link>
              {secondaryHref && secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
