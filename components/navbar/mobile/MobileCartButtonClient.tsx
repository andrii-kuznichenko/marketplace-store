'use client';

import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';
import { pageLinks } from '@/utils/links';
import { useCartStore } from '@/utils/store/cartStore';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function MobileCartButtonClient({ numItemsInCart }: { numItemsInCart?: number }) {
  const guestCount = useCartStore((s) => s.numItemsInCart);
  const count = numItemsInCart ?? guestCount;

  return (
    <Link
      href={pageLinks.cart}
      className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'relative h-10 w-10')}
      aria-label='Cart'
    >
      <FiShoppingBag size={20} />
      <span className='absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs'>
        {count}
      </span>
    </Link>
  );
}

export default MobileCartButtonClient;
