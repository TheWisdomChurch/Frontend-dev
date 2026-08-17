'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarDays,
  HeartHandshake,
  MapPin,
  Play,
  Users,
} from 'lucide-react';

import { SERVICE_INFO } from '@/shared/constants/serviceInfo';
import { Container, Section } from '@/shared/layout';
import PlanVisitTrigger from '@/features/hero/PlanVisitTrigger';
import TakeMeToChurchButton from '@/features/navigation/TakeMeToChurchButton';
import { HOME_NEXT_STEPS, HOME_SECONDARY_STEPS } from '@/features/home/journey';
import ShareChurchInvite from '@/features/home/ShareChurchInvite';

const stepIcons = {
  watch: Play,
  ministries: Users,
  connect: HeartHandshake,
} as const;

export default function HomeNextSteps() {
  return (
    <Section id="next-steps" padding="none" className="bg-[#0a0a0a] text-white">
      <Container size="2xl" className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="max-w-xl">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.22em] text-[var(--app-primary)]">
              Your next step
            </p>
            <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-5xl">
              There is a place for you here.
            </h2>
            <p className="mt-6 font-ui text-base leading-8 text-white/65 sm:text-lg">
              Whether you are visiting for the first time or ready to grow
              deeper, choose the step that feels right for you.
            </p>

            <div className="mt-8 border-y border-white/12 py-6 font-ui">
              <p className="flex items-center gap-3 font-semibold text-white">
                <CalendarDays className="h-5 w-5 text-[var(--app-primary)]" />
                {SERVICE_INFO.sunday.day} · {SERVICE_INFO.sunday.time}{' '}
                {SERVICE_INFO.sunday.timezone}
              </p>
              <p className="mt-3 flex items-start gap-3 text-sm leading-6 text-white/58">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--app-primary)]" />
                {SERVICE_INFO.venue.full}
              </p>
            </div>

            <div className="mt-8 grid gap-3 min-[430px]:grid-cols-2">
              <PlanVisitTrigger className="w-full">
                Plan your visit
              </PlanVisitTrigger>
              <TakeMeToChurchButton fullWidth />
            </div>
            <ShareChurchInvite />
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {HOME_NEXT_STEPS.map(({ title, description, href, icon }) => {
              const Icon = stepIcons[icon];
              return (
                <Link
                  key={href}
                  href={href}
                  className="group flex min-h-44 flex-col border border-white/12 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--app-primary)]/55 hover:bg-white/[0.06] lg:min-h-0 lg:flex-row lg:items-center lg:gap-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)] text-black">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="mt-6 min-w-0 lg:mt-0">
                    <strong className="block font-sans text-xl font-bold text-white">
                      {title}
                    </strong>
                    <span className="mt-2 block font-ui text-sm leading-6 text-white/55">
                      {description}
                    </span>
                  </span>
                  <ArrowUpRight className="mt-auto h-5 w-5 shrink-0 text-[var(--app-primary)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:mt-6 lg:ml-auto lg:mt-0" />
                </Link>
              );
            })}
            <nav
              aria-label="More ways to participate"
              className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5 sm:col-span-3 lg:col-span-1"
            >
              {HOME_SECONDARY_STEPS.map(step => (
                <Link
                  key={step.href}
                  href={step.href}
                  className="font-ui text-xs font-bold text-white/48 underline-offset-4 transition hover:text-[var(--app-primary)] hover:underline"
                >
                  {step.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </Section>
  );
}
