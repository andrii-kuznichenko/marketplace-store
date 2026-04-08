import { fetchAdminOrderById } from '@/utils/actions/orderActions';
import { formatCurrency, formatDate } from '@/utils/format';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DeliveredButton from '@/components/admin/DeliveredButton';
import { pageLinks } from '@/utils/links';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await fetchAdminOrderById(id);

  if (!order) return notFound();

  const deliveredCount = order.parcels.filter((parcel) => parcel.isDelivered).length;

  return (
    <div className='max-w-3xl'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <p className='text-xs text-muted-foreground mb-1'>Order</p>
          <p className='font-mono text-sm'>{order.id}</p>
        </div>
        <Button asChild variant='ghost' size='sm'>
          <Link href='/admin/sales'>← Back</Link>
        </Button>
      </div>

      <Separator />

      {/* Meta info */}
      <div className='grid grid-cols-2 sm:flex sm:justify-between gap-4 py-6 text-sm'>
        <div>
          <p className='text-muted-foreground mb-1'>Date</p>
          <p className='font-medium'>{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className='text-muted-foreground mb-1'>Email</p>
          <p className='font-medium'>{order.email}</p>
        </div>
        <div>
          <p className='text-muted-foreground mb-1'>Payment</p>
          <p className={order.isPaid ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
            {order.isPaid ? 'Paid' : 'Open'}
          </p>
        </div>
        <div>
          <p className='text-muted-foreground mb-1'>Delivery</p>
          <p className={deliveredCount === order.parcels.length && order.parcels.length > 0 ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
            {deliveredCount === order.parcels.length && order.parcels.length > 0 ? 'Delivered' : 'Pending'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Delivery address */}
      <div className='py-6 text-sm'>
        <p className='font-medium mb-3'>Delivery address</p>
        <div className='text-muted-foreground space-y-1'>
          <p>{order.recipientName}</p>
          <p>{order.street}</p>
          <p>{order.postalCode} {order.city}</p>
          <p>{order.country}</p>
        </div>
      </div>

      <Separator />

      {/* Parcels */}
      <div className='py-6 space-y-8'>
        {order.parcels.map((parcel, index) => {
          const parcelItems = order.orderItems.filter(
            (item) => item.product.company.id === parcel.companyId,
          );
          const parcelTotal = parcelItems.reduce(
            (sum, item) => sum + item.price * item.amount,
            0,
          );

          return (
            <div key={parcel.id}>
              <div className='flex items-center justify-between mb-4'>
                <p className='font-medium text-sm'>
                  Parcel {index + 1} of {order.parcels.length} · {parcel.company.name}
                </p>
                <span className={parcel.isDelivered ? 'text-green-600 text-sm font-medium' : 'text-muted-foreground text-sm'}>
                  {parcel.isDelivered ? 'Delivered' : 'Pending'}
                </span>
              </div>

              <div className='space-y-4'>
                {parcelItems.map((item) => {
                  const image = item.product.media[0]?.url ?? '';
                  return (
                    <div key={item.id} className='flex items-center gap-4'>
                      <div className='relative w-16 h-20 bg-muted rounded overflow-hidden shrink-0'>
                        {image && (
                          <Image
                            src={image}
                            alt={item.product.name}
                            fill
                            sizes='64px'
                            className='object-cover'
                          />
                        )}
                      </div>
                      <div className='flex-1 text-sm'>
                        <Link
                          href={`${pageLinks.products}/${item.product.id}`}
                          className='font-medium hover:underline'
                        >
                          {item.product.name}
                        </Link>
                        <p className='text-muted-foreground text-xs mt-0.5'>
                          Size: {item.size} · Colour: {item.color}
                        </p>
                      </div>
                      <div className='text-sm text-right shrink-0'>
                        <p className='text-muted-foreground'>×{item.amount}</p>
                        <p className='font-medium'>{formatCurrency(item.price * item.amount)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className='flex items-center justify-between mt-4 pt-4 border-t text-sm'>
                <div className='flex gap-6'>
                  <span className='text-muted-foreground'>Parcel total</span>
                  <span className='font-medium'>{formatCurrency(parcelTotal)}</span>
                </div>
                {!parcel.isDelivered && <DeliveredButton parcelId={parcel.id} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order total — only for superadmin */}
      {order.companyTotal === null && (
        <>
          <Separator />
          <div className='py-6 text-sm space-y-1'>
            <div className='flex gap-8'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span>{formatCurrency(order.orderTotal - order.shipping)}</span>
            </div>
            <div className='flex gap-8'>
              <span className='text-muted-foreground'>Shipping</span>
              <span>{formatCurrency(order.shipping)}</span>
            </div>
            <div className='flex gap-8 font-medium'>
              <span>Total</span>
              <span>{formatCurrency(order.orderTotal)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
