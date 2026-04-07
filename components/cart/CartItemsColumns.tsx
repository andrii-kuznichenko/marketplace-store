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

export const FirstColumn = ({
  name,
  image,
}: {
  image: string;
  name: string;
}) => {
  return (
    <div className='relative w-24 sm:w-32 aspect-3/4'>
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

export const SecondColumn = ({
  name,
  company,
  productId,
  price,
  size,
  color,
  amount,
}: {
  name: string;
  company: string;
  productId: string;
  price: number;
  size: string;
  color: string;
  amount: number;
}) => {
  return (
    <div className='sm:w-48'>
      <h4 className='mt-1 capitalize text-xs'>{company}</h4>
      <Link href={`${pageLinks.products}/${productId}`}>
        <h3 className='font-medium capitalize hover:underline'>{name}</h3>
      </Link>
      <h2 className='font-bold md:ml-auto mt-4'>{formatCurrency(price*amount)}</h2>
      <h4 className='mt-4 capitalize text-xs'>
        Size: <span className='font-medium'>{size}</span>
      </h4>
      <h4 className='mt-1 capitalize text-xs'>Color: {color}</h4>
    </div>
  );
};

export const ThirdColumn = ({
  quantity,
  id,
}: {
  quantity: number;
  id: string;
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
      <IconButton actionType='deleteCart' />
    </FormContainer>
  );
};
