import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'light' | 'dark';
  external?: boolean;
  className?: string;
};

export default function HomeActionLink({
  href,
  children,
  variant = 'primary',
  external = false,
  className,
}: Props) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={cn(
        'group inline-flex min-h-12 items-center gap-3 rounded-full border px-5 font-ui text-sm font-bold transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--app-primary)]/25',
        variant === 'primary' &&
          'border-[var(--app-primary)] bg-[var(--app-primary)] text-black hover:bg-[var(--app-primary-light)]',
        variant === 'light' &&
          'border-white/70 text-white hover:bg-white hover:text-black',
        variant === 'dark' &&
          'border-black bg-black text-white hover:border-white hover:bg-white hover:text-black',
        className
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
