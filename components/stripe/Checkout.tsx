'use client';

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { fetchClientSecret } from '@/utils/actions/stripeActions';
import { useSearchParams } from 'next/navigation';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export default function Checkout() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const cartId = searchParams.get('cartId');
  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret: () => fetchClientSecret({ orderId: orderId!, cartId: cartId! }) }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
