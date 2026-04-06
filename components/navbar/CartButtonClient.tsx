'use client';

import { Button } from '../ui/button';
import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';
import { pageLinks } from '@/utils/links';
import { useCartStore } from '@/utils/store/cartStore';

function CartButtonClient({ numItemsInCart }: { numItemsInCart?: number }) {
  const guestCount = useCartStore((state) => state.numItemsInCart);
  const count = numItemsInCart ?? guestCount;

  return (
    <Button
      asChild
      variant={'outline'}
      size={'icon'}
      className='flex justify-center items-center relative'
    >
      <Link href={pageLinks.cart}>
        <FiShoppingBag />
        <span className='absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs'>
          {count}
        </span>
      </Link>
    </Button>
  );
}

export default CartButtonClient;
