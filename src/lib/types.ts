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

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount?: string;
  commentCount?: string;
  tags?: string[];
  url: string;
  embedUrl: string;
  series: string; // Make sure these are properly defined
  preacher: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
}

export interface VideoFilters {
  searchTerm: string;
  sortBy: 'newest' | 'oldest' | 'popular';
  category?: string;
}

// export interface YouTubeVideo {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: string;
//   publishedAt: string;
//   viewCount: string;
//   series: string;
//   preacher: string;
//   duration: string;
// }

// Define types for grouped series
export interface SeriesGroup {
  name: string;
  searchTerms: string[];
  description: string;
  color: string;
}

export interface GroupedSeriesData {
  name: string;
  description: string;
  count: number;
  latestThumbnail?: string;
  color: string;
  uniqueSeries: string[];
  videos: YouTubeVideo[];
  searchTerms: string[];
}

export interface UngroupedSeriesData {
  name: string;
  count: number;
  latestThumbnail?: string;
  isUngrouped: boolean;
}
// types/events.ts
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  location: string;
  description?: string;
  logo?: string;
}

export interface MonthlyEvents {
  [key: number]: CalendarEvent[];
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  location: string;
}

export interface ReminderFormData {
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  eventType: 'conference' | 'lifting';
}
