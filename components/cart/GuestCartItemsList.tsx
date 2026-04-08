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
  sizes: { size: string; inStock: boolean }[];
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
        const { name, price, color, company, sizes, media } = product;
        const image = media[0]?.url ?? '';
        const isSoldOut = !sizes.some((sizeEntry) => sizeEntry.size === size && sizeEntry.inStock);

        return (
          <Card
            key={`${productId}-${size}`}
            className='relative flex flex-col gap-y-4 md:flex-row flex-wrap items-start justify-between p-6 mb-8 gap-x-4'
          >
            <div className='flex gap-x-4'>
              <FirstColumn image={image} name={name} isSoldOut={isSoldOut} />
              <SecondColumn
                props={{
                  productId,
                  favouriteId: null,
                  name,
                  price,
                  size,
                  color: color ?? '',
                  amount,
                  company: company.name,
                  isSoldOut,
                }}
              />
            </div>
            {!isSoldOut && (
              <GuestThirdColumn productId={productId} size={size} quantity={amount} />
            )}
            {isSoldOut && <div className='md:ml-8' />}
            <div className='absolute top-2 right-3 md:static'>
              <GuestFourthColumn productId={productId} size={size} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
