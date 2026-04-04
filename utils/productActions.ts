'use server';

import db from '@/utils/db';
import { pageLinks } from '@/utils/links';
import { MediaType } from '@prisma/client';
import { redirect } from 'next/navigation';

export const fetchAllCompanies = async () => {
  return db.company.findMany({ orderBy: { name: 'asc' } });
};

export const fetchFeaturedProducts = async () => {
  return db.product.findMany({
    where: { featured: true },
    include: {
      media: {
        where: { type: MediaType.IMAGE },
        orderBy: { order: 'asc' },
        take: 1,
      },
      company: true,
    },
  });
};

export const fetchAllProducts = async ({ search = '' }: { search: string }) => {
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } },
      ],
    },
    include: {
      media: {
        where: { type: MediaType.IMAGE },
        orderBy: { order: 'asc' },
        take: 1,
      },
      company: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      media: { orderBy: { order: 'asc' } },
      company: true,
      sizes: true,
      customFields: true,
      colorGroup: {
        include: {
          products: {
            select: {
              id: true,
              name: true,
              color: true,
              media: {
                where: { type: MediaType.IMAGE },
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
  if (!product) redirect(pageLinks.products);
  return product;
};
