// components/icons/logo.tsx
import Image from 'next/image';
import { IMAGE_QUALITY } from '@/shared/constants';
import { WisdomChurchLogo } from '../assets';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = '', width = 32, height = 32 }: LogoProps) {
  return (
    <Image
      quality={IMAGE_QUALITY}
      src={WisdomChurchLogo}
      alt="Wisdom Church Logo"
      width={width}
      height={height}
      sizes={`${width}px`}
      className={`block max-w-full object-contain ${className}`}
      priority
    />
  );
}
