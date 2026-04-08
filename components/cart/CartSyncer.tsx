'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCartStore } from '@/utils/store/cartStore';
import { mergeGuestCartAction } from '@/utils/actions/cartActions';

function CartSyncer() {
  const { isSignedIn } = useUser();
  const { items, clearCart } = useCartStore();
  const prevSignedIn = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (isSignedIn === undefined) return;

    
    if (isSignedIn && items.length > 0) {
      mergeGuestCartAction(items).then(() => clearCart());
    }

    if (!isSignedIn && prevSignedIn.current === true) {
      clearCart();
    }

    prevSignedIn.current = isSignedIn;
  }, [isSignedIn]);

  return null;
}

export default CartSyncer;
