// components/icons/banners.tsx
import Image from 'next/image';
import { Banner_1, Banner_2, Banner_3 } from '../assets';

interface BannerProps {
  banner: 'banner1' | 'banner2' | 'banner3';
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export function Banner({
  banner,
  className = '',
  width = 800,
  height = 400,
  alt,
}: BannerProps) {
  const banners = {
    banner1: Banner_1,
    banner2: Banner_2,
    banner3: Banner_3,
  };

  const defaultAlt = {
    banner1: 'Banner 1',
    banner2: 'Banner 2',
    banner3: 'Banner 3',
  };

  return (
    <Image
      src={banners[banner]}
      alt={alt || defaultAlt[banner]}
      width={width}
      height={height}
      className={className}
    />
  );
}

// Individual banner exports
export { Banner_1, Banner_2, Banner_3 };
