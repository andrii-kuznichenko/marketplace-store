import { Button } from '@/components/ui/button';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { publicLinks, authPromptLinks } from '@/utils/links';
import { Show, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

function LinksSignOut() {
  return (
    <Show when='signed-out'>
      {publicLinks.map((link) => {
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
      {authPromptLinks.map((link) => {
        const Icon = link.icon;
        return (
          <DropdownMenuItem key={link.label}>
            <SignInButton mode='modal'>
              <div className='w-full flex items-center gap-x-2'>
                <Icon size={20} />
                <p className='capitalize'>{link.label}</p>
              </div>
            </SignInButton>
          </DropdownMenuItem>
        );
      })}
      <DropdownMenuSeparator />
      <div className='flex flex-col gap-y-2 mt-3'>
        <SignInButton mode='modal'>
          <Button variant='outline' className='w-full'>
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode='modal'>
          <Button variant='outline' className='w-full'>
            Register
          </Button>
        </SignUpButton>
      </div>
    </Show>
  );
}

export default LinksSignOut;
