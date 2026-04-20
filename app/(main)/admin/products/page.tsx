import EmptyList from '@/components/global/EmptyList';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteProductAction } from '@/utils/actions/adminProductActions';
import { fetchAdminProducts } from '@/utils/actions/adminProductQueries';
import Link from 'next/link';
import { pageLinks } from '@/utils/links';
import { formatCurrency } from '@/utils/format';
import { IconButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';

async function AdminProductsPage() {
  const items = await fetchAdminProducts();

  if (items.length === 0) return <EmptyList />;
  return (
    <section>
      {/* Desktop table */}
      <div className='hidden md:block'>
        <Table>
          <TableCaption className='capitalize'>
            total products: {items.length}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const { id: productId, name, company, price, color } = item;
              return (
                <TableRow key={productId}>
                  <TableCell>
                    <Link
                      href={`${pageLinks.products}/${productId}`}
                      className='underline text-muted-foreground tracking-wide capitalize'
                    >
                      {name}
                    </Link>
                  </TableCell>
                  <TableCell>{color ?? '—'}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{formatCurrency(price)}</TableCell>
                  <TableCell className='flex items-center gap-x-2'>
                    <Link href={`${pageLinks.adminProducts}/${productId}/edit`}>
                      <IconButton actionType='edit' />
                    </Link>
                    <Link href={`${pageLinks.adminProducts}/create?variantOf=${productId}`}>
                      <IconButton actionType='color' />
                    </Link>
                    <DeleteProduct productId={productId} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className='md:hidden space-y-3 mt-4'>
        <p className='text-sm text-muted-foreground capitalize'>total products: {items.length}</p>
        {items.map((item) => {
          const { id: productId, name, company, price, color } = item;
          return (
            <div key={productId} className='rounded-lg border border-border p-4 flex flex-col gap-3'>
              <div className='flex items-start justify-between gap-2'>
                <Link
                  href={`${pageLinks.products}/${productId}`}
                  className='underline text-muted-foreground tracking-wide capitalize font-medium leading-snug'
                >
                  {name}
                </Link>
                <span className='text-sm font-semibold shrink-0'>{formatCurrency(price)}</span>
              </div>
              <div className='flex gap-3 text-sm text-muted-foreground'>
                <span>{company.name}</span>
                {color && <span>· {color}</span>}
              </div>
              <div className='flex items-center gap-2 pt-1 border-t border-border'>
                <Link href={`${pageLinks.adminProducts}/${productId}/edit`}>
                  <IconButton actionType='edit' />
                </Link>
                <Link href={`${pageLinks.adminProducts}/create?variantOf=${productId}`}>
                  <IconButton actionType='color' />
                </Link>
                <DeleteProduct productId={productId} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DeleteProduct({ productId }: { productId: string }) {
  const deleteProduct = deleteProductAction.bind(null, { productId });
  return (
    <FormContainer action={deleteProduct}>
      <IconButton actionType='delete' />
    </FormContainer>
  );
}

export default AdminProductsPage;
