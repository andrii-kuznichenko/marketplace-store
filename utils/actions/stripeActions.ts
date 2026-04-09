'use server';

import { headers } from 'next/headers';

import { stripe } from '@/lib/stripe';
import db from '../db';


export async function fetchClientSecret({
  orderId,
  cartId,
}: {
  orderId: string;
  cartId: string;
}) {
  const origin = (await headers()).get('origin');
  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
  });
  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              media: { where: { type: 'IMAGE' } },
            },
          },
        },
      },
    },
  });
  if (!order || !cart) {
    throw new Error('Order or cart not found');
  }
  //line items
  const line_items = cart.cartItems.map((cartItem) => {
    const product = cartItem.product;
    const image = product.media[0]?.url;
    return {
      quantity: cartItem.amount,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          description:
            [
              cartItem.size && `Size: ${cartItem.size}`,
              cartItem.color && `Color: ${cartItem.color}`,
            ]
              .filter(Boolean)
              .join(' | ') || undefined,
          images: image ? [image] : [],
          metadata: {
            ...(cartItem.size && { size: cartItem.size }),
            ...(cartItem.color && { color: cartItem.color }),
          },
        },
      },
    };
  });

  try {

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded_page',
      metadata: { orderId, cartId },
      line_items: line_items,
      mode: 'payment',
      return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret)
      throw new Error('Failed to create checkout session');

    return session.client_secret;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
