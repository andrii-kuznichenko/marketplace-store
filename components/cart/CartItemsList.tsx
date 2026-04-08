import { CartItemWithProduct } from '@/utils/types';
import { Card } from '../ui/card';
import {
  FirstColumn,
  FourthColumn,
  SecondColumn,
  ThirdColumn,
} from './CartItemsColumns';
import { fetchFavouriteId } from '@/utils/actions/favouriteActions';

export default async function CartItemsList({
  cartItems,
}: {
  cartItems: CartItemWithProduct[];
}) {
  const favouriteIds = await Promise.all(
    cartItems.map((item) => fetchFavouriteId({ productId: item.product.id })),
  );
  return (
    <div>
      {cartItems.map((cartItem, index) => {
        const { id, amount, size, color } = cartItem;
        const { name, price, id: productId, company, media, sizes } = cartItem.product;
        const image = media[0]?.url ?? '';
        const favouriteId = favouriteIds[index];
        const isSoldOut = !sizes.some((sizeEntry) => sizeEntry.size === size && sizeEntry.inStock);
        return (
          <Card
            key={id}
            className='relative flex flex-col gap-y-4 md:flex-row flex-wrap items-start justify-between p-6 mb-8 gap-x-4'
          >
            <div className='flex gap-x-4'>
              <FirstColumn image={image} name={name} isSoldOut={isSoldOut} />
              <SecondColumn
                props={{
                  productId: productId,
                  favouriteId: favouriteId,
                  name: name,
                  price: price,
                  size: size,
                  color: color,
                  amount: amount,
                  company: company.name,
                  isSoldOut: isSoldOut,
                }}
              />
            </div>
            <ThirdColumn quantity={amount} id={id} isSoldOut={isSoldOut} />
            <div className='absolute top-2 right-3 md:static'>
              <FourthColumn id={id} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
