'use client';

import { GuestCartItem } from '@/utils/types';
import { useCartStore } from '@/utils/store/cartStore';
import { Card } from '../ui/card';
import { FirstColumn, SecondColumn } from './CartItemsColumns';
import SelectProductAmount from '../single-product/SelectProductAmount';
import { Button } from '../ui/button';
import { RxCross1 } from 'react-icons/rx';

type ProductData = {
  id: string;
  name: string;
  price: number;
  color: string | null;
  company: { name: string };
  media: { url: string }[];
};

function GuestThirdColumn({
  productId,
  size,
  quantity,
}: {
  productId: string;
  size: string;
  quantity: number;
}) {
  const { updateAmount } = useCartStore();

  return (
    <div className='md:ml-8'>
      <SelectProductAmount
        isLoading={false}
        amount={quantity}
        setAmount={(value) => updateAmount(productId, size, value)}
      />
    </div>
  );
}

function GuestFourthColumn({
  productId,
  size,
}: {
  productId: string;
  size: string;
}) {
  const { removeItem } = useCartStore();

  return (
    <Button
      type='button'
      size='icon'
      variant='link'
      className='p-2 cursor-pointer dark:text-white'
      onClick={() => removeItem(productId, size)}
    >
      <RxCross1 />
    </Button>
  );
}

export default function GuestCartItemsList({
  items,
  products,
}: {
  items: GuestCartItem[];
  products: ProductData[];
}) {
  return (
    <div>
      {items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        const { productId, amount, size } = item;
        const { name, price, color, company, media } = product;
        const image = media[0]?.url ?? '';

        return (
          <Card
            key={`${productId}-${size}`}
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
                color={color ?? ''}
                amount={amount}
              />
            </div>
            <GuestThirdColumn productId={productId} size={size} quantity={amount} />
            <div className='absolute top-2 right-3 md:static'>
              <GuestFourthColumn productId={productId} size={size} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
