'use server';

import db from '@/utils/db';
import { pageLinks } from '@/utils/links';
import { MediaType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { imagesSchema, validateWithZodSchema, videoSchema } from './schemas';
import { uploadFile, deleteFiles } from './supabase';
import { getMetadata } from './roles';
import { getAdminUser, renderError } from './actionHelpers';

export const deleteProductFilesAction = async (
  _prevState: any,
  formData: FormData,
) => {
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);
  const productId = formData.get('productId') as string;
  try {
    const id = formData.get('id') as string;

    const media = await db.productMedia.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!media) throw new Error('Media not found');
    if (role !== 'superadmin' && media.product.companyId !== companyId) {
      throw new Error('Unauthorized');
    }

    await deleteFiles([media.url]);
    await db.productMedia.delete({ where: { id } });
  } catch (error) {
    return renderError(error);
  }
  revalidatePath(`${pageLinks.adminProducts}/${productId}/edit`);
  redirect(`${pageLinks.adminProducts}/${productId}/edit`);
};

export const updateProductFilesAction = async (
  _prevState: any,
  formData: FormData,
) => {
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);
  const productId = formData.get('productId') as string;
  try {
    const id = formData.get('id') as string;
    const imageFile = formData.get('image') as File | null;
    const videoFile = formData.get('video') as File | null;
    const newFile = imageFile?.size ? imageFile : videoFile?.size ? videoFile : null;
    if (!newFile) throw new Error('No file provided');

    const media = await db.productMedia.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!media) throw new Error('Media not found');
    if (role !== 'superadmin' && media.product.companyId !== companyId) {
      throw new Error('Unauthorized');
    }

    await deleteFiles([media.url]);
    const newUrl = await uploadFile(newFile);
    await db.productMedia.update({ where: { id }, data: { url: newUrl } });
  } catch (error) {
    return renderError(error);
  }
  revalidatePath(`${pageLinks.adminProducts}/${productId}/edit`);
  redirect(`${pageLinks.adminProducts}/${productId}/edit`);
};

export const addProductImagesAction = async (
  _prevState: any,
  formData: FormData,
) => {
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);
  const productId = formData.get('productId') as string;
  try {
    const product = await db.product.findUnique({
      where: { id: productId, ...(role !== 'superadmin' && { companyId }) },
    });
    if (!product) throw new Error('Product not found');

    const imageFiles = formData.getAll('images') as File[];
    const { images } = validateWithZodSchema(imagesSchema, { images: imageFiles });

    const imageUrls = await Promise.all(images.map((image) => uploadFile(image)));

    await db.productMedia.createMany({
      data: imageUrls.map((url) => ({ url, type: MediaType.IMAGE, productId })),
    });
  } catch (error) {
    return renderError(error);
  }
  revalidatePath(`${pageLinks.adminProducts}/${productId}/edit`);
  redirect(`${pageLinks.adminProducts}/${productId}/edit`);
};

export const addProductVideoAction = async (
  _prevState: any,
  formData: FormData,
) => {
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);
  const productId = formData.get('productId') as string;
  try {
    const product = await db.product.findUnique({
      where: { id: productId, ...(role !== 'superadmin' && { companyId }) },
    });
    if (!product) throw new Error('Product not found');

    const videoFile = formData.get('video') as File | null;
    if (!videoFile?.size) throw new Error('No video provided');
    validateWithZodSchema(videoSchema, { video: videoFile });

    const videoUrl = await uploadFile(videoFile);
    await db.productMedia.create({
      data: { url: videoUrl, type: MediaType.VIDEO, productId },
    });
  } catch (error) {
    return renderError(error);
  }
  revalidatePath(`${pageLinks.adminProducts}/${productId}/edit`);
  redirect(`${pageLinks.adminProducts}/${productId}/edit`);
};

export const reorderProductMediaAction = async (
  _prevState: any,
  formData: FormData,
) => {
  const user = await getAdminUser();
  const { role, companyId } = getMetadata(user);
  const productId = formData.get('productId') as string;
  try {
    const orderJson = formData.get('order') as string;
    const order: { id: string; order: number }[] = JSON.parse(orderJson);

    const product = await db.product.findUnique({
      where: { id: productId, ...(role !== 'superadmin' && { companyId }) },
    });
    if (!product) throw new Error('Product not found');

    await db.$transaction(
      order.map(({ id, order: newOrder }) =>
        db.productMedia.update({ where: { id }, data: { order: newOrder } }),
      ),
    );
  } catch (error) {
    return renderError(error);
  }
  revalidatePath(`${pageLinks.adminProducts}/${productId}/edit`);
  redirect(`${pageLinks.adminProducts}/${productId}/edit`);
};
