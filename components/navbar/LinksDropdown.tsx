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

function LinksDropdown() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <motion.span
          whileTap={{ scale: 0.9, rotate: -8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className='flex'
        >
          <Button variant={'outline'} className='flex gap-4 max-width-[100px]'>
            <LuAlignLeft className='w-6 h-6' />
          </Button>
        </motion.span>
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
        <Button variant='outline' className='w-full'>
          Sign In
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;
