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

        {/* Desktop table */}
        <div className='hidden md:block'>
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
                const deliveredCount = order.parcels.filter((p) => p.isDelivered).length;
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

        {/* Mobile cards */}
        <div className='md:hidden space-y-3 mt-4'>
          {orders.map((order) => {
            const deliveredCount = order.parcels.filter((p) => p.isDelivered).length;
            const totalParcels = order.parcels.length;
            return (
              <div key={order.id} className='rounded-lg border border-border p-4 flex flex-col gap-2'>
                <div className='flex items-start justify-between gap-2'>
                  <div>
                    <p className='font-medium capitalize'>{order.recipientName}</p>
                    <p className='text-xs text-muted-foreground'>{order.email}</p>
                  </div>
                  <span className='text-sm font-semibold shrink-0'>{formatCurrency(order.orderTotal)}</span>
                </div>
                <div className='flex gap-3 text-sm text-muted-foreground'>
                  <span>{order.city}, {order.country}</span>
                  <span>· {order.orderItems.length} items</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <span className={order.isPaid ? 'text-green-600' : 'text-muted-foreground'}>
                    {order.isPaid ? 'Paid' : 'Open'}
                  </span>
                  <span className='text-muted-foreground'>·</span>
                  {totalParcels === 0 ? (
                    <span className='text-muted-foreground'>Not shipped</span>
                  ) : deliveredCount === totalParcels ? (
                    <span className='text-green-600'>Delivered {deliveredCount}/{totalParcels}</span>
                  ) : (
                    <span className='text-muted-foreground'>Delivered {deliveredCount}/{totalParcels}</span>
                  )}
                </div>
                <div className='flex items-center justify-between pt-2 border-t border-border'>
                  <span className='text-xs text-muted-foreground'>{formatDate(order.createdAt)}</span>
                  <Button asChild size='sm' variant='outline'>
                    <Link href={`/admin/sales/${order.id}`}>Details</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Company admin
  const companyOrders = await fetchCompanyOrders();
  if (companyOrders.length === 0) return <EmptyList heading='No orders yet.' />;

  return (
    <div>
      <SectionTitle text='Orders' />

      {/* Desktop table */}
      <div className='hidden md:block'>
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

      {/* Mobile cards */}
      <div className='md:hidden space-y-3 mt-4'>
        {companyOrders.map(({ order, items, companyTotal, parcel }) => (
          <div key={order.id} className='rounded-lg border border-border p-4 flex flex-col gap-2'>
            <div className='flex items-start justify-between gap-2'>
              <p className='font-medium capitalize'>{order.recipientName}</p>
              <span className='text-sm font-semibold shrink-0'>{formatCurrency(companyTotal)}</span>
            </div>
            <div className='flex gap-3 text-sm text-muted-foreground'>
              <span>{order.city}, {order.country}</span>
              <span>· {items.length} items</span>
            </div>
            <div className='flex items-center gap-3 text-sm'>
              <span className={order.isPaid ? 'text-green-600' : 'text-muted-foreground'}>
                {order.isPaid ? 'Paid' : 'Open'}
              </span>
              <span className='text-muted-foreground'>·</span>
              <span className={parcel?.isDelivered ? 'text-green-600' : 'text-muted-foreground'}>
                {parcel?.isDelivered ? 'Delivered' : 'Not delivered'}
              </span>
            </div>
            <div className='flex items-center justify-between pt-2 border-t border-border'>
              <span className='text-xs text-muted-foreground'>{formatDate(order.createdAt)}</span>
              <Button asChild size='sm' variant='outline'>
                <Link href={`/admin/sales/${order.id}`}>Details</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminSalesPage;
