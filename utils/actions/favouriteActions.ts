'use server';

import { revalidatePath } from 'next/cache';
import db from '../db';
import { MediaType } from '@prisma/client';
import { getAuthUser, renderError } from './actionHelpers';

export const toggleFavouriteAction = async (prevState: {
  productId: string;
  favouriteId: string | null;
  pathname: string;
}) => {
  const user = await getAuthUser();
  const { productId, favouriteId, pathname } = prevState;
  try {
    if (favouriteId) {
      await db.favourite.delete({
        where: {
          id: favouriteId,
        },
      });
    } else {
      await db.favourite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      });
    }
  } catch (error) {
    return renderError(error);
  }
  revalidatePath(pathname);
  return {
    message: favouriteId ? 'removed from favourites' : 'added to favourites',
  };
};

export const fetchFavouriteId = async ({
  productId,
}: {
  productId: string;
}) => {
  const user = await getAuthUser();
  const favourite = await db.favourite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favourite?.id || null;
};

export const fetchUserFavourites = async () => {
  const user = await getAuthUser();
  const favourites = await db.favourite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: {
        include: {
          media: {
            where: { type: MediaType.IMAGE },
            orderBy: { order: 'asc' },
            take: 1,
          },
          company: true,
        },
      },
    },
  });
  return favourites;
};
