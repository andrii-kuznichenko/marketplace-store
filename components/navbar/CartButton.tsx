import { auth } from '@clerk/nextjs/server';
import { fetchCartItems } from '@/utils/actions/cartActions';
import CartButtonClient from './CartButtonClient';

async function CartButton() {
  const { userId } = await auth();

  if (userId) {
    const numItemsInCart = await fetchCartItems();
    return <CartButtonClient numItemsInCart={numItemsInCart} />;
  }
  return <CartButtonClient />;
}

export default CartButton;
