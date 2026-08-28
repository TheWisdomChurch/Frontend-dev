import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ContainerWidth = 'narrow' | 'content' | 'wide';

const widthClass: Record<ContainerWidth, string> = {
  narrow: 'max-w-3xl',
  content: 'max-w-5xl',
  wide: 'max-w-[var(--content-wide)]',
};

type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  /** Max content width. Defaults to the wide editorial measure. */
  width?: ContainerWidth;
};

/**
 * The single page-width wrapper for the whole app: centres content, applies the
 * one horizontal gutter (`--page-gutter`), and caps the measure. There is no
 * other container primitive — editorial sections, the header, and feature
 * sections all compose this.
 */
export function Container({
  children,
  width = 'wide',
  className,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full min-w-0 px-[var(--page-gutter)]',
        widthClass[width],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Container;
