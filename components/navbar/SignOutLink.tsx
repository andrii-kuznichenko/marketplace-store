'use client';

import { SignOutButton } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import Link from 'next/link';
import { pageLinks } from '@/utils/links';

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
        <Link href={pageLinks.home}>logout</Link>
      </Button>
    </SignOutButton>
  );
}

export default SignOutLink;
