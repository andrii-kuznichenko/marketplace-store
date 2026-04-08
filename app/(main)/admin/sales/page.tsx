import { fetchAdminOrders, fetchCompanyOrders } from '@/utils/actions/orderActions';
import { isSuperAdmin } from '@/utils/roles';
import { formatCurrency, formatDate } from '@/utils/format';
import SectionTitle from '@/components/global/SectionTitle';
import EmptyList from '@/components/global/EmptyList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

async function AdminSalesPage() {
  const superAdmin = await isSuperAdmin();

  if (superAdmin) {
    const orders = await fetchAdminOrders();
    if (orders.length === 0) return <EmptyList heading='No orders yet.' />;

    return (
      <div>
        <SectionTitle text='All orders' />
        <Table className='mt-6'>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const deliveredCount = order.parcels.filter((parcel) => parcel.isDelivered).length;
              const totalParcels = order.parcels.length;
              return (
                <TableRow key={order.id}>
                  <TableCell className='text-muted-foreground'>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{order.recipientName}</TableCell>
                  <TableCell className='text-muted-foreground'>{order.city}, {order.country}</TableCell>
                  <TableCell className='text-center'>{order.orderItems.length}</TableCell>
                  <TableCell>{formatCurrency(order.orderTotal)}</TableCell>
                  <TableCell>
                    <span className={order.isPaid ? 'text-green-600' : 'text-muted-foreground'}>
                      {order.isPaid ? 'Paid' : 'Open'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {totalParcels === 0 ? (
                      <span className='text-muted-foreground'>—</span>
                    ) : deliveredCount === totalParcels ? (
                      <span className='text-green-600'>{deliveredCount}/{totalParcels}</span>
                    ) : (
                      <span className='text-muted-foreground'>{deliveredCount}/{totalParcels}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild size='sm' variant='outline'>
                      <Link href={`/admin/sales/${order.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Company admin
  const companyOrders = await fetchCompanyOrders();
  if (companyOrders.length === 0) return <EmptyList heading='No orders yet.' />;

  return (
    <div>
      <SectionTitle text='Orders' />
      <Table className='mt-6'>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Your total</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Delivered</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companyOrders.map(({ order, items, companyTotal, parcel }) => (
            <TableRow key={order.id}>
              <TableCell className='text-muted-foreground'>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{order.recipientName}</TableCell>
              <TableCell className='text-muted-foreground'>{order.city}, {order.country}</TableCell>
              <TableCell className='text-center'>{items.length}</TableCell>
              <TableCell>{formatCurrency(companyTotal)}</TableCell>
              <TableCell>
                <span className={order.isPaid ? 'text-green-600' : 'text-muted-foreground'}>
                  {order.isPaid ? 'Paid' : 'Open'}
                </span>
              </TableCell>
              <TableCell>
                <span className={parcel?.isDelivered ? 'text-green-600' : 'text-muted-foreground'}>
                  {parcel?.isDelivered ? 'Delivered' : '—'}
                </span>
              </TableCell>
              <TableCell>
                <Button asChild size='sm' variant='outline'>
                  <Link href={`/admin/sales/${order.id}`}>Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminSalesPage;
