import SectionTitle from '@/components/global/SectionTitle';
import { fetchOrCreateCart, updateCart } from '@/utils/actions/cartActions';
import { auth } from '@clerk/nextjs/server';
import GuestCart from '@/components/cart/GuestCart';
import CartTotals from '@/components/cart/CartTotals';
import CartItemsList from '@/components/cart/CartItemsList';

async function CartPage() {
  const { userId } = await auth();

  if (!userId) return <GuestCart />;

  const previousCart = await fetchOrCreateCart({ userId });
  const {currentCart, cartItems} = await updateCart(previousCart);

  if (currentCart.numItemsInCart === 0) return <SectionTitle text='Empty Cart' />;

  return (
    <>
      <SectionTitle text='Shopping Cart' />
      <div className='mt-8 grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <CartItemsList cartItems={cartItems} />
        </div>
        <div className='lg:col-span-4'>
          <CartTotals cart={currentCart} />
        </div>
      </div>
    </>
  );
}

export default CartPage;
