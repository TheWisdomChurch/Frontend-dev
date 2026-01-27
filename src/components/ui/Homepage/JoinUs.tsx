// components/ui/Homepage/JoinUs.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Users,
  Video,
  Music,
  Baby,
  Cpu,
  Users2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Section, Container } from '@/components/layout';
import CustomButton from '@/components/utils/buttons/CustomButton';
import { useTheme } from '@/components/contexts/ThemeContext';
import { H2, BodySM, SmallText, Caption } from '@/components/text';
import { Workforce_bg } from '@/components/assets';

const departments = [
  {
    title: 'Ushers & Protocol',
    from: '#f59e0b',
    to: '#f97316',
    icon: Users,
    description: 'First touch hospitality and service flow.',
  },
  {
    title: 'Media & Broadcast',
    from: '#3b82f6',
    to: '#06b6d4',
    icon: Video,
    description: 'Storytelling through cameras, lights, and sound.',
  },
  {
    title: 'Wave City Music',
    from: '#f43f5e',
    to: '#ec4899',
    icon: Music,
    description: 'Lead worship and craft the atmosphere.',
  },
  {
    title: 'Children Ministry',
    from: '#10b981',
    to: '#14b8a6',
    icon: Baby,
    description: 'Shepherd the next generation.',
  },
  {
    title: 'Youth & Campus',
    from: '#6366f1',
    to: '#a855f7',
    icon: Users2,
    description: 'Mentor teens and young adults.',
  },
  {
    title: 'Technical Team',
    from: '#475569',
    to: '#0f172a',
    icon: Cpu,
    description: 'Keep every service running smoothly.',
  },
];

export default function JoinWisdomHouse() {
  const { colorScheme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', team: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2400);
  };

  return (
    <Section
      id="join"
      padding="xl"
      background="custom"
      className="relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(185deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.94) 50%, rgba(0,0,0,0.96) 100%), url(${Workforce_bg.src})`,
        backgroundSize: 'cover, cover',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'center center, center center',
        backgroundBlendMode: 'overlay',
        backgroundColor: '#050505',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/75 to-black/85 pointer-events-none" />
      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white text-xs uppercase tracking-[0.18em]">
              <Sparkles className="w-3.5 h-3.5" />
              Serve with us
            </div>
            <H2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Join our <span style={{ color: colorScheme.primary }}>workforce</span> & move the house forward.
            </H2>
            <BodySM className="text-white/75 max-w-2xl">
              Every service is a team story—hospitality, music, media, prayer, and tech.
              Pick a lane, get trained, and serve with joy.
            </BodySM>
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: colorScheme.primary }} />
                6 active departments
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: colorScheme.primary }} />
                New members onboard monthly
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-4"
          >
            <SmallText className="text-white/80">Quick signup</SmallText>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm text-white/80 space-y-1">
                Full Name
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm text-white/80 space-y-1">
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
                />
              </label>
            </div>
            <label className="text-sm text-white/80 space-y-1">
              Preferred Team
              <select
                required
                value={form.team}
                onChange={e => setForm({ ...form, team: e.target.value })}
                className="w-full rounded-xl bg-black/40 border border-white/20 text-white px-3 py-2 outline-none focus:border-primary"
              >
                <option value="">Select a team</option>
                {departments.map(dept => (
                  <option key={dept.title} value={dept.title}>
                    {dept.title}
                  </option>
                ))}
              </select>
            </label>
            <CustomButton
              type="submit"
              variant="primary"
              size="md"
              curvature="xl"
              elevated
              className="w-full"
            >
              {submitted ? 'We will reach out!' : 'Join the workforce'}
            </CustomButton>
            <Caption className="text-white/60">
              We respond within 24 hours. Training happens weekly after service.
            </Caption>
          </form>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex flex-col gap-3 shadow-xl transition-transform duration-300 hover:-translate-y-1"
                style={{ boxShadow: `0 10px 30px ${colorScheme.opacity.primary10}` }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white relative"
                  style={{
                    background: `linear-gradient(135deg, ${dept.from} 0%, ${dept.to} 100%)`,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="relative z-10 space-y-1">
                  <SmallText weight="bold" className="text-white">
                    {dept.title}
                  </SmallText>
                  <Caption className="text-white/70">{dept.description}</Caption>
                </div>
                <div className="relative z-10 flex items-center justify-between pt-2">
                  <Caption className="text-white/60">Tap to choose above</Caption>
                  <ArrowRight className="w-4 h-4 text-white/70" />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
