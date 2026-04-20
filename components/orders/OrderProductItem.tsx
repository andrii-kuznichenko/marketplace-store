'use client';

import Image from 'next/image';
import Link from 'next/link';
import { pageLinks } from '@/utils/links';
import type { fetchUserOrders } from '@/utils/actions/orderActions';

type OrderItem = Awaited<ReturnType<typeof fetchUserOrders>>[number]['orderItems'][number];

export default function OrderProductItem({ item }: { item: OrderItem }) {
  const image = item.product.media[0]?.url ?? '';

  return (
    <div className='flex flex-col gap-1'>
      <div className='relative aspect-2/3 bg-muted rounded overflow-hidden'>
        <Link href={`${pageLinks.products}/${item.product.id}`} className='absolute inset-0'>
          {image ? (
            <Image
              src={image}
              alt={item.product.name}
              fill
              sizes='(max-width:640px) 33vw, (max-width:1024px) 20vw, 16vw'
              className='object-cover'
            />
          ) : (
            <div className='w-full h-full bg-muted' />
          )}
        </Link>
      </div>
      <p className='text-sm font-medium leading-tight'>{item.product.company.name}</p>
      <p className='text-xs text-muted-foreground'>Size: {item.size}</p>
    </div>
  );
}
