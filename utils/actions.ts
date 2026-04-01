'use server';

import db from '@/utils/db';
import { pageLinks } from '@/utils/links';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { MediaType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { imagesSchema, productSchema, validateWithZodSchema, videoSchema } from './schemas';
import { uploadFile } from './supabase';

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect('/');
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  const { role } = user.publicMetadata as { role?: string };
  if (role !== 'admin' && role !== 'superadmin') throw new Error('Access denied');
  return user;
};

const getSuperAdminUser = async () => {
  const user = await getAuthUser();
  const { role } = user.publicMetadata as { role?: string };
  if (role !== 'superadmin') throw new Error('Access denied');
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'an error occurred',
  };
};

export const fetchAllCompanies = async () => {
  return db.company.findMany({ orderBy: { name: 'asc' } });
};

export const fetchFeaturedProducts = async () => {
  return db.product.findMany({
    where: { featured: true },
    include: {
      media: { where: { type: MediaType.IMAGE }, orderBy: { order: 'asc' }, take: 1 },
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
      media: { where: { type: MediaType.IMAGE }, orderBy: { order: 'asc' }, take: 1 },
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
    },
  });
  if (!product) redirect(pageLinks.products);
  return product;
};

export const createProductAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAdminUser();
  const { role, companyId: metaCompanyId } = user.publicMetadata as { role: string; companyId?: string };

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    const companyId = role === 'superadmin'
      ? (formData.get('companyId') as string)
      : metaCompanyId;

    if (!companyId) throw new Error('Company is required');

    const imageFiles = formData.getAll('images') as File[];
    const { images } = validateWithZodSchema(imagesSchema, { images: imageFiles });

    const videoFile = formData.get('video') as File | null;
    const hasVideo = videoFile && videoFile.size > 0;
    if (hasVideo) validateWithZodSchema(videoSchema, { video: videoFile });

    const imageUrls = await Promise.all(images.map((img) => uploadFile(img)));
    const videoUrl = hasVideo ? await uploadFile(videoFile) : null;

    await db.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...validatedFields,
          clerkId: user.id,
          companyId,
        },
      });

      await tx.productMedia.createMany({
        data: [
          ...imageUrls.map((url, index) => ({
            url,
            type: MediaType.IMAGE,
            order: index,
            productId: product.id,
          })),
          ...(videoUrl
            ? [{ url: videoUrl, type: MediaType.VIDEO, order: 0, productId: product.id }]
            : []),
        ],
      });
    });
  } catch (error) {
    return renderError(error);
  }
  redirect(pageLinks.adminProducts);
};

export const createCompanyAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  try {
    await getSuperAdminUser();

    const name = formData.get('name') as string;
    const clerkUserId = formData.get('clerkUserId') as string;

    if (!name || !clerkUserId) throw new Error('Name and Clerk User ID are required');

    const company = await db.company.create({ data: { name } });
    await db.admin.create({ data: { clerkId: clerkUserId, companyId: company.id } });

    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { role: 'admin', companyId: company.id },
    });

    return { message: 'Company created' };
  } catch (error) {
    return renderError(error);
  }
};
