import { fetchFeaturedProducts } from '@/utils/actions/productActions';
import { Suspense } from 'react';
import EmptyList from '../global/EmptyList';
import LoadingContainer from '../global/LoadingContainer';
import ProductsCarousel from '../products/ProductsCarousel';
import { AnimatedHeading } from '../global/animation/AnimatedHeading';

async function FeaturedProducts() {
  const products = await fetchFeaturedProducts();
  if (products.length === 0) return <EmptyList />;

  return (
    <section className='pt-24'>
      <AnimatedHeading firstWord={'Our'} secondWord={'Choice'} />
      <div className='mt-6'>
        <Suspense fallback={<LoadingContainer />}>
          <ProductsCarousel products={products} />
        </Suspense>
      </div>
    </section>
  );
}

export default FeaturedProducts;
