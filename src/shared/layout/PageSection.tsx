import React from 'react';
import Section from './Section';
import Container from './Container';
import { cn } from '@/lib/cn';

type Tone = 'page' | 'muted' | 'surface' | 'surface-strong' | 'none';

interface PageSectionProps {
  children: React.ReactNode;
  tone?: Tone;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  container?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  containerPadding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  containerClassName?: string;
  id?: string;
  fullHeight?: boolean;
  centered?: boolean;
  style?: React.CSSProperties;
}

const toneClassMap: Record<Tone, string> = {
  page: 'page-section',
  muted: 'page-section-muted',
  surface: 'page-surface',
  'surface-strong': 'page-surface-strong',
  none: '',
};

const PageSection: React.FC<PageSectionProps> = ({
  children,
  tone = 'page',
  padding = 'xl',
  container = true,
  containerSize = 'xl',
  containerPadding = 'xl',
  className = '',
  containerClassName = '',
  id,
  fullHeight = false,
  centered = false,
  style,
}) => {
  const sectionClasses = cn(toneClassMap[tone], className);

  return (
    <Section
      id={id}
      padding={padding}
      className={sectionClasses}
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
};

export default PageSection;
