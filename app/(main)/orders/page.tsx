import { fetchUserOrders } from '@/utils/actions/orderActions';
import SectionTitle from '@/components/global/SectionTitle';
import EmptyList from '@/components/global/EmptyList';
import OrdersList from '@/components/orders/OrdersList';

async function OrderPage() {
  const orders = await fetchUserOrders();

  if (orders.length === 0) {
    return (
      <div className='mt-8'>
        <SectionTitle text='My orders' />
        <EmptyList heading='No orders yet.' className='mt-8' />
      </div>
    );
  }

  return <OrdersList orders={orders} />;
}

export default OrderPage;
