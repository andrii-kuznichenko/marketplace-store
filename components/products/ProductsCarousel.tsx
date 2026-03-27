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

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.15, staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function ProductsCarousel({ products }: { products: Product[] }) {
  return (
    <Carousel className='w-full'>
      <motion.div variants={container} initial='hidden' animate='visible'>
        <CarouselContent className='overflow-visible'>
          {products.map((product) => {
            const { name, price, image } = product;
            const currencyAmount = formatCurrency(price);

            return (
              <CarouselItem key={product.id} className='basis-4/5 sm:basis-1/2 lg:basis-1/3'>
                <motion.div className='group relative h-full' variants={item}>
                  <div className='absolute top-10 right-6 z-10'>
                    <FavouriteToggleButton productId={product.id} />
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <Card className='h-full group-hover:shadow-sm transition-shadow duration-200'>
                      <CardContent className='flex h-full flex-col p-4'>
                        <div className='relative aspect-2/3 overflow-hidden'>
                          <Image
                            src={image}
                            alt={name}
                            fill
                            sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw'
                            priority
                            className='rounded object-cover group-hover:scale-105 transition-transform duration-200'
                          />
                        </div>
                        <div className='mt-4 flex flex-1 flex-col'>
                          <h2 className='min-h-14 text-lg capitalize'>
                            {name}
                          </h2>
                          <p className='text-muted-foreground mt-2'>{currencyAmount}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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
