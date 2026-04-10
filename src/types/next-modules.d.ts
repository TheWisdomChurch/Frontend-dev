// Type declarations for Next.js modules
declare module 'next/dynamic' {
  import type React from 'react';
  import type { ComponentType } from 'react';

  interface DynamicOptions {
    ssr?: boolean;
    loading?: ComponentType<any>;
  }

  function dynamic<P = object>(
    loader: () => Promise<{ default: ComponentType<P> }>,
    options?: DynamicOptions
  ): ComponentType<P>;

  export default dynamic;
}

declare module 'next/image' {
  import type React from 'react';

  export type StaticImageData = {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  };

  interface ImageProps extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'alt'
  > {
    src: string | StaticImageData;
    alt: string;
    width?: number | string;
    height?: number | string;
    fill?: boolean;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    onLoadingComplete?: (result: any) => void;
    loader?: (props: any) => string;
    unoptimized?: boolean;
  }

  declare const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'next/link' {
  import type React from 'react';

  interface LinkProps {
    href: string;
    replace?: boolean;
    scroll?: boolean;
    prefetch?: boolean | null;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }

  declare const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    refresh: () => void;
    back: () => void;
    forward: () => void;
    prefetch: (href: string) => void;
  };

  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}
