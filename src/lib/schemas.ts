import { z } from 'zod';

const email = z.string().min(1, 'Email is required').email('Enter a valid email');
const password = z.string().min(8, 'Min 8 characters');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});
export type LoginValues = z.infer<typeof loginSchema>;

const withPasswordConfirm = {
  password,
  password_confirmation: z.string().min(1, 'Please confirm your password'),
};

export const youthSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email,
    ...withPasswordConfirm,
    city: z.string().optional(),
    date_of_birth: z.string().optional(),
    education_level: z.string().optional(),
    interests: z.array(z.number()),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });
export type YouthValues = z.infer<typeof youthSchema>;

export const nvoSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email,
    ...withPasswordConfirm,
    organization_name: z.string().min(2, 'Organization name is required'),
    pib: z.string().optional(),
    website: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
    description: z.string().max(2000).optional(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });
export type NvoValues = z.infer<typeof nvoSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  city: z.string().optional(),
  date_of_birth: z.string().optional(),
  education_level: z.string().optional(),
  gender: z.string().optional(),
  headline: z.string().max(150).optional(),
  about: z.string().max(3000).optional(),
  education: z.string().max(3000).optional(),
  work_experience: z.string().max(3000).optional(),
  skills: z.string().max(1000).optional(),
  linkedin: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  interests: z.array(z.number()),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const callSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(100),
    subtitle: z.string().max(150).optional().or(z.literal('')),
    description: z.string().min(1, 'Description is required'),
    type: z.string().min(1, 'Type is required'),
    application_deadline: z.string().min(1, 'Deadline is required'),
    start_date: z.string().optional().or(z.literal('')),
    end_date: z.string().optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    is_online: z.boolean(),
    max_participants: z.string().optional().or(z.literal('')),
    price: z.string(),
    status: z.enum(['active', 'finished', 'cancelled']),
    categories: z.array(z.number()).min(1, 'Pick at least one category'),
    prerequisites: z.array(z.string()),
  })
  .refine((d) => d.is_online || (d.location && d.location.length > 0), {
    message: 'Location is required for in-person events',
    path: ['location'],
  });
export type CallValues = z.infer<typeof callSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional().or(z.literal('')),
});
export type ReviewValues = z.infer<typeof reviewSchema>;
