import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { stripe } from '@/lib/stripe';
import {
  fetchOrderWithItems,
  fetchRelatedProducts,
} from '@/utils/actions/productActions';
import ProductsCarousel from '@/components/products/ProductsCarousel';
import { formatCurrency } from '@/utils/format';
import { pageLinks } from '@/utils/links';

export default async function Return({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)');

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  if (session.status === 'open') {
    return redirect('/');
  }

  if (session.status !== 'complete') return null;

  const orderId = session.metadata?.orderId;
  if (!orderId) return null;

  const [order, relatedProducts] = await Promise.all([
    fetchOrderWithItems(orderId),
    fetchRelatedProducts({ orderId }),
  ]);

  return (
    <div className='max-w-4xl mx-auto px-4 py-16 space-y-16'>
      <div className='flex flex-col items-center text-center gap-4'>
        <CheckCircle2 className='text-green-500 w-24 h-24' strokeWidth={1.5} />
        <h1 className='text-3xl font-semibold'>Order confirmed!</h1>
        <p className='text-muted-foreground max-w-md'>
          Thank you for your purchase. A confirmation email will be sent to{' '}
          <span className='text-foreground font-medium'>
            {session.customer_details?.email}
          </span>
          .
        </p>
      </div>

      {order && order.orderItems.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-xl font-medium'>Your order</h2>
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4'>
            {order.orderItems.map((item) => {
              const image = item.product.media[0]?.url ?? '';
              return (
                <div key={item.id} className='flex flex-col gap-1'>
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
                  <p className='text-sm font-medium leading-tight'>
                    {item.product.company.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {item.size && `Size: ${item.size}`}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {formatCurrency(item.price)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-xl font-medium'>You might also like</h2>
          <ProductsCarousel products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
