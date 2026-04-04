'use server';

import db from '@/utils/db';
import { pageLinks } from '@/utils/links';
import { MediaType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { imagesSchema, productSchema, validateWithZodSchema, videoSchema } from './schemas';
import { uploadFile, deleteFiles } from './supabase';
import { getMetadata } from './roles';
import {
  getAdminUser,
  parseSizes,
  parseCustomFields,
  renderError,
} from './actionHelpers';

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

export const createProductAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAdminUser();
  const { role, companyId: metaCompanyId } = getMetadata(user);

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    const companyId =
      role === 'superadmin' ? (formData.get('companyId') as string) : metaCompanyId;

    if (!companyId) throw new Error('Company is required');

    const imageFiles = formData.getAll('images') as File[];
    const { images } = validateWithZodSchema(imagesSchema, { images: imageFiles });

    const videoFile = formData.get('video') as File | null;
    const hasVideo = videoFile && videoFile.size > 0;
    if (hasVideo) validateWithZodSchema(videoSchema, { video: videoFile });

    const imageUrls = await Promise.all(images.map((image) => uploadFile(image)));
    const videoUrl = hasVideo ? await uploadFile(videoFile) : null;

    const sizes = parseSizes(formData);
    const customFields = parseCustomFields(formData);
    const linkToProductId = formData.get('linkToProductId') as string | null;

    await db.$transaction(async (tx) => {
      let colorGroupId: string | null = null;
      if (linkToProductId) {
        const linkedProduct = await tx.product.findUnique({
          where: { id: linkToProductId },
          select: { colorGroupId: true },
        });
        if (linkedProduct?.colorGroupId) {
          colorGroupId = linkedProduct.colorGroupId;
        } else {
          const group = await tx.colorGroup.create({ data: {} });
          colorGroupId = group.id;
          await tx.product.update({
            where: { id: linkToProductId },
            data: { colorGroupId },
          });
        }
      }

      const product = await tx.product.create({
        data: { ...validatedFields, clerkId: user.id, companyId, colorGroupId },
      });

      if (sizes.length > 0) {
        await tx.productSize.createMany({
          data: sizes.map((size) => ({ ...size, productId: product.id })),
        });
      }

      if (customFields.length > 0) {
        await tx.productCustomField.createMany({
          data: customFields.map((field) => ({ ...field, productId: product.id })),
        });
      }

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

export const updateProductAction = async (prevState: any, formData: FormData) => {
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);
  const productId = formData.get('id') as string;

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    const sizes = parseSizes(formData);
    const customFields = parseCustomFields(formData);
    const linkToProductId = formData.get('linkToProductId') as string | null;

    await db.$transaction(async (tx) => {
      let colorGroupIdUpdate: string | null | undefined = undefined;

      if (linkToProductId) {
        const linkedProduct = await tx.product.findUnique({
          where: { id: linkToProductId },
          select: { colorGroupId: true },
        });
        if (linkedProduct?.colorGroupId) {
          colorGroupIdUpdate = linkedProduct.colorGroupId;
        } else {
          const group = await tx.colorGroup.create({ data: {} });
          colorGroupIdUpdate = group.id;
          await tx.product.update({
            where: { id: linkToProductId },
            data: { colorGroupId: colorGroupIdUpdate },
          });
        }
      }

      await tx.product.update({
        where: { id: productId, ...(role !== 'superadmin' && { companyId }) },
        data: {
          ...validatedFields,
          ...(colorGroupIdUpdate !== undefined && { colorGroupId: colorGroupIdUpdate }),
        },
      });

      await tx.productSize.deleteMany({ where: { productId } });
      if (sizes.length > 0) {
        await tx.productSize.createMany({
          data: sizes.map((size) => ({ ...size, productId })),
        });
      }

      await tx.productCustomField.deleteMany({ where: { productId } });
      if (customFields.length > 0) {
        await tx.productCustomField.createMany({
          data: customFields.map((field) => ({ ...field, productId })),
        });
      }
    });
  } catch (error) {
    return renderError(error);
  }
  revalidatePath(`${pageLinks.adminProducts}/${productId}/edit`);
  redirect(`${pageLinks.adminProducts}/${productId}/edit`);
};

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);
  try {
    const product = await db.product.delete({
      where: { id: productId, ...(role !== 'superadmin' && { companyId }) },
      include: { media: true },
    });

    if (product.media.length > 0) {
      await deleteFiles(product.media.map((mediaItem) => mediaItem.url));
    }

    revalidatePath(pageLinks.adminProducts);
    return { message: 'product removed' };
  } catch (error) {
    return renderError(error);
  }
};

export const unlinkColorVariantAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);
  try {
    await db.product.update({
      where: { id: productId, ...(role !== 'superadmin' && { companyId }) },
      data: { colorGroupId: null },
    });
    revalidatePath(`${pageLinks.adminProducts}/${productId}/edit`);
    return { message: 'Unlinked from color group' };
  } catch (error) {
    return renderError(error);
  }
};
