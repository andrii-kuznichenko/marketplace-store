'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/animated/dropdown-menu';
import { LuAlignLeft } from 'react-icons/lu';
import Link from 'next/link';
import { Button } from '../ui/button';
import { links } from '@/utils/links';
import { motion } from 'motion/react';
import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useRef } from 'react';

function LinksDropdown() {
  const { user } = useUser();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} className='flex gap-4 max-width-[100px]'>
          <motion.span
            whileTap={{ scale: 0.9, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className='flex'
          >
            <LuAlignLeft className='w-6 h-6' />
          </motion.span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='start' sideOffset={10}>
        {links.map((link) => {
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
        <Show when='signed-out'>
          <SignInButton>
            <Button variant='outline' className='w-full'>
              Sign In
            </Button>
          </SignInButton>
        </Show>
        {/* TODO SHOW USER INFO */}
        {/* <Show when='signed-in'>
          <div className='flex items-center gap-2'>
            {user && (
              <span className='text-xs'>
                {user.firstName} {user.lastName}
              </span>
            )}
            <UserButton />
          </div>
        </Show> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;
