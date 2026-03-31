'use server';

import db from '@/utils/db';
import { pageLinks } from '@/utils/links';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { productSchema, validateWithZodSchema } from './schemas';

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect('/');
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);

  return {
    message: error instanceof Error ? error.message : 'an error occured',
  };
};

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

export const fetchAllProducts = async ({ search = '' }: { search: string }) => {
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect(pageLinks.products);
  return product;
};

export const createProductAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    console.log('price raw:', rawData.price, typeof rawData.price);
    const validatedFields = validateWithZodSchema(productSchema, rawData);
    console.log('price validated:', validatedFields.price, typeof validatedFields.price);

    await db.product.create({
      data: {
        ...validatedFields,
        image: '/images/hero2.jpg',
        clerkId: user.id,
      },
    });

    // await db.product.create({
    //   data: {
    //     name,
    //     price,
    //     company,
    //     image: '/images/hero1.jpg',
    //     description,
    //     featured,
    //     clerkId: user.id,
    //   },
    // });

    return { message: 'Product created' };
  } catch (error) {
    return renderError(error);
  }
};
