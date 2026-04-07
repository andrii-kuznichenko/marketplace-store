import { CartItemWithProduct } from '@/utils/types';
import { Card } from '../ui/card';
import {
  FirstColumn,
  FourthColumn,
  SecondColumn,
  ThirdColumn,
} from './CartItemsColumns';

export default function CartItemsList({
  cartItems,
}: {
  cartItems: CartItemWithProduct[];
}) {
  return (
    <div>
      {cartItems.map((cartItem) => {
        const { id, amount, size, color } = cartItem;
        const { name, price, id: productId, company, media } = cartItem.product;
        const image = media[0]?.url ?? '';
        return (
          <Card
            key={id}
            className='relative flex flex-col gap-y-4 md:flex-row flex-wrap items-start justify-between p-6 mb-8 gap-x-4'
          >
            <div className='flex gap-x-4'>
              <FirstColumn image={image} name={name} />
              <SecondColumn
                name={name}
                company={company.name}
                productId={productId}
                price={price}
                size={size}
                color={color}
                amount={amount}
              />
            </div>
            <ThirdColumn quantity={amount} id={id} />
            <div className='absolute top-2 right-3 md:static'>
              <FourthColumn id={id} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
