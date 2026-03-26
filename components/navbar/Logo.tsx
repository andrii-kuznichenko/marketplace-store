import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { TfiShoppingCartFull } from 'react-icons/tfi';

function Logo() {
  return (
    <Button size={'icon'} asChild className='p-5'>
      <Link href={'/'}>
        <TfiShoppingCartFull className='w-6 h-6' />
      </Link>
    </Button>
  );
}

export default Logo;
