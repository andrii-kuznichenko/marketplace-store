'use client';

import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/utils/format';
import OrderProductItem from './OrderProductItem';
import type { fetchUserOrders } from '@/utils/actions/orderActions';

type Order = Awaited<ReturnType<typeof fetchUserOrders>>[number];

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div>
      <div className='flex gap-8 py-4 text-sm'>
        <div>
          <p className='font-medium'>Order date</p>
          <p className='text-muted-foreground mt-1'>{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className='font-medium'>Total</p>
          <p className='text-muted-foreground mt-1'>{formatCurrency(order.orderTotal)}</p>
        </div>
        <div>
          <p className='font-medium'>Payment status</p>
          <p className='text-muted-foreground mt-1'>{order.isPaid ? 'Paid' : 'Open'}</p>
        </div>
      </div>

      <div className='space-y-6 mt-2'>
        {order.parcels.map((parcel, index) => {
          const parcelItems = order.orderItems.filter(
            (item) => item.product.company.id === parcel.companyId,
          );
          return (
            <div key={parcel.id}>
              <div className='flex items-center justify-between mb-3 text-sm'>
                <span className='text-muted-foreground'>
                  Parcel {index + 1} of {order.parcels.length} · {parcel.company.name}
                </span>
                <span className={parcel.isDelivered ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                  {parcel.isDelivered ? 'Delivered' : 'Not delivered'}
                </span>
              </div>
              <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4'>
                {parcelItems.map((item) => (
                  <OrderProductItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Separator className='mt-8' />
    </div>
  );
}
