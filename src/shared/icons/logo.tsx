// components/icons/logo.tsx
import Image from 'next/image';
import { WisdomeHouseLogo } from '../assets';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = '', width = 32, height = 32 }: LogoProps) {
  return (
    <Image
      src={WisdomeHouseLogo}
      alt="Wisdom House Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
