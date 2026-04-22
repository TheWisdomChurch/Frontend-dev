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
  | 'date'
  | 'image';

export type PublicFormFieldConditionRule = {
  fieldKey: string;
  operator?:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'not_contains'
    | 'in'
    | 'not_in'
    | 'is_empty'
    | 'not_empty'
    | 'greater_than'
    | 'less_than'
    | string;
  value?: string | number | boolean | null;
  values?: Array<string | number | boolean>;
};

export type PublicFormFieldConditional = {
  mode?: 'show' | 'hide';
  match?: 'all' | 'any';
  rules: PublicFormFieldConditionRule[];
};

export type PublicFormField = {
  id?: string;
  key: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  order: number;
  options?: { label: string; value: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    maxWords?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  placeholder?: string;
  conditional?: PublicFormFieldConditional;
};

export type PublicFormContentSectionItem = {
  title: string;
  body?: string;
  eyebrow?: string;
  icon?: string;
  linkText?: string;
  linkUrl?: string;
};

export type PublicFormContentSection = {
  id?: string;
  title: string;
  subtitle?: string;
  layout?: 'grid' | 'stack' | 'timeline' | 'split' | string;
  items?: PublicFormContentSectionItem[];
};

export type PublicFormSettings = {
  formType?: string;
  introTitle?: string;
  introSubtitle?: string;
  introBullets?: string[];
  introBulletSubtexts?: string[];
  formHeaderNote?: string;
  successMessage?: string;
  successModalTitle?: string;
  successModalSubtitle?: string;
  successModalMessage?: string;
  layoutMode?: string;
  dateFormat?: string;
  sections?: PublicFormContentSection[];
};

export type PublicFormPayload = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  capacity?: number | null;
  closesAt?: string | null;
  fields: PublicFormField[];
  event?: EventPublic | null;
  settings?: PublicFormSettings | null;
};

export type PublicFormSubmissionRequest = {
  values?: Record<string, any>;
  // Backward-compat payload accepted by older callers.
  answers?: Record<string, any>;
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
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  publishedAt?: string;
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
