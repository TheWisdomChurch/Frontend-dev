/* eslint-disable @typescript-eslint/no-explicit-any */
import { StaticImageData } from 'next/image';
import { LucideIcon } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
}

export interface ExtendedNavLink {
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
  dropdown?: DropdownItem[];
}

export interface DropdownItem {
  label: string;
  href: string;
}

export interface Leader {
  id: number;
  name: string;
  role: string;
  image: StaticImageData;
  description: string;
}

export interface MinistryLeader extends Leader {
  department: string;
}

export interface Sermon {
  title: string;
  preacher: string;
  date: string;
  imageId: string;
  videoId: string;
}

export interface Ministry {
  name: string;
  description: string;
  imageId: any;
}

export interface ServiceBox {
  id: number;
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  gradient?: string;
  imageOpacity?: number;
}

export interface GivingOption {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface Photo {
  title: string;
  image: StaticImageData;
  link: string;
}

export interface Slide {
  image: StaticImageData;
  title: string;
  subtitle: string;
  description: string;
}

export interface YoutubeLivestreams {
  current: string;
  previous: string[];
}
