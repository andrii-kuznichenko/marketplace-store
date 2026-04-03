import { z, ZodType } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'name must be at least 2 characters.' })
    .max(100, { message: 'name must be less than 100 characters' }),
  price: z
    .string()
    .transform((val) => parseFloat(val.replace(',', '.')))
    .pipe(z.number().positive({ message: 'price must be a positive number' })),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(' ').length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    { message: 'description must be between 10 and 1000 words.' },
  ),
  featured: z.coerce.boolean(),
});

export const companySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'name must be at least 2 characters.' })
    .max(100, { message: 'name must be less than 100 characters.' }),
  clerkUserId: z.string().min(1, { message: 'Clerk User ID is required.' }),
});

export const imagesSchema = z.object({
  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 1024 * 1024, 'Each image must be less than 1MB')
        .refine((file) => file.type.startsWith('image/'), 'File must be an image'),
    )
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed'),
});

export const videoSchema = z.object({
  video: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Video must be less than 10MB')
    .refine((file) => file.type.startsWith('video/'), 'File must be a video')
    .optional(),
});

export function validateWithZodSchema<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    throw new Error(errors.join(','));
  }
  return result.data;
}