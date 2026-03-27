import React from 'react';
import { Button } from '../ui/button';

function AddtoCard({ productId }: { productId: string }) {
  return (
    <Button className='mt-8 capitalize' size={'lg'}>
      add to card
    </Button>
  );
}

export default AddtoCard;
