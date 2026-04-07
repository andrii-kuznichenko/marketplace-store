'use client';

import { useEffect, useState } from 'react';
import SectionTitle from '../global/SectionTitle';
import { useCartStore } from '@/utils/store/cartStore';
import { fetchProductsByIds } from '@/utils/actions/cartActions';
import { TAX_RATE, SHIPPING } from '@/utils/cartConfig';
import CartTotals, { CartTotalsData } from './CartTotals';
import { SignInDialog } from '../auth-form/SignInDialog';
import { Button } from '../ui/button';
import GuestCartItemsList from './GuestCartItemsList';

type ProductData = Awaited<ReturnType<typeof fetchProductsByIds>>[number];

function GuestCart() {
  const { items, numItemsInCart } = useCartStore();
  const [totals, setTotals] = useState<CartTotalsData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setTotals(null);
      return;
    }

    const productIds = items.map((item) => item.productId);
    fetchProductsByIds(productIds).then((fetched) => {
      setProducts(fetched);
      let cartTotal = 0;
      for (const item of items) {
        const product = fetched.find((p) => p.id === item.productId);
        if (product) cartTotal += product.price * item.amount;
      }
      const tax = cartTotal * TAX_RATE;
      const shipping = cartTotal ? SHIPPING : 0;
      const orderTotal = cartTotal + shipping;
      setTotals({ cartTotal, shipping, tax, orderTotal });
    });
  }, [items, numItemsInCart]);

  if (numItemsInCart === 0) return <SectionTitle text='Empty Cart' />;

  return (
    <>
      <SectionTitle text='Shopping Cart' />
      <div className='mt-8 grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <GuestCartItemsList items={items} products={products} />
        </div>
        <div className='lg:col-span-4'>
          {totals && (
            <>
              <CartTotals cart={totals} hideOrderButton />
              <Button
                className='w-full mt-8'
                onClick={() => setOpenSignIn(true)}
              >
                Place Order
              </Button>
              <SignInDialog open={openSignIn} onOpenChange={setOpenSignIn} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default GuestCart;
