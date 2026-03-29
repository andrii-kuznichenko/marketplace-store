import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/images/logo.png'
import { pageLinks } from '@/utils/links';

function Logo() {
  return (
      <Link href={pageLinks.home}>
        <Image src={logo} className='w-10 h-10' alt={'logo'}/>
      </Link>
  );
}

export default Logo;
