'use client';

import { Show } from '@clerk/nextjs';
import FormContainer from '../form/FormContainer';
import { addToCartAction } from '@/utils/actions/cartActions';
import { SubmitButton } from '../form/Buttons';
import { useCartStore } from '@/utils/store/cartStore';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { pageLinks } from '@/utils/links';

function AddToCart({ productId }: { productId: string }) {
  const AMOUNT = 1;
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleGuestAddToCart = () => {
    addItem(productId, AMOUNT);
    router.push(pageLinks.cart);
  };

  return (
    <div className='mt-4'>
      <Show when={'signed-in'}>
        <FormContainer action={addToCartAction}>
          <input type='hidden' name='productId' value={productId} />
          <input type='hidden' name='amount' value={AMOUNT} />
          <SubmitButton text='add to cart' className='mt-8' />
        </FormContainer>
      </Show>
      <Show when={'signed-out'}>
        <Button
          onClick={handleGuestAddToCart}
          className='mt-8 capitalize'
        >
          add to cart
        </Button>
      </Show>
    </div>
  );
}

export default AddToCart;
