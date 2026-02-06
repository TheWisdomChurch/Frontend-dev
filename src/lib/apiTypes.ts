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
  key: string;          // stable machine key
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
  // simplest: key/value map matching field keys
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

  // IMPORTANT: backend should include this OR frontend derives it from related form
  formSlug?: string | null;
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

// export type TestimonialPayload = {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   testimony: string;
//   image?: string;        // base64 data URL (if your backend accepts it)
//   anonymous: boolean;
//   allowSharing: boolean; // store for admin decision
// };
export type CreateTestimonialRequest = {
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
  testimony: string;
  isAnonymous: boolean;
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
