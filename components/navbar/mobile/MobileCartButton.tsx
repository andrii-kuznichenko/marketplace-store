import { auth } from '@clerk/nextjs/server';
import { fetchCartItems } from '@/utils/actions/cartActions';
import MobileCartButtonClient from './MobileCartButtonClient';

async function MobileCartButton() {
  const { userId } = await auth();
  if (userId) {
    const numItemsInCart = await fetchCartItems();
    return <MobileCartButtonClient numItemsInCart={numItemsInCart} />;
  }
  return <MobileCartButtonClient />;
}

export default MobileCartButton;
