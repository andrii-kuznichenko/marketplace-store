import { Suspense } from 'react';
import Checkout from '@/components/stripe/Checkout';

export default function Page() {
  return (
    <div id='checkout'>
      <Suspense>
        <Checkout />
      </Suspense>
    </div>
  );
}