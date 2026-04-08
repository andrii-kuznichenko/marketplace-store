'use server';

import db from '../db';
import {
  getAdminUser,
  getAuthUser,
  getSuperAdminUser,
  renderError,
} from './actionHelpers';
import { fetchOrCreateCart } from './cartActions';
import { getMetadata } from '../roles';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { pageLinks } from '../links';

export const createOrderAction = async (prevState: any, _formData: FormData) => {
  const user = await getAuthUser();
  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });

    const address = await db.address.findFirst({
      where: { clerkId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    if (!address) throw new Error('Please add a delivery address before placing an order.');

    // Group cart items by companyId to create one parcel per company
    const companyIds = [...new Set(cart.cartItems.map((item) => item.product.companyId))];

    await db.order.create({
      data: {
        clerkId: user.id,
        orderTotal: cart.orderTotal,
        shipping: cart.shipping,
        email: user.emailAddresses[0].emailAddress,
        recipientName: address.name,
        street: address.street,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
        isPaid: true, // TODO: remove when payment system is integrated
        parcels: {
          create: companyIds.map((companyId) => ({ companyId })),
        },
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productId: item.productId,
            amount: item.amount,
            size: item.size,
            color: item.color,
            price: item.product.price,
          })),
        },
      },
    });
    await db.cartItem.deleteMany({ where: { cartId: cart.id } });
    await db.cart.delete({ where: { id: cart.id } });
  } catch (error) {
    return renderError(error);
  }
  redirect(pageLinks.orders);
};

export const fetchUserOrders = async () => {
  const user = await getAuthUser();

  return await db.order.findMany({
    where: { clerkId: user.id },
    include: {
      parcels: {
        include: { company: { select: { name: true } } },
        orderBy: { createdAt: 'asc' },
      },
      orderItems: {
        include: {
          product: {
            include: {
              company: { select: { name: true, id: true } },
              media: {
                where: { type: 'IMAGE' },
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const fetchAdminOrders = async () => {
  await getSuperAdminUser();

  return await db.order.findMany({
    where: { isPaid: true },
    include: {
      parcels: true,
      orderItems: {
        include: { product: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const fetchAdminOrderById = async (orderId: string) => {
  const user = await getAdminUser();
  const { role } = getMetadata(user);

  if (role === 'superadmin') {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        parcels: {
          include: { company: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
        orderItems: {
          include: {
            product: {
              include: {
                company: { select: { name: true, id: true } },
                media: {
                  where: { type: 'IMAGE' },
                  orderBy: { order: 'asc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
    if (!order) return null;
    return { ...order, companyTotal: null as number | null };
  }

  // Company admin — only their parcel and items
  const admin = await db.admin.findUnique({ where: { clerkId: user.id } });
  if (!admin) return null;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      parcels: {
        where: { companyId: admin.companyId },
        include: { company: { select: { name: true } } },
      },
      orderItems: {
        where: { product: { companyId: admin.companyId } },
        include: {
          product: {
            include: {
              company: { select: { name: true, id: true } },
              media: {
                where: { type: 'IMAGE' },
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
  if (!order) return null;

  const companyTotal = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.amount,
    0,
  );
  return { ...order, companyTotal };
};

export const fetchCompanyOrders = async () => {
  const user = await getAdminUser();

  const admin = await db.admin.findUnique({ where: { clerkId: user.id } });
  if (!admin) return [];

  const companyOrderItems = await db.orderItem.findMany({
    where: {
      product: { companyId: admin.companyId },
      order: { isPaid: true },
    },
    include: {
      order: {
        include: {
          parcels: {
            where: { companyId: admin.companyId },
          },
        },
      },
      product: { select: { id: true, name: true } },
    },
    orderBy: { order: { createdAt: 'desc' } },
  });

  const ordersMap = new Map<
    string,
    {
      order: (typeof companyOrderItems)[0]['order'];
      items: typeof companyOrderItems;
      companyTotal: number;
      parcel: (typeof companyOrderItems)[0]['order']['parcels'][number] | null;
    }
  >();

  for (const item of companyOrderItems) {
    if (!ordersMap.has(item.orderId)) {
      ordersMap.set(item.orderId, {
        order: item.order,
        items: [],
        companyTotal: 0,
        parcel: item.order.parcels[0] ?? null,
      });
    }
    const entry = ordersMap.get(item.orderId)!;
    entry.items.push(item);
    entry.companyTotal += item.price * item.amount;
  }

  return Array.from(ordersMap.values());
};

export const markParcelDeliveredAction = async (_prevState: any, formData: FormData) => {
  await getAdminUser();
  const parcelId = formData.get('parcelId') as string;
  try {
    await db.parcel.update({
      where: { id: parcelId },
      data: { isDelivered: true },
    });
    revalidatePath('/admin/sales', 'layout');
    return { message: 'Parcel marked as delivered' };
  } catch (error) {
    return renderError(error);
  }
};
