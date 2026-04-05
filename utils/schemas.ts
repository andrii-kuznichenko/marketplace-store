import { z, ZodType } from 'zod';
import { Gender, MainCategory, Subcategory } from '@prisma/client';
import { checkProfanity } from 'glin-profanity';

export const productSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'name must be at least 2 characters.' })
    .max(100, { error: 'name must be less than 100 characters' }),
  price: z
    .string()
    .transform((val) => parseFloat(val.replace(',', '.')))
    .pipe(z.number().positive({ error: 'price must be a positive number' })),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(' ').length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    { error: 'description must be between 10 and 1000 words.' },
  ),
  featured: z.coerce.boolean(),
  gender: z.enum(Gender, { error: 'Gender is required' }),
  mainCategory: z.enum(MainCategory, { error: 'Category is required' }),
  subcategory: z.enum(Subcategory, { error: 'Subcategory is required' }),
  color: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().optional(),
  ),
});

export const companySchema = z.object({
  name: z
    .string()
    .min(2, { error: 'name must be at least 2 characters.' })
    .max(100, { error: 'name must be less than 100 characters.' }),
  clerkUserId: z.string().min(1, { error: 'Clerk User ID is required.' }),
});

export const imagesSchema = z.object({
  images: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= 1024 * 1024,
          'Each image must be less than 1MB',
        )
        .refine(
          (file) => file.type.startsWith('image/'),
          'File must be an image',
        ),
    )
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed'),
});

export const videoSchema = z.object({
  video: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'Video must be less than 10MB',
    )
    .refine((file) => file.type.startsWith('video/'), 'File must be a video')
    .optional(),
});

export const reviewSchema = z.object({
  productId: z.string().refine((value) => value !== '', {
    error: 'Product ID cannot be empty',
  }),
  authorName: z.string().refine((value) => value !== '', {
    error: 'Author name cannot be empty',
  }),
  authorImageUrl: z.string().refine((value) => value !== '', {
    error: 'Author image URL cannot be empty',
  }),
  rating: z.coerce
    .number()
    .int()
    .min(1, { error: 'Rating must be at least 1' })
    .max(5, { error: 'Rating must be at most 5' }),
  comment: z
    .string()
    .min(10, { error: 'Comment must be at least 10 characters long' })
    .max(1000, { error: 'Comment must be at most 1000 characters long' })
    .refine(
      (value) => !checkProfanity(value, { allLanguages: true }).containsProfanity,
      { message: 'The comment contains inappropriate words.' },
    ),
}); 

export function validateWithZodSchema<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    throw new Error(errors.join(','));
  }
  return result.data;
}
