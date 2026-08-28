import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type Justify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
type Align = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const directionClass: Record<Direction, string> = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

const justifyClass: Record<Justify, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const alignClass: Record<Align, string> = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const wrapClass: Record<Wrap, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

const gapClass: Record<Gap, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-5 sm:gap-6',
  xl: 'gap-6 sm:gap-8',
  '2xl': 'gap-8 sm:gap-10 lg:gap-12',
};

type FlexProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  direction?: Direction;
  justify?: Justify;
  align?: Align;
  wrap?: Wrap;
  gap?: Gap;
  fullWidth?: boolean;
  fullHeight?: boolean;
};

/**
 * The single flex-layout helper. For anything beyond direction / alignment /
 * gap, use Tailwind utilities directly on a plain element.
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  {
    children,
    direction = 'row',
    justify = 'start',
    align = 'stretch',
    wrap = 'nowrap',
    gap = 'md',
    fullWidth = true,
    fullHeight = false,
    className,
    ...rest
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0',
        directionClass[direction],
        justifyClass[justify],
        alignClass[align],
        wrapClass[wrap],
        gapClass[gap],
        fullWidth && 'w-full',
        fullHeight && 'h-full',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Flex;
