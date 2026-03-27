import { fetchAllProducts } from '@/utils/actions';
import { FiGrid } from 'react-icons/fi';
import { FaListUl } from 'react-icons/fa';
import ProductsGrid from './ProductsGrid';
import ProductsList from './ProductsList';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { LiquidToggleGroup, LiquidToggleItem } from './animation';
import ProductsCarousel from './ProductsCarousel';

async function ProductsContainer({
  layout,
  search,
}: {
  layout: 'grid' | 'list' | 'carousel';
  search: string;
}) {
  const products = await fetchAllProducts();
  const totalProducts = products.length;
  const searchTerms = search ? `&search=${search}` : '';

  const content = (() => {
    if (totalProducts === 0) {
      return (
        <h5 className='text-2xl mt-16'>
          Sorry no products matched your search...
        </h5>
      );
    }

    switch (layout) {
      case 'grid':
        return <ProductsGrid products={products} />;
      case 'list':
        return <ProductsList products={products} />;
      case 'carousel':
        return <ProductsCarousel products={products} />;
      default:
        return <ProductsGrid products={products} />;
    }
  })();

  return (
    <>
      {/* HEADER */}
      <section>
        <div className='flex justify-between items-end'>
          <p className='font-medium text-xs opacity-70'>
            {totalProducts} product{totalProducts > 1 && 's'}
          </p>
          <div className='flex'>
            <LiquidToggleGroup activeValue={layout}>
              <LiquidToggleItem value='grid'>
                <Button
                  variant={layout === 'grid' ? 'default' : 'ghost'}
                  size={'icon'}
                  asChild
                >
                  <Link href={`/products?layout=grid${searchTerms}`}>
                    <FiGrid />
                  </Link>
                </Button>
              </LiquidToggleItem>
              <LiquidToggleItem value='list'>
                <Button
                  variant={layout === 'list' ? 'default' : 'ghost'}
                  size={'icon'}
                  asChild
                >
                  <Link href={`/products?layout=list${searchTerms}`}>
                    <FaListUl />
                  </Link>
                </Button>
              </LiquidToggleItem>
            </LiquidToggleGroup>
          </div>
        </div>
      </section>
      <Separator className='mt-3' />
      {/* PRODUCTS */}
      <div>{content}</div>
    </>
  );
}

export default ProductsContainer;
