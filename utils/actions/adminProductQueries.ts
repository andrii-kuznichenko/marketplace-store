'use server'
import db from '@/utils/db';
import { pageLinks } from '@/utils/links';
import { MediaType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getMetadata } from '../roles';
import { getAdminUser } from './actionHelpers';

export const fetchAdminProducts = async () => {
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);

  return db.product.findMany({
    where: role === 'superadmin' ? {} : { companyId },
    include: { company: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const fetchAdminProductsForLinking = async (excludeProductId?: string) => {
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);

  return db.product.findMany({
    where: {
      ...(role !== 'superadmin' && { companyId }),
      ...(excludeProductId && { id: { not: excludeProductId } }),
    },
    select: { id: true, name: true, color: true },
    orderBy: { name: 'asc' },
  });
};

export const fetchAdminProductDetails = async (productId: string) => {
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);
  const product = await db.product.findUnique({
    where: { id: productId, ...(role !== 'superadmin' && { companyId }) },
    include: {
      media: { orderBy: { order: 'asc' } },
      sizes: true,
      customFields: true,
      colorGroup: {
        include: {
          products: { select: { id: true, name: true, color: true } },
        },
      },
    },
  });
  if (!product) redirect(pageLinks.adminProducts);
  return product;
};
