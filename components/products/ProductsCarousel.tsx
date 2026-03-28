'use client';

import React from 'react';
import type { Product } from '@prisma/client';
import { formatCurrency } from '@/utils/format';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import Link from 'next/link';
import FavouriteToggleButton from './FavouriteToggleButton';
import { motion } from 'motion/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductRating from '../single-product/ProductRating';
import ProductVerticalCard from './ProductVerticalCard';

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
    <Carousel className='w-full'>
      <motion.div
        variants={container}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.25 }}
      >
        <CarouselContent className='overflow-visible'>
          {products.map((product) => {
            return (
              <CarouselItem
                key={product.id}
                className='basis-4/5 sm:basis-1/2 lg:basis-1/3'
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
  );
}

export default ProductsCarousel;
