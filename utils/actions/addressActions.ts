'use server';

import db from '../db';
import { getAuthUser, renderError } from './actionHelpers';
import { addressSchema, validateWithZodSchema } from '../schemas';

export const saveAddressAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(addressSchema, rawData);

    await db.address.create({
      data: {
        clerkId: user.id,
        ...validatedFields,
      },
    });
    return { message: 'address saved' };
  } catch (error) {
    return renderError(error);
  }
};

export const upsertAddressAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(addressSchema, rawData);

    const existing = await db.address.findFirst({
      where: { clerkId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      await db.address.update({
        where: { id: existing.id },
        data: validatedFields,
      });
    } else {
      await db.address.create({
        data: { clerkId: user.id, ...validatedFields },
      });
    }
    return { message: 'Address saved' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchUserAddresses = async () => {
  const user = await getAuthUser();
  return db.address.findMany({
    where: { clerkId: user.id },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteAddressAction = async (addressId: string) => {
  const user = await getAuthUser();
  try {
    await db.address.delete({
      where: { id: addressId, clerkId: user.id },
    });
    return { message: 'address deleted' };
  } catch (error) {
    return renderError(error);
  }
};
