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

    // signed in (either just logged in or already was on page load) + has guest items → merge
    if (isSignedIn && items.length > 0) {
      mergeGuestCartAction(items).then(() => clearCart());
    }

    // signed out → clear local cart
    if (!isSignedIn && prevSignedIn.current === true) {
      clearCart();
    }

    prevSignedIn.current = isSignedIn;
  }, [isSignedIn]);

  return null;
}

export default CartSyncer;
