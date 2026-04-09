'use server'
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

const productInclude = {
  media: {
    where: { type: MediaType.IMAGE },
    orderBy: { order: 'asc' as const },
    take: 1,
  },
  company: true,
};

export const fetchRelatedProducts = async ({
  orderId,
  cartId,
}: {
  orderId?: string;
  cartId?: string;
}) => {
  let excludeIds: string[] = [];
  let firstProduct: { subcategory: any; mainCategory: any; gender: any } | null = null;

  if (orderId) {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { product: true } } },
    });
    if (!order || order.orderItems.length === 0) return [];
    excludeIds = order.orderItems.map((i) => i.productId);
    firstProduct = order.orderItems[0].product;
  } else if (cartId) {
    const cart = await db.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: { include: { product: true } } },
    });
    if (!cart || cart.cartItems.length === 0) return [];
    excludeIds = cart.cartItems.map((i) => i.productId);
    firstProduct = cart.cartItems[0].product;
  }

  if (!firstProduct) return [];

  const { subcategory, mainCategory, gender } = firstProduct;

  const exclude = { id: { notIn: excludeIds } };
  const LIMIT = 6;

  const bySubcategory = await db.product.findMany({
    where: { subcategory, ...exclude },
    include: productInclude,
    take: LIMIT,
  });

  if (bySubcategory.length >= LIMIT) return bySubcategory;

  const alreadyIds = [...excludeIds, ...bySubcategory.map((p) => p.id)];
  const byCategory = await db.product.findMany({
    where: { mainCategory, id: { notIn: alreadyIds } },
    include: productInclude,
    take: LIMIT - bySubcategory.length,
  });

  const combined = [...bySubcategory, ...byCategory];
  if (combined.length >= LIMIT) return combined;

  const allIds = [...alreadyIds, ...byCategory.map((product) => product.id)];
  const byGender = await db.product.findMany({
    where: { gender, id: { notIn: allIds } },
    include: productInclude,
    take: LIMIT - combined.length,
  });

  return [...combined, ...byGender];
};

export const fetchOrderWithItems = async (orderId: string) => {
  return db.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              company: true,
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
