'use client';

import Image from 'next/image';
import { Workforce_bg } from '@/components/assets';
import { H2, BaseText, LightText } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import { FlexboxLayout } from '@/components/layout';

export default function JoinIndex() {
  const { colorScheme } = useTheme();

  return (
    <div className="relative w-full min-h-screen">
      <Image
        src={Workforce_bg.src}
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>

      {/* Header Content */}
      <div className="relative z-10 flex items-center justify-center h-full py-16 lg:py-20">
        <FlexboxLayout
          direction="column"
          justify="center"
          align="center"
          gap="sm"
          className="text-center px-4"
          padding="none"
        >
          <H2
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center"
            style={{ color: colorScheme.white }}
          >
            Join Our{' '}
            <BaseText
              weight="regular"
              fontFamily="playfair"
              style={{
                fontStyle: 'italic',
                color: colorScheme.primary,
                display: 'inline',
                fontSize: 'inherit',
                lineHeight: 'inherit',
              }}
            >
              Workforce
            </BaseText>
          </H2>

          <LightText
            className="max-w-2xl text-sm xs:text-base sm:text-lg md:text-xl text-center leading-relaxed px-2"
            style={{ color: colorScheme.textSecondary }}
          >
            "Each of you should use whatever gift you have received to serve
            others, as faithful stewards of God's grace in its various forms." –
            1 Peter 4:10
          </LightText>
        </FlexboxLayout>
      </div>
    </div>
  );
}
