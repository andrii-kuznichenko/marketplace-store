import { useUser } from "@clerk/nextjs";
import { Roles } from "../types/globals";

export function useRole() {
  const { user, isLoaded } = useUser();
  const role = user?.publicMetadata?.role as Roles | undefined;

  return {
    role,
    isLoaded,
    isSuperAdmin: role === "superadmin",
    isAdmin: role === "admin",
  };
}