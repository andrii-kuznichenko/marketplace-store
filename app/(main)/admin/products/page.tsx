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
import { deleteProductAction, fetchAdminProducts } from '@/utils/actions';
import Link from 'next/link';
import { pageLinks } from '@/utils/links';
import { formatCurrency } from '@/utils/format';
import { IconButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import { Button } from '@/components/ui/button';
import { PiPaletteThin } from "react-icons/pi";

async function AdminProductsPage() {
  const items = await fetchAdminProducts();

  if (items.length === 0) return <EmptyList />;
  return (
    <section>
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
                    <Button size='icon' variant='link' className='p-2 cursor-pointer' title='Add color variant'>
                      <PiPaletteThin />
                    </Button>
                  </Link>
                  <DeleteProduct productId={productId} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
