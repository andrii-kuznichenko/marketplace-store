'use client';
import { formatCurrency } from '@/utils/format';
import { pageLinks } from '@/utils/links';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import SelectProductAmount from '../single-product/SelectProductAmount';
import FormContainer from '../form/FormContainer';
import {
  removeCartItemAction,
  updateCartItemAction,
} from '@/utils/actions/cartActions';
import { IconButton, SubmitButton } from '../form/Buttons';
import { toast } from 'sonner';
import { toggleFavouriteAction } from '@/utils/actions/favouriteActions';
import { usePathname } from 'next/navigation';

export const FirstColumn = ({
  name,
  image,
  isSoldOut = false,
}: {
  image: string;
  name: string;
  isSoldOut?: boolean;
}) => {
  return (
    <div className={`relative w-24 sm:w-32 aspect-3/4${isSoldOut ? ' grayscale-50' : ''}`}>
      <Image
        src={image}
        alt={name}
        fill
        sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 33'
        loading='eager'
        className='w-full object-cover'
      />
    </div>
  );
};

type SecondColumnProps = {
  productId: string;
  favouriteId: string | null;
  name: string;
  price: number;
  size: string;
  color: string;
  amount: number;
  company: string;
  isSoldOut?: boolean;
};

export const SecondColumn = ({ props }: { props: SecondColumnProps }) => {
  const { productId, favouriteId, name, price, size, color, amount, company, isSoldOut = false } =
    props;
  const pathname = usePathname();
  const toggleAction = toggleFavouriteAction.bind(null, {
    productId,
    favouriteId,
    pathname,
  });
  return (
    <div className='flex flex-col items-start justify-between sm:w-48'>
      <h4 className='mt-1 capitalize text-xs'>{company}</h4>
      <Link href={`${pageLinks.products}/${productId}`}>
        <h3 className='font-medium capitalize hover:underline'>{name}</h3>
      </Link>
      <h2 className='font-bold mt-4'>{formatCurrency(price * amount)}</h2>
      <h4 className='mt-4 capitalize text-xs'>
        Size:{' '}
        <span className={`font-medium${isSoldOut ? ' line-through' : ''}`}>{size}</span>
        {isSoldOut && (
          <span className='ml-2 text-destructive font-medium capitalize'>Sold Out</span>
        )}
      </h4>
      <h4 className='mt-1 capitalize text-xs'>Colour: {color}</h4>
      <h3
        className='mt-4 hover:underline cursor-pointer font-medium'
        onClick={toggleAction}
      >
        {!favouriteId ? 'Move to Favourite' : 'Remove From Favourite'}
      </h3>
    </div>
  );
};

export const ThirdColumn = ({
  quantity,
  id,
  isSoldOut = false,
}: {
  quantity: number;
  id: string;
  isSoldOut?: boolean;
}) => {
  const [amount, setAmount] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);
  const handleAmountChange = async (value: number) => {
    setIsLoading(true);
    toast('Calculating...');
    const result = await updateCartItemAction({
      amount: value,
      cartItemId: id,
    });
    setAmount(value);
    toast(`${result.message}`);
    setIsLoading(false);
  };
  if (isSoldOut) return <div className='md:ml-8' />;
  return (
    <div className='md:ml-8'>
      <SelectProductAmount
        isLoading={isLoading}
        amount={amount}
        setAmount={handleAmountChange}
      />
    </div>
  );
};

export const FourthColumn = ({ id }: { id: string }) => {
  return (
    <FormContainer action={removeCartItemAction}>
      <input type='hidden' name='id' value={id} />
      <div className='delete-btn-icon'>
        <IconButton actionType='deleteCart' />
      </div>
    </FormContainer>
  );
};
