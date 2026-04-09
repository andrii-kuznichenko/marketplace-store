import { stripe } from '@/lib/stripe';
import db from '@/utils/db';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return Response.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const cartId = session.metadata?.cartId;

    if (!orderId || !cartId) {
      console.error('Missing orderId or cartId in session metadata');
      return Response.json({ error: 'Missing metadata' }, { status: 400 });
    }

    await db.order.update({
      where: { id: orderId },
      data: { isPaid: true },
    });

    await db.cart.delete({
      where: { id: cartId },
    });
  }

  return Response.json({ received: true });
}
