import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/animated/dropdown-menu';
import { links } from '@/utils/links';
import { Show } from '@clerk/nextjs';
import Link from 'next/link';
import SignOutLink from '../SignOutLink';

function LinksSignIn() {
  return (
    <Show when='signed-in'>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <DropdownMenuItem key={link.href}>
            <Link href={link.href} className='w-full flex items-center gap-x-2'>
              <Icon size={20} />
              <p className='capitalize'>{link.label}</p>
            </Link>
          </DropdownMenuItem>
        );
      })}
      <DropdownMenuSeparator />
      <SignOutLink />
    </Show>
  );
}

export default LinksSignIn;
