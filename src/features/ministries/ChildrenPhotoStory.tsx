'use client';

import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type MotionProps,
} from 'framer-motion';

import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';
import { Container, Section, eyebrowClass } from '@/shared/ui/layout';
import { motionEase, staggerContainer, staggerItem } from '@/shared/ui/motion';

/* ============================================================================
   CHILDREN'S MINISTRY — PHOTO STORY

   Four chapters of one Sunday morning — the welcome, the lesson, the questions,
   the joy — closed by a full slideshow of the whole morning.

   Reveal choreography — every block starts hidden and rises into place as it
   enters the viewport, and drops back out when it leaves (`once: false`), so
   the section only ever shows its content while you are actually looking at it.
   `prefers-reduced-motion` turns all of it off and renders everything static.

   Sizing — each photograph is an overlay <StoryCard> locked to a fixed frame
   with `object-cover`; on `lg` the cards tile into a 12-column mosaic with
   fixed row heights so portrait and landscape originals still sit flush.
============================================================================ */

type Tone = 'light' | 'dark';

type StoryPhoto = {
  src: string;
  alt: string;
  caption: string;
  /** object-position for the crop inside the fixed frame. */
  position?: string;
};

const REVEAL_VIEWPORT = { once: false, amount: 0.2 } as const;
const SLIDE_MS = 5600;

/* ── Overlay photo card ──────────────────────────────────────────────── */

function StoryCard({
  photo,
  sizes,
  className,
  item,
  priority = false,
  tone = 'light',
}: {
  photo: StoryPhoto;
  sizes: string;
  className?: string;
  item: MotionProps;
  priority?: boolean;
  tone?: Tone;
}) {
  return (
    <motion.figure
      {...item}
      tabIndex={0}
      className={cn(
        'group relative isolate flex min-h-[17rem] overflow-hidden rounded-image bg-[var(--app-surface-2)] outline-none ring-[var(--app-primary)] transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-offset-4 sm:min-h-[20rem]',
        tone === 'dark'
          ? 'focus-visible:ring-offset-[var(--app-dark-2)]'
          : 'focus-visible:ring-offset-[var(--app-canvas)]',
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          quality={IMAGE_QUALITY}
          sizes={sizes}
          className={cn(
            'object-cover transition-transform duration-[1200ms] ease-out will-change-transform motion-reduce:transition-none md:group-hover:scale-[1.06] md:group-focus:scale-[1.06]',
            photo.position ?? 'object-center'
          )}
        />
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 motion-reduce:transition-none md:opacity-0 md:group-hover:opacity-100 md:group-focus:opacity-100"
      />

      <figcaption className="relative z-10 mt-auto w-full p-5 transition-all duration-500 ease-out motion-reduce:transition-none sm:p-6 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus:translate-y-0 md:group-focus:opacity-100 lg:p-7">
        <p className="max-w-sm font-ui text-body-sm leading-relaxed text-white sm:text-body-md">
          {photo.caption}
        </p>
      </figcaption>
    </motion.figure>
  );
}

/* ── Chapter marker ─────────────────────────────────────────────────── */

function ChapterHeader({
  kicker,
  title,
  lede,
  item,
  tone = 'light',
  className,
}: {
  kicker: string;
  title: string;
  lede?: string;
  item: MotionProps;
  tone?: Tone;
  className?: string;
}) {
  return (
    <motion.div
      {...item}
      className={cn('max-w-[56ch]', tone === 'dark' && 'tone-dark', className)}
    >
      <p className={eyebrowClass}>{kicker}</p>
      <h2 className="mt-4 text-balance font-ui text-heading-lg font-semibold leading-[1.08] tracking-[-0.03em] text-current sm:text-display-sm">
        {title}
      </h2>
      {lede ? (
        <p className="mt-5 font-ui text-body-md leading-[1.75] text-[var(--app-muted)] sm:text-body-lg">
          {lede}
        </p>
      ) : null}
    </motion.div>
  );
}

/* ── The whole-morning slideshow ────────────────────────────────────── */

function MorningSlideshow({
  slides,
  item,
}: {
  slides: readonly StoryPhoto[];
  item: MotionProps;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const id = window.setInterval(
      () => setIndex(i => (i + 1) % count),
      SLIDE_MS
    );
    return () => window.clearInterval(id);
  }, [reduce, paused, count, index]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const active = slides[index];

  const onKeyNav = (event: ReactKeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + 1);
    }
  };

  return (
    <motion.div {...item} className="mt-10 lg:mt-14">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="A Sunday in the children's ministry"
        onKeyDown={onKeyNav}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className="group relative aspect-[4/5] w-full overflow-hidden rounded-image bg-[var(--app-dark-2)] sm:aspect-[3/2] lg:aspect-[16/9]"
      >
        <AnimatePresence>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 1.1, ease: motionEase }}
          >
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.05 }}
              animate={reduce ? undefined : { scale: 1.14 }}
              transition={{ duration: SLIDE_MS / 1000 + 2, ease: 'linear' }}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                quality={IMAGE_QUALITY}
                sizes="(max-width: 1023px) 100vw, 1120px"
                className={cn(
                  'object-cover',
                  active.position ?? 'object-center'
                )}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/15"
        />

        {!reduce ? (
          <motion.div
            key={`bar-${index}-${paused ? 'p' : 'r'}`}
            className="absolute inset-x-0 top-0 h-[3px] origin-left bg-[var(--app-primary)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: paused ? 0 : 1 }}
            transition={{
              duration: paused ? 0.25 : SLIDE_MS / 1000,
              ease: 'linear',
            }}
          />
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7 lg:p-9">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: motionEase }}
              className="max-w-md font-ui text-body-sm leading-relaxed text-white sm:text-body-md"
            >
              {active.caption}
            </motion.p>
          </AnimatePresence>

          {count > 1 ? (
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous photo"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-black/60"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next photo"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-black/60"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 -mx-[var(--page-gutter)] flex snap-x gap-2 overflow-x-auto overscroll-x-contain px-[var(--page-gutter)] pb-2 [scrollbar-width:thin] sm:mt-5 sm:gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show photo ${i + 1} of ${count}`}
            aria-current={i === index}
            className={cn(
              'relative aspect-[4/3] w-[5.25rem] shrink-0 snap-start overflow-hidden rounded-radius-md outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-dark-2)] sm:w-[7rem] lg:w-[8rem]',
              i === index
                ? 'opacity-100 ring-2 ring-[var(--app-primary)] ring-offset-2 ring-offset-[var(--app-dark-2)]'
                : 'opacity-45 hover:opacity-90'
            )}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              quality={IMAGE_QUALITY}
              sizes="8rem"
              className={cn('object-cover', slide.position ?? 'object-center')}
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Photographs, grouped by chapter ────────────────────────────────── */

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

/** The whole morning, in sequence. */
const MORNING: readonly StoryPhoto[] = [
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
  const reduce = useReducedMotion();

  const group: MotionProps = reduce
    ? {}
    : {
        variants: staggerContainer,
        initial: 'hidden',
        whileInView: 'show',
        viewport: REVEAL_VIEWPORT,
      };
  const item: MotionProps = reduce ? {} : { variants: staggerItem };

  return (
    <>
      {/* ── Chapter 1 — Arrival ─────────────────────────────────── */}
      <Section tone="canvas">
        <Container>
          <motion.div {...group}>
            <ChapterHeader
              item={item}
              kicker="The welcome"
              title="A Sunday morning, from the first hello."
              lede="An ordinary week in the children’s ministry — the welcome at the door, the lesson at the table, and everything that grows out of it."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-12 lg:auto-rows-[clamp(20rem,24vw,24rem)]">
              <StoryCard
                item={item}
                photo={ARRIVAL[0]}
                priority
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="sm:col-span-2 sm:min-h-[24rem] lg:col-span-7 lg:row-span-2 lg:h-full"
              />
              <StoryCard
                item={item}
                photo={ARRIVAL[1]}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 42vw"
                className="lg:col-span-5 lg:h-full"
              />
              <StoryCard
                item={item}
                photo={ARRIVAL[2]}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 42vw"
                className="lg:col-span-5 lg:h-full"
              />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* ── Chapter 2 — The lesson ──────────────────────────────── */}
      <Section tone="dark">
        <Container>
          <motion.div {...group}>
            <ChapterHeader
              item={item}
              tone="dark"
              kicker="In the classroom"
              title="The Bible, brought to life at their level."
              lede="Scripture is taught in a way young minds can hold on to — engaging, hands-on, and built to be remembered long after Sunday."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-12 lg:auto-rows-[clamp(18rem,21vw,21rem)]">
              <StoryCard
                item={item}
                photo={LESSON[0]}
                tone="dark"
                sizes="(max-width: 1023px) 100vw, 66vw"
                className="sm:col-span-2 lg:col-span-8 lg:h-full"
              />
              <StoryCard
                item={item}
                photo={LESSON[1]}
                tone="dark"
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="sm:row-span-2 sm:min-h-full lg:col-span-4 lg:row-span-2 lg:h-full"
              />
              <StoryCard
                item={item}
                photo={LESSON[2]}
                tone="dark"
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="lg:col-span-4 lg:h-full"
              />
              <StoryCard
                item={item}
                photo={LESSON[3]}
                tone="dark"
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="lg:col-span-4 lg:h-full"
              />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* ── Chapter 3 — The questions ───────────────────────────── */}
      <Section tone="surface">
        <Container>
          <motion.div
            {...group}
            className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12"
          >
            <ChapterHeader
              item={item}
              className="lg:col-span-4"
              kicker="Learning to think"
              title="Room to ask, wonder, and talk it through."
              lede="We want children to do more than memorise. Around these tables they learn to ask good questions, listen to one another, and reason through what they are taught."
            />
            <div className="lg:col-span-8">
              <StoryCard
                item={item}
                photo={DISCUSSION}
                sizes="(max-width: 1023px) 100vw, 62vw"
                className="min-h-[20rem] sm:min-h-[26rem] lg:h-[clamp(24rem,38vw,32rem)]"
              />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* ── Chapter 4 — The joy ─────────────────────────────────── */}
      <Section tone="canvas">
        <Container>
          <motion.div
            {...group}
            className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12"
          >
            <div className="order-2 lg:order-none lg:col-span-5">
              <StoryCard
                item={item}
                photo={JOY}
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="mx-auto min-h-[24rem] max-w-md sm:min-h-[30rem] lg:h-[clamp(26rem,40vw,34rem)] lg:max-w-none"
              />
            </div>
            <ChapterHeader
              item={item}
              className="order-1 lg:order-none lg:col-span-7"
              kicker="Every single week"
              title="And there is so much joy."
              lede="For all the structure, what children remember most is that this is a place they are glad to come back to. That is the point — a faith they are happy to grow up inside."
            />
          </motion.div>
        </Container>
      </Section>

      {/* ── The whole morning — slideshow ───────────────────────── */}
      <Section tone="dark" className="bg-[var(--app-dark-2)]">
        <Container>
          <motion.div {...group}>
            <ChapterHeader
              item={item}
              tone="dark"
              kicker="The whole morning"
              title="One Sunday, from the first wave to the last."
            />
            <MorningSlideshow item={item} slides={MORNING} />
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
