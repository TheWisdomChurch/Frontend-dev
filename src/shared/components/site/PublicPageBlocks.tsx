import Link from 'next/link';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Check } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Container, Section } from '@/shared/layout';
import {
  BodyLG,
  BodyMD,
  BodySM,
  Caption,
  Eyebrow,
  H2,
  H3,
} from '@/shared/text';

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
  dark?: boolean;
}

interface StatStripProps {
  items: readonly StatItem[];
}

interface FeatureGridProps {
  items: readonly FeatureItem[];
  columns?: 2 | 3 | 4;
  dark?: boolean;
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
  dark?: boolean;
}

interface ActionBannerProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  primaryTargetBlank?: boolean;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryTargetBlank?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  dark = true,
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
        <Caption className="text-[0.66rem] uppercase tracking-[0.22em] text-[var(--app-primary)]">
          {eyebrow}
        </Caption>
      ) : null}
      <H2
        className={cn(
          'text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl',
          dark ? 'text-white' : 'text-[var(--app-ink)]'
        )}
      >
        {title}
      </H2>
      {description ? (
        <BodyMD
          className={cn(
            'text-base leading-relaxed sm:text-lg',
            dark ? 'text-white/68' : 'text-[var(--app-ink)]/65'
          )}
        >
          {description}
        </BodyMD>
      ) : null}
    </div>
  );
}

export function StatStrip({ items }: StatStripProps) {
  return (
    <Section
      padding="md"
      className="relative overflow-hidden border-y border-white/10 bg-[var(--app-dark-2)]"
    >
      <Container size="xl" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map(item => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-card border border-white/12 bg-white/[0.03] p-4 backdrop-blur"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <Eyebrow className="text-white/52">{item.label}</Eyebrow>
                  <BodyLG weight="semibold" className="mt-2 text-white">
                    {item.value}
                  </BodyLG>
                </div>
                {Icon ? (
                  <div className="flex h-11 w-11 items-center justify-center rounded-card border border-[var(--app-primary)]/20 bg-[var(--app-primary)]/[0.08]">
                    <Icon className="h-4 w-4 text-[var(--app-primary)]" />
                  </div>
                ) : null}
              </div>
              {item.detail ? (
                <BodySM className="text-white/62">{item.detail}</BodySM>
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
  dark = true,
}: {
  item: FeatureItem;
  interactive: boolean;
  dark?: boolean;
}) {
  const Icon = item.icon;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        {Icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-card border border-[var(--app-primary)]/20 bg-[var(--app-primary)]/[0.08]">
            <Icon className="h-5 w-5 text-[var(--app-primary)]" />
          </div>
        ) : (
          <div
            className={cn(
              'h-11 w-11 rounded-card border',
              dark
                ? 'border-white/10 bg-white/[0.04]'
                : 'border-[var(--app-ink)]/10 bg-[var(--app-ink)]/[0.03]'
            )}
          />
        )}
        {item.badge ? (
          <span
            className={cn(
              'rounded-badge border px-3 py-1 text-[11px] uppercase tracking-[0.14em]',
              dark
                ? 'border-white/10 bg-white/[0.03] text-white/58'
                : 'border-[var(--app-ink)]/10 bg-[var(--app-ink)]/[0.04] text-[var(--app-ink)]/55'
            )}
          >
            {item.badge}
          </span>
        ) : null}
      </div>

      <H3
        className={cn(
          'text-xl font-semibold',
          dark ? 'text-white' : 'text-[var(--app-ink)]'
        )}
      >
        {item.title}
      </H3>
      <BodyMD
        className={cn(
          'mt-3 text-sm leading-relaxed',
          dark ? 'text-white/65' : 'text-[var(--app-ink)]/62'
        )}
      >
        {item.description}
      </BodyMD>

      {interactive ? (
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--app-primary)]">
          Explore this page
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      ) : null}
    </>
  );
}

export function FeatureGrid({
  items,
  columns = 3,
  dark = true,
}: FeatureGridProps) {
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
          'group rounded-card border p-5 transition duration-300',
          dark
            ? 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]'
            : 'border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)]',
          item.href
            ? dark
              ? 'hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]'
              : 'hover:-translate-y-0.5 hover:border-[var(--app-primary)]/25 hover:bg-[var(--app-canvas)]'
            : ''
        );

        if (item.href) {
          return (
            <Link key={item.title} href={item.href} className={classes}>
              <FeatureCard item={item} interactive dark={dark} />
            </Link>
          );
        }

        return (
          <div key={item.title} className={classes}>
            <FeatureCard item={item} interactive={false} dark={dark} />
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
  dark = true,
}: SplitSectionProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="space-y-5">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          dark={dark}
        />
        {points.length ? (
          <div className="grid gap-3">
            {points.map(point => (
              <div
                key={point}
                className={cn(
                  'flex items-start gap-3 rounded-card border px-4 py-3',
                  dark
                    ? 'border-white/10 bg-white/[0.03]'
                    : 'border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)]'
                )}
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-button bg-[var(--app-primary)]/[0.10]">
                  <Check className="h-4 w-4 text-[var(--app-primary)]" />
                </div>
                <BodySM
                  className={
                    dark ? 'text-white/70' : 'text-[var(--app-ink)]/68'
                  }
                >
                  {point}
                </BodySM>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          'rounded-card border p-6 shadow-[0_24px_70px_rgba(0,0,0,0.12)] sm:p-7',
          dark
            ? 'border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(0,0,0,0.25))] shadow-[0_24px_70px_rgba(0,0,0,0.5)]'
            : 'border-[var(--app-ink)]/8 bg-[var(--app-canvas-2)]'
        )}
      >
        {panelTitle ? (
          <Eyebrow className="text-[var(--app-primary)]">{panelTitle}</Eyebrow>
        ) : null}
        {panelBody ? (
          <BodyMD
            className={cn(
              'mt-4',
              dark ? 'text-white/72' : 'text-[var(--app-ink)]/68'
            )}
          >
            {panelBody}
          </BodyMD>
        ) : null}
        {panelItems.length ? (
          <div className="mt-6 grid gap-3">
            {panelItems.map(item => (
              <div
                key={item}
                className={cn(
                  'rounded-card border px-4 py-3 text-sm',
                  dark
                    ? 'border-white/10 bg-black/20 text-white/72'
                    : 'border-[var(--app-ink)]/8 bg-white/60 text-[var(--app-ink)]/68'
                )}
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
  primaryTargetBlank = false,
  secondaryHref,
  secondaryLabel,
  secondaryTargetBlank = false,
}: ActionBannerProps) {
  return (
    <Section padding="lg" className="bg-[var(--app-dark-2)]">
      <Container size="xl">
        <div className="rounded-card border border-white/10 bg-[linear-gradient(135deg,rgba(201,150,26,0.10),rgba(255,255,255,0.03),rgba(0,0,0,0.20))] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              {eyebrow ? (
                <Caption className="text-[0.66rem] uppercase tracking-[0.22em] text-[var(--app-primary)]">
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
                target={primaryTargetBlank ? '_blank' : undefined}
                rel={primaryTargetBlank ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center rounded-button bg-[var(--app-primary)] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-105"
              >
                {primaryLabel}
              </Link>
              {secondaryHref && secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  target={secondaryTargetBlank ? '_blank' : undefined}
                  rel={secondaryTargetBlank ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center rounded-button border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
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
