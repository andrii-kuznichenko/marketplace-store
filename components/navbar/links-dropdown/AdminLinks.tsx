import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/animated/dropdown-menu';
import { adminLinks } from '@/utils/links';
import Link from 'next/link';
import { useRole } from '@/app/hooks/useRole';

function AdminLinks() {
  const { isSuperAdmin, isAdmin, isLoaded } = useRole();

  if (!isLoaded) return null;
  return (
    <>
      {(isSuperAdmin || isAdmin) && (
        <>
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <DropdownMenuItem key={link.href}>
                <Link
                  href={link.href}
                  className='w-full flex items-center gap-x-2'
                >
                  <Icon size={20} />
                  <p className='capitalize'>{link.label}</p>
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
        </>
      )}
    </>
  );
}

export default AdminLinks;
