'use client';

import { useState } from 'react';
import { IoMdStar, IoMdStarOutline } from 'react-icons/io';
import { Label } from '../ui/label';

function RatingInput({ name, label }: { name: string; label?: string }) {
  const [rating, setRating] = useState(1);
  const numbers = Array.from({ length: 5 }, (_, index) => {
    const value = index + 1;
    return value;
  });

  const starClass = 'w-8 h-8 cursor-pointer';

  return (
    <div className='mb-2 max-w-xs'>
      <Label>{label || ''}</Label>
      <div className='flex gap-x-2'>
        {numbers.map((value) =>
          rating >= value ? (
            <IoMdStar
              key={value}
              onClick={() => setRating(value)}
              className={starClass}
            />
          ) : (
            <IoMdStarOutline
              key={value}
              onClick={() => setRating(value)}
              className={starClass}
              name={name}
            />
          ),
        )}
      </div>
      <input type='hidden' name={name} value={rating} />
    </div>
  );
}

export default RatingInput;
