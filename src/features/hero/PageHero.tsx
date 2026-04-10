import Image from 'next/image';

import { WisdomeHouseLogo } from '@/shared/assets';
import { Caption, H2, BodySM } from '@/shared/text';
import { Section, Container } from '@/shared/layout';
import { cn } from '@/lib/cn';

export type PageHeroProps = {
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  note?: string;
  chips?: string[];
  compact?: boolean;
  variant?: 'default' | 'about';
  backgroundImage?: string;
};

export default function PageHero({
  title,
  subtitle,
  description,
  eyebrow = 'The Wisdom Church',
  note,
  chips,
  compact = false,
  variant = 'default',
  backgroundImage,
}: PageHeroProps) {
  const isAboutVariant = variant === 'about';
  const supportingCopy = note ?? description;
  const visualChips =
    chips && chips.length
      ? chips.slice(0, 4)
      : ['Word & Power', 'Excellence', 'Generations', 'Nations'];

  return (
    <Section
      padding="none"
      className={cn(
        'relative overflow-hidden bg-[#050505] flex items-center',
        isAboutVariant
          ? 'min-h-[70vh] sm:min-h-[76vh] lg:min-h-[82vh]'
          : 'min-h-[62vh] sm:min-h-[68vh] lg:min-h-[74vh]'
      )}
    >
      {backgroundImage ? (
        <div className="absolute inset-0 -z-30">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover object-center sm:object-[center_20%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />
        </div>
      ) : null}

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,rgba(6,6,6,0.94),rgba(15,17,22,0.78),rgba(6,6,6,0.96))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(215,187,117,0.22),transparent_55%)]" />

      <Container
        size="xl"
        className={cn(
          'relative z-10 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24'
        )}
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur">
                <div className="relative h-8 w-8 rounded-md overflow-hidden border border-white/15 bg-black/60">
                  <Image
                    src={WisdomeHouseLogo}
                    alt="The Wisdom Church"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <Caption className="text-white/80 uppercase tracking-[0.2em] text-[10px] sm:text-[11px]">
                  {eyebrow}
                </Caption>
              </div>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto lg:mx-0">
              <H2
                className={
                  compact
                    ? 'text-[1.9rem] sm:text-3xl md:text-[2.2rem] font-semibold text-white leading-tight text-balance'
                    : isAboutVariant
                      ? 'text-[2.2rem] sm:text-3xl md:text-[2.8rem] lg:text-[3.1rem] font-semibold text-white leading-[1.08] text-balance'
                      : 'text-[2.1rem] sm:text-3xl md:text-[2.6rem] font-semibold text-white leading-tight text-balance'
                }
              >
                {title}
              </H2>

              {subtitle ? (
                <BodySM className="text-white/80 text-sm sm:text-base leading-relaxed text-balance">
                  {subtitle}
                </BodySM>
              ) : null}

              {supportingCopy ? (
                <BodySM className="text-white/65 text-xs sm:text-sm leading-relaxed text-balance max-w-2xl">
                  {supportingCopy}
                </BodySM>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/12 bg-black/55 p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d7bb75]">
                What to expect
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/75">
                A Spirit-led atmosphere with worship, biblical teaching, and a
                clear path to grow and serve.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {visualChips.map(chip => (
                <span
                  key={chip}
                  className="rounded-full font-medium border border-white/15 bg-white/5 text-white px-3 py-1.5 text-[10px] sm:text-[11px]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
