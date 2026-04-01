'use client';

import { Button } from '@/components/ui/button';
import { adminLinks, superAdminLinks } from '@/utils/links';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Sidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const links = isSuperAdmin ? [...adminLinks, ...superAdminLinks] : adminLinks;

  return (
    <aside>
      {links.map((link) => {
        const isActivePage = pathname === link.href;
        const variant = isActivePage ? 'secondary' : 'ghost';
        const Icon = link.icon;
        return (
          <Button
            asChild
            className='w-full mb-2 capitalize font-normal'
            variant={variant}
            key={link.href}
          >
            <Link href={link.href} className='flex items-center justify-start gap-2'>
              <Icon />
              {link.label}
            </Link>
          </Button>
        );
      })}
    </aside>
  );
}

export default Sidebar;
