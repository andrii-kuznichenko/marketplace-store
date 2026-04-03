'use server';

import db from '@/utils/db';
import { pageLinks } from '@/utils/links';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { MediaType } from '@prisma/client';
import { redirect } from 'next/navigation';
import {
  companySchema,
  imagesSchema,
  productSchema,
  validateWithZodSchema,
  videoSchema,
} from './schemas';
import { deleteFiles, uploadFile } from './supabase';
import { getMetadata } from './roles';
import { revalidatePath } from 'next/cache';

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect('/');
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  const { role } = getMetadata(user);
  if (role !== 'admin' && role !== 'superadmin') redirect('/');
  return user;
};

const getSuperAdminUser = async () => {
  const user = await getAuthUser();
  const { role } = getMetadata(user);
  if (role !== 'superadmin') redirect('/');
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'an error occurred',
  };
};

const parseSizes = (formData: FormData) => {
  const json = formData.get('sizes') as string | null;
  if (!json) return [];
  try {
    return JSON.parse(json) as { size: string; inStock: boolean }[];
  } catch {
    return [];
  }
};

const parseCustomFields = (formData: FormData) => {
  const json = formData.get('customFields') as string | null;
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as { name: string; value: string }[];
    return parsed.map(({ name, value }) => ({ name, value }));
  } catch {
    return [];
  }
};

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

    const imageUrls = await Promise.all(images.map((img) => uploadFile(img)));
    const videoUrl = hasVideo ? await uploadFile(videoFile) : null;

    const sizes = parseSizes(formData);
    const customFields = parseCustomFields(formData);
    const linkToProductId = formData.get('linkToProductId') as string | null;

    await db.$transaction(async (tx) => {
      let colorGroupId: string | null = null;
      if (linkToProductId) {
        const linked = await tx.product.findUnique({
          where: { id: linkToProductId },
          select: { colorGroupId: true },
        });
        if (linked?.colorGroupId) {
          colorGroupId = linked.colorGroupId;
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

export const createCompanyAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  try {
    await getSuperAdminUser();

    const rawData = Object.fromEntries(formData);
    const { name, clerkUserId } = validateWithZodSchema(companySchema, rawData);

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
      await deleteFiles(product.media.map((m) => m.url));
    }

    revalidatePath(pageLinks.adminProducts);
    return { message: 'product removed' };
  } catch (error) {
    return renderError(error);
  }
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
        const linked = await tx.product.findUnique({
          where: { id: linkToProductId },
          select: { colorGroupId: true },
        });
        if (linked?.colorGroupId) {
          colorGroupIdUpdate = linked.colorGroupId;
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
          data: sizes.map((s) => ({ ...s, productId })),
        });
      }

      await tx.productCustomField.deleteMany({ where: { productId } });
      if (customFields.length > 0) {
        await tx.productCustomField.createMany({
          data: customFields.map((f) => ({ ...f, productId })),
        });
      }
    });
  } catch (error) {
    return renderError(error);
  }
  revalidatePath(`${pageLinks.adminProducts}/${productId}/edit`);
  redirect(`${pageLinks.adminProducts}/${productId}/edit`);
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

    const imageUrls = await Promise.all(images.map((img) => uploadFile(img)));

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
