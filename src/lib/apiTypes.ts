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
  key: string; // stable machine key
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
  closesAt?: string | null; // ISO string
  fields: PublicFormField[];
};

export type PublicFormSubmissionRequest = {
  answers: Record<string, any>;
};

export type EventPublic = {
  id: string;
  title: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  imageUrl?: string;
  bannerUrl?: string;
  formSlug?: string | null;
};

export type Testimonial = {
  id: number | string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  testimony: string;
  image?: string;
  anonymous: boolean;
  approved?: boolean;
  createdAt?: string;
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

/** What your PAGE form state uses */
export interface TestimonialFormData {
  firstName: string;
  lastName: string;
  image: string; // base64 data URL
  testimony: string;
  anonymous: boolean;
  allowSharing: boolean;
  agreeToTerms: boolean;
  email?: string;
}

/** What your BACKEND should receive */
export type CreateTestimonialRequest = {
  firstName: string;
  lastName: string;
  email?: string;
  testimony: string;
  isAnonymous: boolean;

  // You can send base64 (if backend supports) OR send imageUrl (if you upload elsewhere)
  imageBase64?: string;
  imageUrl?: string | null;

  allowSharing?: boolean;
  agreeToTerms?: boolean;
};
