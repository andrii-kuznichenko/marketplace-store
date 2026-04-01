'use client';

import { fetchAllProducts } from '@/utils/actions';

type Product = Awaited<ReturnType<typeof fetchAllProducts>>[number];
import FavouriteToggleButton from './FavouriteToggleButton';
import { motion } from 'motion/react';
import ProductVerticalCard from './ProductVerticalCard';

function ProductsGrid({ products }: { products: Product[] }) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.15,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial='hidden'
      animate='visible'
      className='pt-12 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    >
      {products.map((product) => {
        const productId = product.id;

        return (
          <motion.div
            key={productId}
            className='group relative h-full'
            variants={item}
          >
            <div className='absolute top-10 right-6 z-5'>
              <FavouriteToggleButton productId={productId} />
            </div>
            <ProductVerticalCard product={product} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default ProductsGrid;
