/* eslint-disable @typescript-eslint/no-explicit-any */
// types/hero.ts
export interface HeroSlide {
  id: number;
  image: any; // Using any to avoid TypeScript issues with image imports
  title: string;
  subtitle: string;
  description: string;
}
