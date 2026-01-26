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
  image: StaticImageData | { src: string; alt?: string };
  title: string;
  subtitle: string;
  description?: string; // Make optional to handle both cases
  upcoming?: {
    label: string;
    title: string;
    date: string;
    time: string;
    location: string;
    ctaLabel?: string;
    ctaTarget?: string;
  };
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

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: 'upcoming' | 'live' | 'recent' | 'past';
  ctaLabel?: string;
  ctaTarget?: string;
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

export interface TestimonialPayload {
  firstName: string;
  lastName: string;
  email?: string;
  testimony: string;
  anonymous?: boolean;
  allowSharing?: boolean;
  image?: string; // base64
}

export interface SubscriberPayload {
  name?: string;
  email: string;
}

export interface NotificationPayload {
  title: string;
  message: string;
  audience?: string;
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

// store section
export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  stock: number;
}
export type mainResourceLink = {
  title: string;
  subtitle?: string;
  description?: string;
  path: string;
  icon?: any;
  gradient?: string;
  glow?: string;
  actionText?: string;
  isLiveService?: boolean;
};

export interface Testimonial {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  image: string;
  testimony: string;
  rating: number;
  date: string;
  anonymous: boolean;
}
export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size: string;
  color: string;
  selectedColor: string;
  selectedSize: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  estimatedDelivery?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryInstructions?: string;
}

export interface FiltersState {
  searchTerm: string;
  selectedCategory: string;
  sortBy: 'name' | 'price-low' | 'price-high' | 'newest';
}
