'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { StaticImageData } from 'next/image';

import {
  Bishop,
  Associate_1,
  Associate_2,
  PstKenny_1,
  Deacon_1,
  Deacon_2,
} from '@/shared/assets';
import { Container, Section } from '@/shared/layout';
import { Media } from '@/shared/ui/Media';
import SectionGlow from '@/shared/ui/SectionGlow';
import { Eyebrow, H2, BodyMD } from '@/shared/text';
import {
  staggerContainer,
  staggerItem,
  staggerViewport,
} from '@/shared/ui/motion/staggerReveal';

interface ConversationEntry {
  name: string;
  role: string;
  image: StaticImageData;
  quote: string;
}

// Placeholder set using existing leadership photography — swap `image`,
// `name`, `role`, and `quote` per entry once real portraits + quotes are
// ready. The component/layout itself doesn't need to change.
const CONVERSATIONS: ConversationEntry[] = [
  {
    name: 'Bishop Gabriel Ayilara',
    role: 'Senior Pastor',
    image: Bishop,
    quote:
      'Every conversation here starts the same way — with someone being seen, not just served.',
  },
  {
    name: 'Pst. Mrs Kehinde Ayilara',
    role: 'Senior Pastor',
    image: PstKenny_1,
    quote:
      'We are not building a crowd. We are building people who carry the church wherever they go.',
  },
  {
    name: 'Pst. Bamidele',
    role: 'Associate Pastor',
    image: Associate_1,
    quote:
      'The best conversations happen after service — that is where real discipleship begins.',
  },
  {
    name: 'Rev. Victor Jimba',
    role: 'Associate Pastor',
    image: Associate_2,
    quote:
      'Come as you are. What God does with that is His business, not a performance for ours.',
  },
  {
    name: 'Deacon',
    role: 'Board of Deacons',
    image: Deacon_1,
    quote:
      'Service is just love with its sleeves rolled up. That is what you will find here.',
  },
  {
    name: 'Deaconess',
    role: 'Board of Deacons',
    image: Deacon_2,
    quote:
      'Nobody walks through those doors unnoticed. That has always been the standard.',
  },
];

export default function Conversations() {
  return (
    <Section
      padding="lg"
      fullHeight={false}
      className="relative overflow-hidden bg-[var(--app-dark)]"
    >
      <SectionGlow />

      <Container size="xl" className="relative">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <Eyebrow className="text-[var(--app-primary)]">Real voices</Eyebrow>
          <H2
            className="mt-3 font-headline font-normal text-white"
            // eslint-disable-next-line no-restricted-syntax
            style={{ fontSize: 'var(--type-display-sm)' }}
          >
            Conversations that shape us.
          </H2>
          <BodyMD className="mt-4 leading-[1.8] text-white/60">
            Hover a face to hear what they'd tell you over coffee — not a
            script, just what's true.
          </BodyMD>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={staggerViewport}
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5"
        >
          {CONVERSATIONS.map((person, index) => (
            <motion.div
              key={person.name}
              variants={staggerItem}
              className={index % 3 === 1 ? 'lg:translate-y-8' : undefined}
            >
              <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-white/5">
                <Media
                  src={person.image}
                  alt={person.name}
                  frameClassName="h-full w-full"
                  className="grayscale-[0.65] brightness-[0.85] transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:grayscale-0 group-hover:brightness-100"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
                />

                {/* Base scrim — always present so the name label stays readable */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-40" />

                {/* Name / role — default resting state */}
                <div className="absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 group-hover:opacity-0 sm:p-5">
                  <p className="font-ui text-body-sm font-bold text-white">
                    {person.name}
                  </p>
                  <p className="mt-0.5 font-ui text-label text-white/60">
                    {person.role}
                  </p>
                </div>

                {/* Quote — revealed on hover */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/92 via-black/55 to-black/10 p-4 opacity-0 transition-all duration-400 ease-out group-hover:opacity-100 sm:p-5">
                  <Quote
                    className="mb-2 h-4 w-4 -translate-y-1 text-[var(--app-primary)] opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <p className="translate-y-2 font-ui text-label leading-[1.6] text-white/92 opacity-0 transition-all delay-75 duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:text-body-sm">
                    “{person.quote}”
                  </p>
                  <p className="mt-3 translate-y-2 font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--app-primary)] opacity-0 transition-all delay-100 duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    {person.name} — {person.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
