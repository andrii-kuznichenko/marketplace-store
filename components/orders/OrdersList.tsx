'use client';

import SectionTitle from '@/components/global/SectionTitle';
import OrderCard from './OrderCard';
import type { fetchUserOrders } from '@/utils/actions/orderActions';

type Orders = Awaited<ReturnType<typeof fetchUserOrders>>;

function groupOrdersByMonth(orders: Orders): Map<string, Orders> {
  const now = new Date();
  const groups = new Map<string, Orders>();

  for (const order of orders) {
    const date = new Date(order.createdAt);
    const isCurrentMonth =
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const key = isCurrentMonth
      ? 'This month'
      : new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(date);

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(order);
  }

  return groups;
}

export default function OrdersList({ orders }: { orders: Orders }) {
  const grouped = groupOrdersByMonth(orders);

  return (
    <div className='mt-8 space-y-12'>
      {Array.from(grouped.entries()).map(([month, monthOrders]) => (
        <section key={month}>
          <SectionTitle text={month} />
          <div className='mt-6 space-y-8'>
            {monthOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
