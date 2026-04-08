import SectionTitle from '@/components/global/SectionTitle';
import { fetchOrCreateCart, updateCart } from '@/utils/actions/cartActions';
import { auth } from '@clerk/nextjs/server';
import GuestCart from '@/components/cart/GuestCart';
import CartTotals from '@/components/cart/CartTotals';
import CartItemsList from '@/components/cart/CartItemsList';
import DeliveryAddress from '@/components/cart/DeliveryAddress';
import { fetchUserAddresses } from '@/utils/actions/addressActions';

async function CartPage() {
  const { userId } = await auth();

  if (!userId) return <GuestCart />;

  const previousCart = await fetchOrCreateCart({ userId });
  const { currentCart, cartItems } = await updateCart(previousCart);

  if (cartItems.length === 0) return <SectionTitle text='Empty Cart' />;

  const addresses = await fetchUserAddresses();
  const savedAddress = addresses[0] ?? null;

  return (
    <>
      <SectionTitle text='Shopping Cart' />
      <div className='mt-8 grid gap-4 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <CartItemsList cartItems={cartItems} />
        </div>
        <div className='lg:col-span-4'>
          <DeliveryAddress savedAddress={savedAddress} />
          <CartTotals cart={currentCart} />
        </div>
      </div>
    </>
  );
}

export default CartPage;
