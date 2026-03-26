import { fetchAllProducts } from '@/utils/actions';
import { FiGrid } from 'react-icons/fi';
import { FaListUl } from 'react-icons/fa';
import ProductsGrid from './ProductsGrid';
import ProductsList from './ProductsList';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Separator } from '../ui/separator';

async function ProductsContainer({
  layout,
  search,
}: {
  layout: string;
  search: string;
}) {
  const products = await fetchAllProducts();
  const totalProducts = products.length;
  const searchTerms = search ? `&search=${search}` : '';
  return (
    <>
      {/* HEADER */}
      <section>
        <div className='flex justify-between items-center'>
          <h4 className='font-medium text-lg'>
            {totalProducts} product{totalProducts > 1 && 's'}
          </h4>
          <div className='flex'>
            <Button
              variant={layout === 'grid' ? 'default' : 'ghost'}
              size={'icon'}
              asChild
            >
              <Link href={`/products?layout=grid${searchTerms}`}>
                <FiGrid />
              </Link>
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'ghost'}
              size={'icon'}
              asChild
            >
              <Link href={`/products?layout=list${searchTerms}`}>
                <FaListUl />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Separator className='mt-4' />
      {/* PRODUCTS */}
      <div>
        {totalProducts === 0 ? (
          <h5 className='text-2xl mt-16'>
            Sorry no products matched your search...
          </h5>
        ) : layout === 'grid' ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
    </>
  );
}

export default ProductsContainer;
