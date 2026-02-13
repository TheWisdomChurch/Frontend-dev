// lib/api/apiTypes.ts

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date';

export type PublicFormField = {
  id?: string;
  key: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  order: number;
  options?: { label: string; value: string }[];
  placeholder?: string;
};

export type PublicFormPayload = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  capacity?: number | null;
  closesAt?: string | null;
  fields: PublicFormField[];
};

export type PublicFormSubmissionRequest = {
  answers: Record<string, any>;
};

export type EventPublic = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  imageUrl?: string;
  bannerUrl?: string;
  registerLink?: string | null;
  formSlug?: string | null;
};

export type ReelPublic = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
  eventId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Testimonial = {
  id: number | string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  testimony: string;
  imageUrl?: string | null;
  isAnonymous?: boolean;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTestimonialRequest = {
  firstName: string;
  lastName: string;
  email?: string;
  testimony: string;
  isAnonymous: boolean;
  imageUrl?: string;
  imageBase64?: string;
  allowSharing?: boolean;
  agreeToTerms?: boolean;
};

export interface SubscriberPayload {
  name?: string;
  email: string;
}

export interface NotificationPayload {
  title: string;
  message: string;
  audience?: string;
}
