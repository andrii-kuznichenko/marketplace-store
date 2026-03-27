'use client';

import React from 'react';
import type { Product } from '@prisma/client';
import { formatCurrency } from '@/utils/format';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import Link from 'next/link';
import FavouriteToggleButton from './FavouriteToggleButton';
import { motion } from 'motion/react';

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
        const { name, price, image } = product;
        const productId = product.id;
        const currencyAmount = formatCurrency(price);

        return (
          <motion.div
            key={product.id}
            className='group relative h-full'
            variants={item}
          >
            <div className='absolute top-10 right-6 z-5'>
              <FavouriteToggleButton productId={productId} />
            </div>
            <Link href={`/products/${productId}`}>
              <Card className='h-full transform group-hover:shadow-sm transition-shadow duration-200'>
                <CardContent className='flex h-full flex-col p-4'>
                  <div className='relative aspect-2/3 overflow-hidden'>
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes={
                        '(max-width:768px) 100vw, max-width:1200px) 50vw, 33vw'
                      }
                      priority
                      className='rounded w-full object-cover transform group-hover:scale-105 transition-transform duration-200'
                      loading='eager'
                    />
                  </div>
                  <div className='mt-4 flex flex-1 flex-col'>
                    <h2 className='min-h-14 text-lg capitalize'>{name}</h2>
                    <p className='text-muted-foreground mt-2'>
                      {currencyAmount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default ProductsGrid;
