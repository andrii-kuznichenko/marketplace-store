'use server';

import db from '@/utils/db';
import { clerkClient } from '@clerk/nextjs/server';
import { companySchema, validateWithZodSchema } from '../schemas';
import { getSuperAdminUser, renderError } from './actionHelpers';

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
