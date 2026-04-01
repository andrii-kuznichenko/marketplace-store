'use client';

import { fetchAllProducts } from '@/utils/actions';
import FavouriteToggleButton from './FavouriteToggleButton';
import { motion } from 'motion/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import ProductVerticalCard from './ProductVerticalCard';

type Product = Awaited<ReturnType<typeof fetchAllProducts>>[number];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.15, staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function ProductsCarousel({ products }: { products: Product[] }) {
  return (
    <div className='overflow-hidden'>
      <Carousel className='w-full'>
        <motion.div
          variants={container}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.25 }}
        >
          <CarouselContent viewportClassName='overflow-visible'>
            {products.map((product) => {
              return (
                <CarouselItem
                  key={product.id}
                  className='basis-4/5 sm:basis-[45%] lg:basis-[30%]'
                >
                  <motion.div className='group relative h-full' variants={item}>
                    <div className='absolute top-10 right-6 z-10'>
                      <FavouriteToggleButton productId={product.id} />
                    </div>
                    <ProductVerticalCard product={product} />
                  </motion.div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </motion.div>
      </Carousel>
    </div>
  );
}

export default ProductsCarousel;
