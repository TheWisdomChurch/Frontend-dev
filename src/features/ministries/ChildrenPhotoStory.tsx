import Image from 'next/image';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';
import { Container, Section, eyebrowClass } from '@/shared/ui/layout';

/* ============================================================================
   CHILDREN'S MINISTRY — PHOTO STORY

   A four-chapter photo essay of one Sunday morning: the welcome at the door,
   the lesson in the classroom, the questions that follow, and the joy that
   runs through all of it — closed by a contact-sheet of the whole morning.

   Sizing discipline — every photograph is an overlay <StoryCard>. On desktop
   the cards are laid into a 12-column mosaic with fixed row heights, so a mix
   of portrait and landscape originals still tiles flush with no ragged edges.
   Below `lg` the mosaic collapses to two columns, then one, and the captions
   sit permanently on the image instead of revealing on hover.

   Motion (all opt-in, handled by GlobalScrollEffects, all reduced-motion safe):
   - `data-gsap="reveal"`        → staggered fade / rise as each block scrolls in
   - `data-parallax-global`      → slow vertical drift on the framed image
   - hover / focus (desktop)     → image scale + caption slide-up over a scrim
============================================================================ */

type Tone = 'light' | 'dark';

type StoryPhoto = {
  src: string;
  alt: string;
  caption: string;
  /** object-position for the crop inside the fixed frame. */
  position?: string;
};

/* ── Overlay photo card ───────────────────────────────────────────────── */

function StoryCard({
  photo,
  sizes,
  className,
  depth = 0.12,
  priority = false,
  tone = 'light',
}: {
  photo: StoryPhoto;
  sizes: string;
  className?: string;
  depth?: number;
  priority?: boolean;
  tone?: Tone;
}) {
  return (
    <figure
      tabIndex={0}
      data-gsap="reveal"
      className={cn(
        'group relative isolate flex min-h-[17rem] overflow-hidden rounded-image bg-[var(--app-surface-2)] outline-none ring-[var(--app-primary)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-offset-4 sm:min-h-[20rem]',
        tone === 'dark'
          ? 'focus-visible:ring-offset-[var(--app-dark)]'
          : 'focus-visible:ring-offset-[var(--app-canvas)]',
        className
      )}
    >
      <div
        data-parallax-global={depth}
        className="absolute inset-x-0 -inset-y-[6%]"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          quality={IMAGE_QUALITY}
          sizes={sizes}
          className={cn(
            'object-cover transition-transform duration-[900ms] ease-out will-change-transform motion-reduce:transition-none md:group-hover:scale-[1.045] md:group-focus:scale-[1.045]',
            photo.position ?? 'object-center'
          )}
        />
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 motion-reduce:transition-none md:from-black/80 md:opacity-0 md:group-hover:opacity-100 md:group-focus:opacity-100"
      />

      <figcaption className="relative z-10 mt-auto w-full p-5 transition-all duration-500 ease-out motion-reduce:transition-none sm:p-6 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus:translate-y-0 md:group-focus:opacity-100 lg:p-7">
        <p className="max-w-sm font-ui text-body-sm leading-relaxed text-white sm:text-body-md">
          {photo.caption}
        </p>
      </figcaption>
    </figure>
  );
}

/* ── Chapter marker ──────────────────────────────────────────────────── */

function ChapterHeader({
  index,
  kicker,
  title,
  lede,
  tone = 'light',
  className,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  lede?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      data-gsap="reveal"
      className={cn(tone === 'dark' && 'tone-dark', className)}
    >
      <div className="flex items-center gap-4 text-current">
        <span
          className={cn(
            'font-ui text-[2.1rem] font-semibold leading-none tracking-[-0.04em] sm:text-[2.75rem]',
            tone === 'dark'
              ? 'text-[var(--app-primary)]/45'
              : 'text-[var(--app-primary)]/30'
          )}
        >
          {index}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-current/15" />
        <span className={eyebrowClass}>{kicker}</span>
      </div>
      <h2 className="mt-5 text-balance font-ui text-heading-md font-semibold leading-[1.12] tracking-[-0.025em] text-current sm:text-heading-lg">
        {title}
      </h2>
      {lede ? (
        <p className="mt-4 max-w-[54ch] font-ui text-body-md leading-[1.7] text-[var(--app-muted)]">
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ── Photographs, grouped by chapter ─────────────────────────────────── */

const ARRIVAL: readonly StoryPhoto[] = [
  {
    src: '/Picflow/children-welcome-highfive.webp',
    alt: 'Two boys with backpacks sharing a high-five as they arrive for children’s church at The Wisdom Church',
    caption: 'The first hello — every child greeted by name at the door.',
    position: 'object-center',
  },
  {
    src: '/Picflow/children-arrival-banner.webp',
    alt: 'A boy with a backpack walking past the children’s ministry banner reading “Equipping and Empowering for Greatness”',
    caption: 'Signed in, and pointed the right way.',
    position: 'object-[center_25%]',
  },
  {
    src: '/Picflow/children-arrival-walk.webp',
    alt: 'A young boy carrying his bag into the children’s ministry space at The Wisdom Church',
    caption: 'Walking in on his own — settled, unhurried.',
    position: 'object-[center_20%]',
  },
];

const LESSON: readonly StoryPhoto[] = [
  {
    src: '/Picflow/children-lesson-armor-group.webp',
    alt: 'A group of children colouring “The Armor of God” worksheets together at a low table',
    caption: 'This week: the Armor of God, worked through together.',
    position: 'object-center',
  },
  {
    src: '/Picflow/children-classroom-circle.webp',
    alt: 'Children gathered around a table in the children’s ministry classroom, working and talking together',
    caption: 'Small tables, trained leaders, every child known.',
    position: 'object-[center_30%]',
  },
  {
    src: '/Picflow/children-lesson-worksheets.webp',
    alt: 'Close-up of children’s hands colouring “The Armor of God” activity sheets with crayons',
    caption: 'Scripture they can hold, colour, and carry home.',
    position: 'object-center',
  },
  {
    src: '/Picflow/children-lesson-coloring.webp',
    alt: 'A girl in a denim shirt concentrating on colouring her worksheet at an orange table',
    caption: 'Heads down, fully in it.',
    position: 'object-[center_35%]',
  },
];

const DISCUSSION: StoryPhoto = {
  src: '/Picflow/children-discussion.webp',
  alt: 'A girl in a denim shirt mid-sentence, talking with the other children around her table',
  caption:
    'The questions that come after the lesson — and the room to ask them.',
  position: 'object-[center_30%]',
};

const JOY: StoryPhoto = {
  src: '/Picflow/children-joy-wave.webp',
  alt: 'A toddler in a pink tulle dress raising her hand with a wave on the play mat',
  caption: 'And, running through all of it, the joy of just being here.',
  position: 'object-[center_15%]',
};

/** Every frame from the morning, in sequence — the contact sheet. */
const CONTACT_SHEET: readonly StoryPhoto[] = [
  ARRIVAL[0],
  ARRIVAL[1],
  ARRIVAL[2],
  LESSON[1],
  LESSON[0],
  LESSON[2],
  LESSON[3],
  DISCUSSION,
  JOY,
];

export default function ChildrenPhotoStory() {
  return (
    <>
      {/* ── Chapter 1 — Arrival ─────────────────────────────────── */}
      <Section tone="canvas">
        <Container>
          <ChapterHeader
            index="01"
            kicker="The welcome"
            title="A Sunday morning, from the first hello."
            lede="An ordinary week in the children’s ministry — the welcome at the door, the lesson at the table, and everything that grows out of it."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-12 lg:auto-rows-[clamp(20rem,24vw,24rem)]">
            <StoryCard
              photo={ARRIVAL[0]}
              priority
              depth={0.1}
              sizes="(max-width: 1023px) 100vw, 58vw"
              className="sm:col-span-2 sm:min-h-[24rem] lg:col-span-7 lg:row-span-2 lg:h-full"
            />
            <StoryCard
              photo={ARRIVAL[1]}
              depth={0.16}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 42vw"
              className="lg:col-span-5 lg:h-full"
            />
            <StoryCard
              photo={ARRIVAL[2]}
              depth={0.13}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 42vw"
              className="lg:col-span-5 lg:h-full"
            />
          </div>
        </Container>
      </Section>

      {/* ── Chapter 2 — The lesson ──────────────────────────────── */}
      <Section tone="dark">
        <Container>
          <ChapterHeader
            index="02"
            kicker="In the classroom"
            title="The Bible, brought to life at their level."
            lede="Scripture is taught in a way young minds can hold on to — engaging, hands-on, and built to be remembered long after Sunday."
            tone="dark"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-12 lg:auto-rows-[clamp(18rem,21vw,21rem)]">
            <StoryCard
              photo={LESSON[0]}
              tone="dark"
              depth={0.1}
              sizes="(max-width: 1023px) 100vw, 66vw"
              className="sm:col-span-2 lg:col-span-8 lg:h-full"
            />
            <StoryCard
              photo={LESSON[1]}
              tone="dark"
              depth={0.17}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="sm:row-span-2 sm:min-h-full lg:col-span-4 lg:row-span-2 lg:h-full"
            />
            <StoryCard
              photo={LESSON[2]}
              tone="dark"
              depth={0.13}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="lg:col-span-4 lg:h-full"
            />
            <StoryCard
              photo={LESSON[3]}
              tone="dark"
              depth={0.15}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="lg:col-span-4 lg:h-full"
            />
          </div>
        </Container>
      </Section>

      {/* ── Chapter 3 — The questions ───────────────────────────── */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <ChapterHeader
              index="03"
              kicker="Learning to think"
              title="Room to ask, wonder, and talk it through."
              lede="We want children to do more than memorise. Around these tables they learn to ask good questions, listen to one another, and reason through what they are taught."
              className="lg:col-span-4"
            />
            <div className="lg:col-span-8">
              <StoryCard
                photo={DISCUSSION}
                depth={0.12}
                sizes="(max-width: 1023px) 100vw, 62vw"
                className="min-h-[20rem] sm:min-h-[26rem] lg:h-[clamp(24rem,38vw,32rem)]"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Chapter 4 — The joy ─────────────────────────────────── */}
      <Section tone="canvas">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="order-2 lg:order-none lg:col-span-5">
              <StoryCard
                photo={JOY}
                depth={0.14}
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="mx-auto min-h-[24rem] max-w-md sm:min-h-[30rem] lg:h-[clamp(26rem,40vw,34rem)] lg:max-w-none"
              />
            </div>
            <ChapterHeader
              index="04"
              kicker="Every single week"
              title="And there is so much joy."
              lede="For all the structure, what children remember most is that this is a place they are glad to come back to. That is the point — a faith they are happy to grow up inside."
              className="order-1 lg:order-none lg:col-span-7"
            />
          </div>
        </Container>
      </Section>

      {/* ── Contact sheet — the whole morning ───────────────────── */}
      <Section tone="dark" className="bg-[var(--app-dark-2)]" compact>
        <Container>
          <div className="flex items-center gap-4" data-gsap="reveal">
            <span className={eyebrowClass}>The whole morning</span>
            <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
          </div>

          <div
            data-gsap="reveal"
            className="mt-6 -mx-[var(--page-gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[var(--page-gutter)] pb-3 [scrollbar-width:thin] sm:gap-4"
          >
            {CONTACT_SHEET.map(photo => (
              <figure
                key={photo.src}
                className="group relative aspect-[3/4] w-[9.5rem] shrink-0 snap-start overflow-hidden rounded-image bg-[var(--app-surface-2)] ring-1 ring-inset ring-white/10 sm:w-[12rem] lg:w-[13.5rem]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  quality={IMAGE_QUALITY}
                  sizes="(max-width: 639px) 40vw, 13.5rem"
                  className={cn(
                    'object-cover transition-transform duration-700 ease-out motion-reduce:transition-none md:group-hover:scale-[1.06]',
                    photo.position ?? 'object-center'
                  )}
                />
              </figure>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
