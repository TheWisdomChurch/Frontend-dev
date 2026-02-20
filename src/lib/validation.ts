import { z } from 'zod';

const requiredText = (label: string, min = 2, max = 120) =>
  z
    .string()
    .trim()
    .min(min, `${label} is required`)
    .max(max, `${label} is too long`);

const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, `Maximum ${max} characters`)
    .optional()
    .or(z.literal(''));

export const workforceRegistrationSchema = z.object({
  firstName: requiredText('First name', 2, 60),
  lastName: requiredText('Last name', 2, 60),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number is required')
    .max(24, 'Phone number is too long'),
  title: requiredText('Leadership title', 2, 80),
  department: requiredText('Department', 2, 80),
  leadershipCategory: requiredText('Leadership category', 2, 80),
  birthMonth: optionalText(20),
  anniversaryMonth: optionalText(20),
  isExistingMember: z.boolean().default(false),
  currentAssignment: optionalText(120),
  notes: optionalText(500),
});

export const reminderSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
});

export const eventRegistrationSchema = z
  .object({
    firstName: requiredText('First name', 2, 60),
    lastName: requiredText('Last name', 2, 60),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z
      .string()
      .trim()
      .min(7, 'Phone number is required')
      .max(24, 'Phone number is too long'),
    country: requiredText('Country', 2, 80),
    city: requiredText('City', 2, 80),
    attendance_type: z.enum(['attendee', 'volunteer', 'both']),
    volunteer_role: optionalText(120),
    custom_role: optionalText(120),
    occupation: requiredText('Occupation', 2, 120),
    previous_experience: optionalText(300),
    special_needs: optionalText(300),
    expectations: optionalText(300),
    event_id: requiredText('Event', 1, 120),
    registration_type: requiredText('Registration type', 2, 80),
  })
  .superRefine((data, ctx) => {
    if (data.attendance_type !== 'attendee' && !data.volunteer_role) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['volunteer_role'],
        message: 'Volunteer role is required',
      });
    }
    if (data.volunteer_role === 'other' && !data.custom_role) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['custom_role'],
        message: 'Please specify your role',
      });
    }
  });

export type WorkforceRegistrationFormData = z.input<
  typeof workforceRegistrationSchema
>;
export type ReminderFormSchema = z.infer<typeof reminderSchema>;
export type EventRegistrationFormSchema = z.infer<
  typeof eventRegistrationSchema
>;
