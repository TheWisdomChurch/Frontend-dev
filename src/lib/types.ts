import { StaticImageData } from 'next/image';
import { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

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
  imageId: string | StaticImageData;
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
  color?: string;
  accounts: Array<{
    bank: string;
    accountNumber: string;
    accountName: string;
    image?: StaticImageData;
  }>;
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

export interface WorkforceRegistrationData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  phoneCode?: string;
  title?: string;
  department: string;
  departmentSection?: string;
  leadershipCategory?: string;
  birthMonth?: string;
  anniversaryMonth?: string;
  isExistingMember?: boolean;
  currentAssignment?: string;
  birthday?: string; // DD/MM
  registrationType?: 'new' | 'serving' | 'existing' | 'update';
  sourceChannel?: string;
  notes?: string;
  occupation?: string;
  married?: 'yes' | 'no';
  spouse?: string;
  anniversaryDate?: string; // DD/MM
  about?: string;
}

export interface PastoralCareRequestData {
  title: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  contactAddress: string;
  eventDate: string;
  eventType: string;
  churchRole: string;
  customRole?: string;
  comments?: string;
  sourceChannel?: string;
}

export interface GivingIntentData {
  title: string;
  description?: string;
  sourceChannel?: string;
  metadata?: Record<string, unknown>;
}

export interface ChildRegistrationData {
  childFullName: string;
  /** ISO date, YYYY-MM-DD. */
  dateOfBirth: string;
  /** Human-readable age at time of registration, e.g. "2 years, 4 months old". */
  age?: string;
  gender: string;
  homeAddress: string;
  parentOrGuardianName: string;
  primaryPhoneNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  authorizedPickupName: string;
  medicalCondition?: string;
  /** Consent to use the child's photo/video in church media. */
  photoMediaRelease: boolean;
  sourceChannel?: string;
}

export interface ContactMessageData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  topic?: string;
  message: string;
  sourceChannel?: string;
  metadata?: Record<string, unknown>;
}

export interface VisitRequestData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceDate: string;
  attendance: number;
  notes?: string;
  reminderOptIn: boolean;
  sourceChannel?: string;
  idempotencyKey: string;
}

export interface VisitRequestConfirmation {
  id: string;
  serviceDate: string;
  serviceAt: string;
  serviceType: string;
  attendance: number;
  status: string;
  reminderOptIn: boolean;
  confirmationQueued: boolean;
}

export interface VisitServiceOption {
  date: string;
  serviceAt: string;
  serviceType: string;
}

export interface PrayerRequestData {
  firstName: string;
  lastName: string;
  email?: string;
  request: string;
  category?: string;
  isAnonymous?: boolean;
}

export interface GivingModalProps {
  isOpen: boolean;
  onClose: () => void;
  givingOption: GivingOption | null;
}

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
}

export interface ServiceUnavailableSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
}

export interface WisdomPowerAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type MainResourceLink = {
  title: string;
  subtitle?: string;
  description?: string;
  path: string;
  icon?: ReactNode;
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
  image: string;
  testimony: string;
  date: string; // ISO string e.g. "2024-01-15"
  anonymous: boolean;
}
