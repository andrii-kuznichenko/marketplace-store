'use server';

import db from '../db';
import { getAuthUser, renderError } from './actionHelpers';
import { TAX_RATE, SHIPPING } from '../cartConfig';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { pageLinks } from '../links';
import { Cart, MediaType } from '@prisma/client';

export const fetchCartItems = async () => {
  const user = await getAuthUser();
  const cart = await db.cart.findFirst({
    where: {
      clerkId: user.id ?? '',
    },
    select: {
      numItemsInCart: true,
    },
  });
  return cart?.numItemsInCart || 0;
};
export const fetchProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) throw new Error('Product not found');
  return product;
};

const includeProductClause = {
  cartItems: {
    include: {
      product: {
        include: {
          company: true,
          media: {
            where: { type: MediaType.IMAGE },
            orderBy: { order: 'asc' as const },
            take: 1,
          },
        },
      },
    },
  },
};

export const fetchOrCreateCart = async ({
  userId,
  errorOnFailure = false,
}: {
  userId: string;
  errorOnFailure?: boolean;
}) => {
  let cart = await db.cart.findFirst({
    where: {
      clerkId: userId,
    },
    include: includeProductClause,
  });
  if (!cart && errorOnFailure) {
    throw new Error('Cart not found');
  }
  if (!cart) {
    cart = await db.cart.create({
      data: {
        clerkId: userId,
        shipping: SHIPPING,
        taxRate: TAX_RATE,
      },
      include: includeProductClause,
    });
  }
  return cart;
};
const updateOrCreateCartItem = async ({
  productId,
  cartId,
  amount,
  size,
  color,
}: {
  productId: string;
  cartId: string;
  amount: number;
  size: string;
  color: string;
}) => {
  let cartItem = await db.cartItem.findFirst({
    where: {
      productId,
      cartId,
      size,
      color,
    },
  });
  if (cartItem) {
    cartItem = await db.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        amount: cartItem.amount + amount,
      },
    });
  } else {
    cartItem = await db.cartItem.create({
      data: {
        amount,
        productId,
        cartId,
        size,
        color,
      },
    });
  }
};
export const updateCart = async (cart: Cart) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: {
        include: {
          company: true,
          media: {
            where: { type: MediaType.IMAGE },
            orderBy: { order: 'asc' as const },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  let numItemsInCart = 0;
  let cartTotal = 0;

  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }

  const tax = cartTotal * cart.taxRate;

  const shipping = cartTotal ? cart.shipping : 0;
  const orderTotal = cartTotal + shipping;

  const currentCart = await db.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      numItemsInCart,
      cartTotal,
      tax,
      orderTotal,
    },
    include: includeProductClause,
  });
  return {cartItems, currentCart};
};

export const addToCartAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  try {
    const productId = formData.get('productId') as string;
    const amount = Number(formData.get('amount'));
    const size = (formData.get('size') as string) ?? '';
    if (!size) throw new Error('Please select a size');
    const product = await fetchProduct(productId);
    const color = product.color ?? '';
    const cart = await fetchOrCreateCart({ userId: user.id });
    await updateOrCreateCartItem({
      productId,
      cartId: cart.id,
      amount,
      size,
      color,
    });
    await updateCart(cart);
  } catch (error) {
    return renderError(error);
  }
  revalidatePath('/', 'layout');
  redirect(pageLinks.cart);
};

export const mergeGuestCartAction = async (
  guestItems: { productId: string; amount: number; size: string }[],
) => {
  const user = await getAuthUser();
  try {
    const cart = await fetchOrCreateCart({ userId: user.id });
    for (const item of guestItems) {
      const product = await fetchProduct(item.productId);
      const color = product.color ?? '';
      await updateOrCreateCartItem({
        productId: item.productId,
        cartId: cart.id,
        amount: item.amount,
        size: item.size,
        color,
      });
    }
    await updateCart(cart);
  } catch (error) {
    return renderError(error);
  }
  revalidatePath('/', 'layout');
};

export const fetchProductsByIds = async (productIds: string[]) => {
  return db.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      price: true,
      name: true,
      color: true,
      company: { select: { name: true } },
      media: {
        where: { type: MediaType.IMAGE },
        orderBy: { order: 'asc' as const },
        take: 1,
        select: { url: true },
      },
    },
  });
};

export const removeCartItemAction = async (
  prevState: any,
  formData: FormData,
) => {
  const user = await getAuthUser();
  try {
    const cartItemId = formData.get('id') as string;
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });
    await updateCart(cart);
    revalidatePath(pageLinks.cart);
    return { message: 'Item removed from cart' };
  } catch (error) {
    return renderError(error);
  }
};
export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number;
  cartItemId: string;
}) => {
  const user = await getAuthUser();
  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        amount,
      },
    });
    await updateCart(cart);
    revalidatePath(pageLinks.cart);
    return { message: 'cart updated' };
  } catch (error) {
    return renderError(error);
  }
};
