import { fetchAllProducts } from '@/utils/actions/productActions';
import FavouriteToggleButton from './FavouriteToggleButton';
import ProductVerticalCard from './ProductVerticalCard';
import { AnimatedGridContainer, AnimatedGridItem } from './animation/AnimatedGrid';

type Product = Awaited<ReturnType<typeof fetchAllProducts>>[number];

function ProductsGrid({ products }: { products: Product[] }) {
  return (
    <AnimatedGridContainer>
      {products.map((product) => {
        const productId = product.id;
        return (
          <AnimatedGridItem key={productId}>
            <div className='absolute top-3 right-2 md:top-10 md:right-6 z-5'>
              <FavouriteToggleButton productId={productId} />
            </div>
            <ProductVerticalCard product={product} />
          </AnimatedGridItem>
        );
      })}
    </AnimatedGridContainer>
  );
}

export default ProductsGrid;
