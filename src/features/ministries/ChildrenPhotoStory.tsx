import Image from 'next/image';
import type { CSSProperties } from 'react';

import { cn } from '@/lib/cn';
import { IMAGE_QUALITY } from '@/shared/constants';
import { Container, Section, SectionHeader, Split } from '@/shared/ui/layout';

/* ============================================================================
   CHILDREN'S MINISTRY — PHOTO STORY

   A four-chapter photo essay of one Sunday morning: the welcome at the door,
   the lesson in the classroom, the questions that follow, and the joy that
   runs through all of it.

   Sizing discipline — every photograph is rendered through <StoryFrame>, which
   locks it into a fixed aspect-ratio box and fills it with `object-cover`. No
   raw <img>, no intrinsic-size layout: within any row the frames share one
   ratio so their heights match exactly, whatever mix of portrait and landscape
   originals they were shot in.

   Motion is opt-in and handled globally (GlobalScrollEffects):
   - `data-motion-group` → direct children reveal in a stagger on scroll-in.
   - hover lifts a slow `scale` on the image, inside the clipped frame.
   Both collapse under `prefers-reduced-motion`.
============================================================================ */

type Ratio = 'wide' | 'landscape' | 'portrait' | 'square';

const ratioClass: Record<Ratio, string> = {
  wide: 'aspect-[16/10] sm:aspect-[16/9]',
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
};

type StoryPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

function StoryFrame({
  photo,
  ratio,
  sizes,
  priority = false,
  className,
  style,
}: {
  photo: StoryPhoto;
  ratio: Ratio;
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <figure
      className={cn('group/frame flex flex-col', className)}
      style={style}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-image bg-[var(--app-surface-2)] ring-1 ring-inset ring-[var(--app-border)]',
          ratioClass[ratio]
        )}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={IMAGE_QUALITY}
          className="object-cover transition-transform duration-[1200ms] ease-out will-change-transform group-hover/frame:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover/frame:scale-100"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/frame:opacity-100"
        />
      </div>
      {photo.caption ? (
        <figcaption className="mt-3 font-ui text-caption leading-relaxed text-[var(--app-subtle)]">
          {photo.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ── Photographs, grouped by chapter ──────────────────────────────────── */

const WELCOME: StoryPhoto = {
  src: '/Picflow/children-welcome-highfive.webp',
  alt: 'Two boys with backpacks sharing a high-five as they arrive for children’s church at The Wisdom Church',
  caption: 'The first hello — every child greeted by name at the door.',
};

const ARRIVAL: readonly StoryPhoto[] = [
  {
    src: '/Picflow/children-arrival-banner.webp',
    alt: 'A boy with a backpack walking past the children’s ministry banner reading “Equipping and Empowering for Greatness”',
    caption: 'Signed in and pointed the right way.',
  },
  {
    src: '/Picflow/children-arrival-walk.webp',
    alt: 'A young boy carrying his bag into the children’s ministry space at The Wisdom Church',
    caption: 'Walking in on his own — settled, unhurried.',
  },
];

const LESSON: readonly StoryPhoto[] = [
  {
    src: '/Picflow/children-lesson-armor-group.webp',
    alt: 'A group of children colouring “The Armor of God” worksheets together at a low table',
    caption: 'This week: the Armor of God.',
  },
  {
    src: '/Picflow/children-lesson-worksheets.webp',
    alt: 'Close-up of children’s hands colouring “The Armor of God” activity sheets with crayons',
    caption: 'Scripture they can hold, colour, and take home.',
  },
  {
    src: '/Picflow/children-lesson-coloring.webp',
    alt: 'A girl in a denim shirt concentrating on colouring her worksheet at an orange table',
    caption: 'Heads down, fully in it.',
  },
  {
    src: '/Picflow/children-classroom-circle.webp',
    alt: 'Children gathered around a table in the children’s ministry classroom, working and talking together',
    caption: 'Small tables, trained leaders, every child known.',
  },
];

const DISCUSSION: StoryPhoto = {
  src: '/Picflow/children-discussion.webp',
  alt: 'A girl in a denim shirt mid-sentence, talking with the other children around her table',
  caption: 'The questions that come after the lesson.',
};

const JOY: StoryPhoto = {
  src: '/Picflow/children-joy-wave.webp',
  alt: 'A toddler in a pink tulle dress raising her hand with a wave on the play mat',
  caption: 'And, always, the joy of just being here.',
};

export default function ChildrenPhotoStory() {
  return (
    <>
      {/* ── Chapter 1 — Arrival ─────────────────────────────────── */}
      <Section tone="canvas">
        <Container>
          <SectionHeader
            eyebrow="Life in our ministry"
            title="A Sunday morning, from the first hello."
            description="This is an ordinary week in the children’s ministry — the welcome at the door, the lesson at the table, and everything that grows out of it."
            size="sm"
          />

          <div
            className="mt-10 space-y-4 sm:space-y-6 lg:mt-14"
            data-motion-group
          >
            <StoryFrame
              photo={WELCOME}
              ratio="wide"
              priority
              sizes="(min-width: 1280px) 1120px, 100vw"
            />
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {ARRIVAL.map(photo => (
                <StoryFrame
                  key={photo.src}
                  photo={photo}
                  ratio="portrait"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Chapter 2 — The lesson ──────────────────────────────── */}
      <Section tone="dark">
        <Container>
          <SectionHeader
            eyebrow="In the classroom"
            title="The Bible, brought to life at their level."
            description="Scripture is taught in a way young minds can hold on to — engaging, hands-on, and built to be remembered long after Sunday."
            tone="dark"
            size="sm"
          />

          <div
            className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-14"
            data-motion-group
          >
            {LESSON.map(photo => (
              <StoryFrame
                key={photo.src}
                photo={photo}
                ratio="landscape"
                sizes="(min-width: 640px) 46vw, 100vw"
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Chapter 3 — The questions ───────────────────────────── */}
      <Section tone="surface">
        <Container>
          <Split className="lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeader
              eyebrow="Learning to think"
              title="Room to ask, wonder, and talk it through."
              description="We want children to do more than memorise. Around these tables they learn to ask good questions, listen to each other, and reason through what they’re being taught."
              size="sm"
            />
            <div data-motion-group>
              <StoryFrame
                photo={DISCUSSION}
                ratio="landscape"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </div>
          </Split>
        </Container>
      </Section>

      {/* ── Chapter 4 — The joy ─────────────────────────────────── */}
      <Section tone="canvas">
        <Container>
          <Split reverse className="lg:grid-cols-[1.15fr_0.85fr]">
            <div data-motion-group>
              <StoryFrame
                photo={JOY}
                ratio="portrait"
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="mx-auto max-w-md lg:mx-0"
              />
            </div>
            <SectionHeader
              eyebrow="Every single week"
              title="And there is so much joy."
              description="For all the structure, what children remember most is that this is a place they’re glad to come back to. That’s the point — a faith they’re happy to grow up inside."
              size="sm"
            />
          </Split>
        </Container>
      </Section>
    </>
  );
}
