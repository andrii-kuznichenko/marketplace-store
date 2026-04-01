import { currentUser } from '@clerk/nextjs/server';
import type { User } from '@clerk/nextjs/server';

export type UserMetadata = {
  role?: string;
  companyId?: string;
};

export const getMetadata = (user: User): UserMetadata =>
  user.publicMetadata as UserMetadata;

export const getUserRole = async () => {
  const user = await currentUser();
  const { role } = (user?.publicMetadata ?? {}) as { role?: string };
  return role;
};

export const isSuperAdmin = async () => {
  const role = await getUserRole();
  return role === 'superadmin';
};

export const isAdmin = async () => {
  const role = await getUserRole();
  return role === 'admin' || role === 'superadmin';
};
