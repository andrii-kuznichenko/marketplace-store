'use client';

import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';
import { pageLinks } from '@/utils/links';
import { useCartStore } from '@/utils/store/cartStore';

function MobileCartButtonClient({ numItemsInCart }: { numItemsInCart?: number }) {
  const guestCount = useCartStore((s) => s.numItemsInCart);
  const count = numItemsInCart ?? guestCount;

  return (
    <Link
      href={pageLinks.cart}
      className='relative flex flex-col items-center gap-0.5 text-xs text-foreground'
    >
      <FiShoppingBag size={22} />
      <span>Cart</span>
      <span className='absolute -top-1 -right-2 bg-primary text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px] leading-none'>
        {count}
      </span>
    </Link>
  );
}

export default MobileCartButtonClient;
