import { fetchAllProducts } from '@/utils/actions/productActions';
import FavouriteToggleButton from './FavouriteToggleButton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import ProductVerticalCard from './ProductVerticalCard';
import { AnimatedCarouselContainer, AnimatedCarouselItem } from './animation/AnimatedCarousel';

type Product = Awaited<ReturnType<typeof fetchAllProducts>>[number];

function ProductsCarousel({ products }: { products: Product[] }) {
  return (
    <div className='overflow-hidden'>
      <Carousel className='w-full'>
        <AnimatedCarouselContainer>
          <CarouselContent viewportClassName='overflow-visible'>
            {products.map((product) => {
              return (
                <CarouselItem
                  key={product.id}
                  className='basis-4/5 sm:basis-[45%] lg:basis-[30%]'
                >
                  <AnimatedCarouselItem>
                    <div className='absolute top-10 right-6 z-10'>
                      <FavouriteToggleButton productId={product.id} />
                    </div>
                    <ProductVerticalCard product={product} />
                  </AnimatedCarouselItem>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </AnimatedCarouselContainer>
      </Carousel>
    </div>
  );
}

export default ProductsCarousel;
