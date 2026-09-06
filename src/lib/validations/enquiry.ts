import { z } from 'zod';
import { phoneRegex } from './content';
import { canonicalServices } from '@/content/services';

const allowedServiceSlugs = canonicalServices.map((s) => s.slug);

export const createEnquirySchema = z.object({
  name: z
    .string({ required_error: 'Please enter your full name.' })
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(120, 'Name cannot exceed 120 characters.'),
  phone: z
    .string({ required_error: 'Please enter your phone number.' })
    .trim()
    .min(7, 'Phone number must be at least 7 characters.')
    .max(32, 'Phone number cannot exceed 32 characters.')
    .regex(phoneRegex, 'Please enter a valid phone number with digits (7–20 digits).'),
  whatsappPreference: z
    .boolean({ invalid_type_error: 'WhatsApp preference must be a boolean.' })
    .default(false),
  serviceId: z
    .string({ required_error: 'Please select a valid service.' })
    .trim()
    .refine(
      (val) => allowedServiceSlugs.includes(val) || val === 'other',
      {
        message: 'Please select an authorized service category from the available options.',
      }
    ),
  location: z
    .string({ required_error: 'Please enter your service location or city.' })
    .trim()
    .min(2, 'Location must be at least 2 characters.')
    .max(160, 'Location cannot exceed 160 characters.'),
  message: z
    .string()
    .trim()
    .max(2000, 'Message cannot exceed 2,000 characters.')
    .optional()
    .nullable()
    .or(z.literal('')),
  sourcePage: z
    .string()
    .trim()
    .max(255, 'Source page reference cannot exceed 255 characters.')
    .optional()
    .nullable(),
  honeypot: z
    .string()
    .optional()
    .nullable(),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
