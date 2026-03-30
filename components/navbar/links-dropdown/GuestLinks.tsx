'use client'

import { Button } from '@/components/ui/button';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/animated/dropdown-menu';
import { publicLinks, authPromptLinks } from '@/utils/links';
import { Show, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

type Props = {
  onOpenSignIn: () => void;
};

function GuestLinks({ onOpenSignIn }: Props) {
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
          <DropdownMenuItem key={link.label} onSelect={onOpenSignIn}>
              <div className='w-full flex items-center gap-x-2'>
                <Icon size={20} />
                <p className='capitalize'>{link.label}</p>
              </div>
          </DropdownMenuItem>
        );
      })}
      <DropdownMenuSeparator />
      <div className='flex flex-col gap-y-2 mt-3'>
        <DropdownMenuItem onSelect={onOpenSignIn}>
          <div className='w-full flex justify-center font-bold'>
              Sign In
          </div>
        </DropdownMenuItem>
      </div>
    </Show>
  );
}

export default GuestLinks;
