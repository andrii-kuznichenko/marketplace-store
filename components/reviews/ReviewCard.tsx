import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import Image from 'next/image';
import Rating from './Rating';
import Comment from './Comment';
import Link from 'next/link';
import { pageLinks } from '@/utils/links';

type ReviewCardProps = {
  reviewInfo: {
    comment: string;
    rating: number;
    name: string;
    image: string;
    productId: string;
  };
  children?: React.ReactNode;
};

function ReviewCard({ reviewInfo, children }: ReviewCardProps) {
  return (
    <Card className='relative'>
      <CardHeader>
        <Link href={`${pageLinks.products}/${reviewInfo.productId}`}>
          <div className='flex items-center'>
            <Image
              src={reviewInfo.image}
              alt={reviewInfo.name}
              width={48}
              height={48}
              className='w-12 h-12 rounded-full object-cover'
            />
            <div className='ml-4 '>
              <h3 className='text-sm font-bold capitalize mbg-1'>
                {reviewInfo.name}
              </h3>
              <Rating rating={reviewInfo.rating} />
            </div>
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <Comment comment={reviewInfo.comment} />
      </CardContent>
      <div className='absolute top-3 right-3'>{children}</div>
    </Card>
  );
}

export default ReviewCard;
