'use client';

import { useState, type ReactNode } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/animated/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SignInDialog } from '@/components/auth-form/SignInDialog';
import AnimatedPushButton from '@/components/global/animation/AnimatedPushButton';
import GuestLinks from './GuestLinks';
import { LuAlignLeft } from 'react-icons/lu';

type Props = {
  userIcon: ReactNode;
  signedInLinks: ReactNode;
};

function LinksDropdownClient({ userIcon, signedInLinks }: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const handleOpenSignIn = () => {
    setOpenDropdown(false);
    window.setTimeout(() => {
      setOpenSignIn(true);
    }, 0);
  };

  return (
    <>
      <DropdownMenu
        open={openDropdown}
        onOpenChange={setOpenDropdown}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='flex gap-4 max-width-[100px]'>
            <AnimatedPushButton>
              <LuAlignLeft className='w-6 h-6' />
            </AnimatedPushButton>
            <AnimatedPushButton>{userIcon}</AnimatedPushButton>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-40' align='start' sideOffset={10}>
          <GuestLinks onOpenSignIn={handleOpenSignIn} />
          {signedInLinks}
        </DropdownMenuContent>
      </DropdownMenu>

      {openSignIn && <SignInDialog open={openSignIn} onOpenChange={setOpenSignIn} />}
    </>
  );
}

export default LinksDropdownClient;
