import React from 'react';
import { cn } from '@/lib/cn';
import Section from './Section';
import Container from './Container';

type Tone = 'page' | 'muted' | 'surface' | 'surface-strong' | 'none';

interface PageSectionProps {
  children: React.ReactNode;
  tone?: Tone;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  container?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  containerPadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  containerClassName?: string;
  id?: string;
  fullHeight?: boolean;
  centered?: boolean;
  style?: React.CSSProperties;
}

const toneClassMap: Record<Tone, string> = {
  page: 'bg-[#050505] text-white',
  muted: 'bg-[#080808] text-white',
  surface: 'bg-[#0b0b0b] text-white',
  'surface-strong': 'bg-[#111111] text-white',
  none: '',
};

export default function PageSection({
  children,
  tone = 'page',
  padding = 'lg',
  container = true,
  containerSize = 'xl',
  containerPadding = 'md',
  className,
  containerClassName,
  id,
  fullHeight = false,
  centered = false,
  style,
}: PageSectionProps) {
  return (
    <Section
      id={id}
      padding={padding}
      className={cn(toneClassMap[tone], className)}
      fullHeight={fullHeight}
      centered={centered}
      style={style}
    >
      {container ? (
        <Container
          size={containerSize}
          padding={containerPadding}
          className={containerClassName}
        >
          {children}
        </Container>
      ) : (
        children
      )}
    </Section>
  );
}
