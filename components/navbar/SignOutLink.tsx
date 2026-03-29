'use client';

import { SignOutButton } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import Link from 'next/link';

function SignOutLink() {
  const handleLogout = () => {
    const formattedDate = new Date()
      .toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .replace(',', ' at');

    toast('Logout Successful', {
      position: 'bottom-center',
      description: formattedDate,
    });
  };

  return (
    <SignOutButton>
      <Button
        variant={'destructive'}
        size={'lg'}
        className='w-full capitalize'
        onClick={handleLogout}
        asChild
      >
        <Link href={'/'}>logout</Link>
      </Button>
    </SignOutButton>
  );
}

export default SignOutLink;
