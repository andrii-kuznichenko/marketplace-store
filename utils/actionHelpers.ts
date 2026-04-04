'use server';

import { getMetadata } from './roles';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect('/');
  return user;
};

export const getAdminUser = async () => {
  const user = await getAuthUser();
  const { role } = getMetadata(user);
  if (role !== 'admin' && role !== 'superadmin') redirect('/');
  return user;
};

export const getSuperAdminUser = async () => {
  const user = await getAuthUser();
  const { role } = getMetadata(user);
  if (role !== 'superadmin') redirect('/');
  return user;
};

export const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'an error occurred',
  };
};

export const parseSizes = (formData: FormData) => {
  const json = formData.get('sizes') as string | null;
  if (!json) return [];
  try {
    return JSON.parse(json) as { size: string; inStock: boolean }[];
  } catch {
    return [];
  }
};

export const parseCustomFields = (formData: FormData) => {
  const json = formData.get('customFields') as string | null;
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as { name: string; value: string }[];
    return parsed.map(({ name, value }) => ({ name, value }));
  } catch {
    return [];
  }
};
