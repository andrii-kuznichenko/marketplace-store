'use server';
import { reviewSchema, validateWithZodSchema } from '../schemas';
import { getAuthUser, renderError } from './actionHelpers';
import db from '../db';
import { revalidatePath } from 'next/cache';
import { pageLinks } from '../links';
import { moderateText } from '@/lib/moderation';

export const createReviewAction = async (
  prevState: any,
  formData: FormData,
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(reviewSchema, rawData);

    try {
      const isFlagged = await moderateText(validatedFields.comment);
      if (isFlagged) {
        return { message: 'The comment contains inappropriate language.' };
      }
    } catch (moderationError) {
      console.warn('Moderation skipped:', moderationError);
    }

    await db.review.create({
      data: {
        ...validatedFields,
        clerkId: user.id,
      },
    });
    revalidatePath(`${pageLinks.products}/${validatedFields.productId}`);
    return { message: 'Review submitted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchProductReviews = async (productId: string) => {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      colorGroup: {
        select: {
          products: {
            select: { reviews: { orderBy: { createdAt: 'desc' } } },
          },
        },
      },
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (product?.colorGroup) {
    return product.colorGroup.products.flatMap((product) => product.reviews);
  }

  return product?.reviews ?? [];
};
export const fetchProductReviewsByUser = async () => {
  const user = await getAuthUser();
  return await db.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      product: {
        select: {
          name: true,
          media: {
            where: { type: 'IMAGE' },
            select: { url: true },
            orderBy: { order: 'asc' },
            take: 1,
          },
        },
      },
    },
  });
};
export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();
  try {
    await db.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    });
    revalidatePath(pageLinks.reviews);
    return { message: 'review deleted succesfully' };
  } catch (error) {
    return renderError(error);
  }
};
export const findExistingReview = async (
  userId: string,
  productId: string,
) => {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      colorGroup: {
        select: { products: { select: { id: true } } },
      },
    },
  });

  const productIds = product?.colorGroup
    ? product.colorGroup.products.map((p) => p.id)
    : [productId];

  return db.review.findFirst({
    where: {
      clerkId: userId,
      productId: { in: productIds },
    },
  });
};

export const fetchProductRating = async (productId: string) => {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      colorGroup: {
        select: { products: { select: { id: true } } },
      },
    },
  });

  const productIds = product?.colorGroup
    ? product.colorGroup.products.map((product) => product.id)
    : [productId];

  const result = await db.review.aggregate({
    where: { productId: { in: productIds } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    rating: result._avg.rating?.toFixed(1) ?? 0,
    count: result._count.rating ?? 0,
  };
};
