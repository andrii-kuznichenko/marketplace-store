import SectionTitle from '@/components/global/SectionTitle';
import { fetchOrCreateCart, updateCart } from '@/utils/actions/cartActions';
import { auth } from '@clerk/nextjs/server';
import GuestCart from '@/components/cart/GuestCart';
import CartTotals from '@/components/cart/CartTotals';
import CartItemsList from '@/components/cart/CartItemsList';
import DeliveryAddress from '@/components/cart/DeliveryAddress';
import { fetchUserAddresses } from '@/utils/actions/addressActions';
import { fetchRelatedProducts } from '@/utils/actions/productActions';
import ProductsCarousel from '@/components/products/ProductsCarousel';

async function CartPage() {
  const { userId } = await auth();

  if (!userId) return <GuestCart />;

  const previousCart = await fetchOrCreateCart({ userId });
  const { currentCart, cartItems } = await updateCart(previousCart);

  if (cartItems.length === 0) return <SectionTitle text='Empty Cart' />;

  const [addresses, relatedProducts] = await Promise.all([
    fetchUserAddresses(),
    fetchRelatedProducts({ cartId: currentCart.id }),
  ]);
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
      {relatedProducts.length > 0 && (
        <div className='mt-16 space-y-4'>
          <h2 className='text-xl font-medium'>You might also like</h2>
          <ProductsCarousel products={relatedProducts} />
        </div>
      )}
    </>
  );
}

export default CartPage;
