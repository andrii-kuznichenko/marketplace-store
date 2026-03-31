import { z, ZodType } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.',
    })
    .max(100, {
      message: 'name must be less than 100 characters',
    }),
  company: z.string(),
  price: z
    .string()
    .transform((val) => parseFloat(val.replace(',', '.')))
    .pipe(z.number().positive({ message: 'price must be a positive number' })),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(' ').length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: 'description must be between 10 and 1000 words.',
    },
  ),
  featured: z.coerce.boolean(),
});

export function validateWithZodSchema<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    throw new Error(errors.join(','));
  }
  return result.data;
}
